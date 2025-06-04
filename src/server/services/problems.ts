import { db } from "@/db";
import { classes, problems, users, users_to_classes } from "@/db/schema";
import { ClassSchema, ProblemSchema } from "@/db/validation";
import { UserColumns } from "@/db/validation/schemas/user";
import { pagination } from "@/server/lib/pagination";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, gt, ilike, lt, or, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { t } from "../trpc";
import { authed, authedProcedure } from "../trpc/auth";
import { UserService } from "./users";

export * as ProblemService from "./problems";

export const find = authed({
	require: ["problems:read"],
	input: z.object({
		id: ProblemSchema.Select.shape.id,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Get Problem w/ User and Class
		const query_problem = db
			.select({
				...getTableColumns(problems),
				author: UserColumns,
				class: getTableColumns(classes),
			})
			.from(problems)
			.innerJoin(users, eq(problems.author_id, users.id))
			.innerJoin(classes, eq(problems.class_id, classes.id))
			.where(
				and(
					eq(problems.id, input.id),

					// If Problem Author | Class is deleted, consider Problem as deleted
					eq(problems.is_deleted, false),
					eq(users.is_deleted, false),
					eq(classes.is_deleted, false),
				),
			);

		const [record] = await query_problem;
		if (!record) throw new TRPCError({ code: "NOT_FOUND" });

		// Check if User is in Class
		await UserService.requireClass(user, record.class_id);

		return record;
	},
});

export const list = authed({
	require: ["problems:read"],
	input: z.object({
		size: z.int().gte(1).lte(50).default(50),
		page: z.int().gte(1).default(1),
		class_id: ClassSchema.Select.shape.id.optional(),

		search: z.string().optional(),
		deadline_status: z.enum(["due-soon", "overdue"]).optional(),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Get list of Problems from all Classes where User has access (Optional: for a Class)
		const records = await pagination(() =>
			db
				.select({
					...getTableColumns(problems),
					author: UserColumns,
					class: getTableColumns(classes),
				})
				.from(users_to_classes)
				.innerJoin(problems, eq(users_to_classes.class_id, problems.class_id))
				.innerJoin(users, eq(problems.author_id, users.id))
				.innerJoin(classes, eq(problems.class_id, classes.id))
				.where(
					and(
						eq(users_to_classes.user_id, user.id),
						input.class_id ? eq(users_to_classes.class_id, input.class_id) : undefined,

						input.search
							? or(ilike(problems.name, `%${input.search}%`), ilike(classes.name, `%${input.search}%`))
							: undefined,

						input.deadline_status == "due-soon" ? gt(problems.deadline, new Date()) : undefined,
						input.deadline_status == "overdue" ? lt(problems.deadline, new Date()) : undefined,

						// If Problem Author | Class is deleted, consider Problem as deleted
						eq(problems.is_deleted, false),
						eq(users.is_deleted, false),
						eq(classes.is_deleted, false),
					),
				)
				.orderBy(desc(problems.date_modified))
				.$dynamic(),
		)(input);

		return records;
	},
});

export const create = authed({
	require: ["problems:create"],
	input: z.object({
		data: ProblemSchema.Insert,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Check if User has access to Class
		await UserService.requireClass(user, input.data.class_id);

		// Create Problem
		const [record] = await db
			.insert(problems)
			.values({
				...input.data,
				author_id: user.id,
			})
			.returning();
		return record;
	},
});

export const update = authed({
	require: ["problems:update"],
	input: z.object({
		id: ProblemSchema.Select.shape.id,
		data: ProblemSchema.Update,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		const record_old = await find({ ctx, input });

		// Skip checks if Admin
		if (!user.is("admin")) {
			// Check if User is author of Problem
			if (record_old.author_id != user.id)
				throw new TRPCError({ code: "FORBIDDEN", message: "User is not the author of the Problem." });
		}

		// Update Problem
		const [record] = await db
			.update(problems)
			.set({
				...input.data,
				author_id: user.id,
				date_modified: sql`now()`,
			})
			.where(eq(problems.id, input.id))
			.returning();
		return record;
	},
});

export const remove = authed({
	require: ["problems:delete"],
	input: z.object({
		id: ProblemSchema.Select.shape.id,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		const record = await find({ ctx, input });

		// Run checks if User is not Admin
		if (!user.is("admin")) {
			// Check if User is author of Problem
			if (record.author_id != user.id)
				throw new TRPCError({ code: "FORBIDDEN", message: "User is not the author of the Problem." });
		}

		// Soft-delete Problem
		await db.update(problems).set({ is_deleted: true }).where(eq(problems.id, input.id));
		record.is_deleted = true;

		return record;
	},
});

export const routers = t.router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	delete: authedProcedure().input(remove.input).mutation(remove),
});
