import { db } from "@/db";
import { classes, users_to_classes } from "@/db/schema";
import { ClassSchema } from "@/db/validation";
import { pagination } from "@/lib/server/pagination";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { t } from "../trpc";
import { authed, authedProcedure } from "../trpc/auth";
import { UserService } from "./users";

export * as ClassService from "./classes";

export const find = authed({
	require: ["classes:read"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Get Class
		const query_class = db
			.select({
				...getTableColumns(classes),
			})
			.from(classes)
			.where(and(eq(classes.id, input.id), eq(classes.is_deleted, false)));

		const [record] = await query_class;

		if (!record) throw new TRPCError({ code: "NOT_FOUND" });

		// Check if User is in Class
		await UserService.requireClass(user, record.id);

		return record;
	},
});

export const list = authed({
	require: ["classes:read"],
	input: z.object({
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Get list of Classes where User has access
		const records = await pagination(() =>
			db
				.select({
					...getTableColumns(classes),
				})
				.from(users_to_classes)
				.innerJoin(classes, eq(users_to_classes.class_id, classes.id))
				.where(
					and(
						eq(classes.is_deleted, false),

						// Remove filter if User is Admin
						user.is("admin") ? undefined : eq(users_to_classes.user_id, user.id),
					),
				)
				.$dynamic(),
		)(input);

		return records;
	},
});

export const create = authed({
	require: ["classes:create"],
	input: z.object({
		data: ClassSchema.Insert,
	}),

	async fn({ input }) {
		// Create Class
		const [record] = await db.insert(classes).values(input.data).returning();
		return record;
	},
});

export const update = authed({
	require: ["classes:update"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
		data: ClassSchema.Update,
	}),

	async fn({ ctx, input }) {
		// Check if User has access to Class
		await find({ ctx, input });

		// Update Class
		const [record] = await db
			.update(classes)
			.set({
				...input.data,
				date_modified: sql`now()`,
			})
			.where(eq(classes.id, input.id))
			.returning();
		return record;
	},
});

export const remove = authed({
	require: ["classes:delete"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Check if User has access to Class
		const record = await find({ ctx, input });

		// Run Checks if User is not Admin
		if (!user.is("admin")) {
			// Error if Class still has users
			const users = await UserService.list({ ctx, input: { class_id: input.id } });
			if (users.data.length > 0) throw new TRPCError({ code: "CONFLICT", message: "Class still has users" });
		}

		// Soft-delete Class
		await db.update(classes).set({ is_deleted: true }).where(eq(classes.id, input.id));
		record.is_deleted = true;

		return record;
	},
});

export const routers = t.router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	remove: authedProcedure().input(remove.input).mutation(remove),
});
