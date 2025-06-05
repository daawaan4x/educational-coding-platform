import { db } from "@/db";
import { classes, problems, solutions, users, users_to_classes } from "@/db/schema";
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
		deadlineStatus: z.enum(["due-soon", "overdue"]).optional(),
		completionStatus: z.enum(["not-started", "partially-completed", "all-completed"]).optional(),
		checkCompletion: z.boolean().optional(),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Define completion count subqueries for reuse
		const studentsCompletedSubquery = sql<number>`COALESCE((
			SELECT COUNT(DISTINCT s.author_id)
			FROM ${solutions} s
			INNER JOIN ${users} u ON s.author_id = u.id
			WHERE s.problem_id = ${problems.id}
			AND s.is_deleted = false
			AND u.is_deleted = false
			AND u.role = 'student'
		), 0)`;

		const totalStudentsSubquery = sql<number>`COALESCE((
			SELECT COUNT(DISTINCT utc.user_id)
			FROM ${users_to_classes} utc
			INNER JOIN ${users} u ON utc.user_id = u.id
			WHERE utc.class_id = ${problems.class_id}
			AND u.is_deleted = false
			AND u.role = 'student'
		), 0)`;

		// Build completion status filter condition
		let completionFilter;
		if (input.completionStatus && input.checkCompletion) {
			if (input.completionStatus === "not-started") {
				completionFilter = eq(studentsCompletedSubquery, 0);
			} else if (input.completionStatus === "partially-completed") {
				completionFilter = and(gt(studentsCompletedSubquery, 0), lt(studentsCompletedSubquery, totalStudentsSubquery));
			} else if (input.completionStatus === "all-completed") {
				completionFilter = and(gt(studentsCompletedSubquery, 0), eq(studentsCompletedSubquery, totalStudentsSubquery));
			}
		}

		// Get list of Problems from all Classes where User has access (Optional: for a Class)
		const query = db
			.select({
				...getTableColumns(problems),
				author: UserColumns,
				class: getTableColumns(classes),
				...(input.checkCompletion
					? {
							studentsCompleted: studentsCompletedSubquery,
							totalStudents: totalStudentsSubquery,
						}
					: {}),
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

					input.deadlineStatus == "due-soon" ? gt(problems.deadline, new Date()) : undefined,
					input.deadlineStatus == "overdue" ? lt(problems.deadline, new Date()) : undefined,

					// If Problem Author | Class is deleted, consider Problem as deleted
					eq(problems.is_deleted, false),
					eq(users.is_deleted, false),
					eq(classes.is_deleted, false),

					// Apply completion status filter
					completionFilter,
				),
			)
			.groupBy(
				problems.id,
				problems.name,
				problems.description,
				problems.deadline,
				problems.class_id,
				problems.author_id,
				problems.date_created,
				problems.date_modified,
				problems.is_deleted,
				users.id,
				users.email,
				users.first_name,
				users.last_name,
				users.role,
				users.date_created,
				users.date_modified,
				users.is_deleted,
				classes.id,
				classes.name,
				classes.date_created,
				classes.date_modified,
				classes.is_deleted,
			)
			.orderBy(desc(problems.date_modified))
			.$dynamic();

		const records = await pagination(() => query)(input);

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
