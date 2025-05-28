import { db } from "@/db";
import { classes, problems, solutions, users } from "@/db/schema";
import { ProblemSchema, SolutionSchema, UserSchema } from "@/db/validation";
import { pagination } from "@/lib/server/pagination";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod/v4";
import { authed, authedProcedure, router } from "../trpc";
import { problemService } from "./problems";
import { userService } from "./users";

const find = authed({
	require: ["solutions:read"],
	input: z.object({
		id: SolutionSchema.Select.shape.id,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Get Solution w/ Author and Class
		const query_solution = db
			.select({
				...getTableColumns(solutions),
				author: getTableColumns(users),
				class: getTableColumns(classes),
			})
			.from(solutions)
			.innerJoin(users, eq(solutions.author_id, users.id))
			.innerJoin(problems, eq(solutions.problem_id, problems.id))
			.innerJoin(classes, eq(problems.class_id, classes.id))
			.where(
				and(
					eq(solutions.id, input.id),

					// If Solution Author | Problem | Class is deleted, consider Solution as deleted
					eq(solutions.is_deleted, false),
					eq(users.is_deleted, false),
					eq(problems.is_deleted, false),
					eq(classes.is_deleted, false),
				),
			);

		const [record] = await query_solution;

		if (!record) throw new TRPCError({ code: "NOT_FOUND" });

		// Error if User cannot read all Solutions of Problems AND is not the Author
		if (!user.can("problems.solutions:read") && user.id != record.author_id)
			throw new TRPCError({ code: "FORBIDDEN", message: "User did not author solution." });

		// Check if User is in Class
		await userService.requireClass(user, record.class.id);

		return record;
	},
});

const find_latest = authed({
	require: ["solutions:read"],
	input: z.object({
		problem_id: ProblemSchema.Select.shape.id,
		author_id: UserSchema.Select.shape.id.optional(),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Error if User cannot read all Solutions of Problems AND is not the Author
		if (!user.can("problems.solutions:read") && input.author_id && user.id != input.author_id)
			throw new TRPCError({ code: "FORBIDDEN", message: "User cannot read other's solutions." });

		// Get Solution w/ Author and Class
		const query_solution = db
			.select({
				...getTableColumns(solutions),
				author: getTableColumns(users),
				class: getTableColumns(classes),
			})
			.from(solutions)
			.innerJoin(users, eq(solutions.author_id, users.id))
			.innerJoin(problems, eq(solutions.problem_id, problems.id))
			.innerJoin(classes, eq(problems.class_id, classes.id))
			.where(
				and(
					eq(solutions.problem_id, input.problem_id),
					eq(solutions.author_id, input.author_id ?? user.id),

					// If Solution Author | Problem | Class is deleted, consider Solution as deleted
					eq(solutions.is_deleted, false),
					eq(users.is_deleted, false),
					eq(problems.is_deleted, false),
					eq(classes.is_deleted, false),
				),
			)
			.orderBy(desc(solutions.date_modified))
			.limit(1);

		const [record] = await query_solution;

		if (!record) throw new TRPCError({ code: "NOT_FOUND" });

		// Check if User is in Class
		await userService.requireClass(user, record.class.id);

		return record;
	},
});

const list = authed({
	require: ["solutions:read"],
	input: z.object({
		problem_id: ProblemSchema.Select.shape.id.optional(),
		author_id: UserSchema.Select.shape.id.optional(),
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Error if User cannot read all Solutions of Problems AND is not the Author
		if (!user.can("problems.solutions:read") && user.id != input.author_id)
			throw new TRPCError({ code: "FORBIDDEN", message: "User cannot read other's solutions." });

		// List Authored Solutions w/ Class (Optional: for a Problem)
		const records = await pagination(() =>
			db
				.select({
					...getTableColumns(solutions),
					class: getTableColumns(classes),
				})
				.from(solutions)
				.innerJoin(users, eq(solutions.author_id, users.id))
				.innerJoin(problems, eq(solutions.problem_id, problems.id))
				.innerJoin(classes, eq(problems.class_id, classes.id))
				.where(
					and(
						input.problem_id ? eq(solutions.problem_id, input.problem_id) : undefined,
						eq(solutions.author_id, input.author_id ?? user.id),

						// If Solution Author | Problem | Class is deleted, consider Solution as deleted
						eq(solutions.is_deleted, false),
						eq(users.is_deleted, false),
						eq(problems.is_deleted, false),
						eq(classes.is_deleted, false),
					),
				)
				.orderBy(desc(solutions.date_modified))
				.$dynamic(),
		)(input);

		return records;
	},
});

const list_latest = authed({
	require: ["problems.solutions:read", "solutions:read"],
	input: z.object({
		problem_id: ProblemSchema.Select.shape.id,
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	async fn({ input }) {
		// List Latest Solutions by all Users for a Problem
		const records = await pagination(() =>
			db
				.selectDistinctOn([solutions.author_id], {
					...getTableColumns(solutions),
					author: getTableColumns(users),
				})
				.from(solutions)
				.innerJoin(users, eq(solutions.author_id, users.id))
				.innerJoin(problems, eq(solutions.problem_id, problems.id))
				.innerJoin(classes, eq(problems.class_id, classes.id))
				.where(
					and(
						eq(solutions.problem_id, input.problem_id),

						// If Solution Author | Problem | Class is deleted, consider Solution as deleted
						eq(solutions.is_deleted, false),
						eq(users.is_deleted, false),
						eq(problems.is_deleted, false),
						eq(classes.is_deleted, false),
					),
				)
				.orderBy(desc(solutions.date_modified))
				.$dynamic(),
		)(input);

		return records;
	},
});

const create = authed({
	require: ["solutions:create"],
	input: z.object({
		data: SolutionSchema.Insert,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Check if User has access to Problem
		await problemService.find({ ctx, input: { id: input.data.problem_id } });

		// Create Solution
		const [record] = await db
			.insert(solutions)
			.values({
				...input.data,
				author_id: user.id,
			})
			.returning();
		return record;
	},
});

/*
IMPORTANT: Solutions are meant to be immutable

const update = authed({
	require: ["solutions:update"],
	input: z.object({
		id: SolutionSchema.Select.shape.id,
		data: SolutionSchema.Update,
	}),
	
	fn() {
		return false;
	},
});

const delete_ = authed({
	require: ["solutions:delete"],
	input: z.object({
		id: SolutionSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});
*/

export const solutionService = {
	find,
	find_latest,
	list,
	list_latest,
	create,
};

export const solutionsRouter = router({
	find: authedProcedure().input(find.input).query(find),
	find_latest: authedProcedure().input(find_latest.input).query(find_latest),
	list: authedProcedure().input(list.input).query(list),
	list_latest: authedProcedure().input(list_latest.input).query(list_latest),
	create: authedProcedure().input(create.input).mutation(create),
});
