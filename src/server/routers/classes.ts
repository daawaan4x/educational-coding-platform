import { db } from "@/db";
import { classes, problems, users, users_to_classes } from "@/db/schema";
import { ClassSchema } from "@/db/validation";
import { jsonb_agg, jsonb_build_object } from "@/lib/sql";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { authed, authedProcedure, router } from "../trpc";

const find = authed({
	require: ["classes:read"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Get Class w/ list of Problems and Users
		const subquery_problems = db
			.select({
				data: jsonb_agg(jsonb_build_object({ ...getTableColumns(problems) })).as("data"),
			})
			.from(problems)
			.where(and(eq(problems.class_id, classes.id), eq(problems.is_deleted, false)))
			.as("problems");

		const subquery_users = db
			.select({
				data: jsonb_agg(jsonb_build_object({ ...getTableColumns(users) })).as("data"),
			})
			.from(users_to_classes)
			.leftJoin(users, eq(users_to_classes.user_id, users.id))
			.where(and(eq(users_to_classes.class_id, classes.id), eq(users.is_deleted, false)))
			.as("users");

		const query_class = db
			.select({
				...getTableColumns(classes),
				problems: sql<typeof subquery_problems.data._.type>`problems.data`.as("problems"),
				users: sql<typeof subquery_users.data._.type>`users.data`.as("users"),
			})
			.from(classes)
			.leftJoinLateral(subquery_problems, sql`true`)
			.leftJoinLateral(subquery_users, sql`true`)
			.limit(1);

		const [record] = await query_class;

		if (!record) throw new TRPCError({ code: "NOT_FOUND" });

		// Check if User is in Class
		const [user_in_class] = await db
			.select()
			.from(users_to_classes)
			.where(and(eq(users_to_classes.user_id, user.id), eq(users_to_classes.class_id, input.id)))
			.limit(1);

		// Run checks if User not Admin
		if (!user.is("admin")) {
			// Error if User not in Class
			if (!user_in_class)
				throw new TRPCError({ code: "FORBIDDEN", message: "User does not have access to the class." });
		}

		return record;
	},
});

const list = authed({
	require: ["classes:read"], // user must have "classes:read" permission to access endpoint
	input: z.object({
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Get list of Classes where User has access
		const subquery_problems = db
			.select({ count: sql<number>`count(*)::int`.as("count") })
			.from(problems)
			.where(and(eq(problems.class_id, classes.id), eq(problems.is_deleted, false)))
			.as("problems");

		const subquery_users = db
			.select({ count: sql<number>`count(*)::int`.as("count") })
			.from(users_to_classes)
			.leftJoin(users, eq(users_to_classes.user_id, users.id))
			.where(and(eq(users_to_classes.class_id, classes.id), eq(users.is_deleted, false)))
			.as("users");

		const query_user_classes = db
			.select({
				...getTableColumns(classes),
				problems_count: sql<{ count: number }>`problems.count`.as("problems_count"),
				users_count: sql<{ count: number }>`users.count`.as("users_count"),
			})
			.from(users_to_classes)
			.leftJoin(classes, eq(users_to_classes.class_id, classes.id))
			.leftJoinLateral(subquery_problems, sql`true`)
			.leftJoinLateral(subquery_users, sql`true`)
			// Run Where Clause if User not Admin
			.where(user.is("admin") ? undefined : eq(users_to_classes.user_id, user.id))
			.limit(input.size)
			.offset((input.page - 1) * input.size);

		const records = await query_user_classes;

		return records;
	},
});

const create = authed({
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

const update = authed({
	require: ["classes:update"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
		data: ClassSchema.Update,
	}),

	async fn({ ctx, input }) {
		// Check if User has access to Class
		await find({ ctx, input });

		// Update Class
		const [record] = await db.update(classes).set(input.data).where(eq(classes.id, input.id)).returning();
		return record;
	},
});

const delete_ = authed({
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
			if (record.users.length > 0) throw new TRPCError({ code: "CONFLICT", message: "Class still has users" });
		}

		// Soft-delete Class Problems
		await db.update(problems).set({ is_deleted: true }).where(eq(problems.class_id, input.id));

		// Soft-delete Class
		await db.update(classes).set({ is_deleted: true }).where(eq(classes.id, input.id));
		record.is_deleted = true;

		return record;
	},
});

export const classService = {
	find,
	list,
	create,
	update,
	delete: delete_,
};

export const classesRouter = router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	delete: authedProcedure().input(delete_.input).mutation(delete_),
});
