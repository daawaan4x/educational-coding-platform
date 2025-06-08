import { db } from "@/db";
import { classes, users, users_to_classes } from "@/db/schema";
import { ClassSchema, UserSchema } from "@/db/validation";
import { pagination } from "@/server/lib/pagination";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, ilike, inArray, or, sql } from "drizzle-orm";
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
		size: z.int().gte(1).lte(50).default(50),
		page: z.int().gte(1).default(1),
		search: z.string().optional(),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// For admin users, show all classes directly
		// For non-admin users, only show classes they have access to
		const records = await pagination(() =>
			db
				.selectDistinctOn([classes.id], { ...getTableColumns(classes) })
				.from(users_to_classes)
				.innerJoin(classes, eq(users_to_classes.class_id, classes.id))
				.where(
					and(
						eq(classes.is_deleted, false),
						input.search ? or(ilike(classes.name, `%${input.search}%`)) : undefined,
						user.is("admin") ? undefined : eq(users_to_classes.user_id, user.id),
					),
				)
				.orderBy(classes.id)
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

		// Remove all users from the class first
		await db.delete(users_to_classes).where(eq(users_to_classes.class_id, input.id));

		// Soft-delete Class
		await db.update(classes).set({ is_deleted: true }).where(eq(classes.id, input.id));
		record.is_deleted = true;

		return record;
	},
});

export const add_users = authed({
	require: ["classes:update"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
		user_ids: z.array(UserSchema.Select.shape.id).min(1),
	}),

	async fn({ ctx, input }) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { user } = ctx;

		// Check if User has access to Class
		await find({ ctx, input });

		// Verify all users exist and are not deleted
		const existingUsers = await db
			.select({ id: users.id, role: users.role })
			.from(users)
			.where(and(inArray(users.id, input.user_ids), eq(users.is_deleted, false)));

		if (existingUsers.length !== input.user_ids.length) {
			throw new TRPCError({ code: "BAD_REQUEST", message: "One or more users do not exist" });
		}

		// Filter out admin users - only allow teachers and students
		const validUsers = existingUsers.filter((u) => u.role !== "admin");
		const validUserIds = validUsers.map((u) => u.id);

		if (validUserIds.length === 0) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "No valid users to add to class (admin users cannot be added to classes)",
			});
		}

		// Check which users are already in the class
		const existingMemberships = await db
			.select({ user_id: users_to_classes.user_id })
			.from(users_to_classes)
			.where(and(eq(users_to_classes.class_id, input.id), inArray(users_to_classes.user_id, validUserIds)));

		const existingUserIds = existingMemberships.map((m) => m.user_id);
		const newUserIds = validUserIds.filter((id) => !existingUserIds.includes(id));

		// Add users to class (only those not already in the class)
		if (newUserIds.length > 0) {
			await db.insert(users_to_classes).values(
				newUserIds.map((user_id) => ({
					user_id,
					class_id: input.id,
				})),
			);
		}

		return {
			added: newUserIds.length,
			already_in_class: existingUserIds.length,
			total: validUserIds.length,
			admin_users_excluded: existingUsers.length - validUsers.length,
		};
	},
});

export const remove_users = authed({
	require: ["classes:update"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
		user_ids: z.array(UserSchema.Select.shape.id).min(1),
	}),

	async fn({ ctx, input }) {
		// Check if User has access to Class
		await find({ ctx, input });

		// Check which users are currently in the class
		const existingMemberships = await db
			.select({ user_id: users_to_classes.user_id })
			.from(users_to_classes)
			.where(and(eq(users_to_classes.class_id, input.id), inArray(users_to_classes.user_id, input.user_ids)));

		const existingUserIds = existingMemberships.map((m) => m.user_id);
		const notInClassIds = input.user_ids.filter((id) => !existingUserIds.includes(id));

		// Remove users from class (only those currently in the class)
		if (existingUserIds.length > 0) {
			await db
				.delete(users_to_classes)
				.where(and(eq(users_to_classes.class_id, input.id), inArray(users_to_classes.user_id, existingUserIds)));
		}

		return {
			removed: existingUserIds.length,
			not_in_class: notInClassIds.length,
			total_requested: input.user_ids.length,
		};
	},
});

export const routers = t.router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	remove: authedProcedure().input(remove.input).mutation(remove),
	add_users: authedProcedure().input(add_users.input).mutation(add_users),
	remove_users: authedProcedure().input(remove_users.input).mutation(remove_users),
});
