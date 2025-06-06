import { db } from "@/db";
import { classes, problems, solutions, users } from "@/db/schema";
import { ProblemSchema, SolutionSchema, UserSchema } from "@/db/validation";
import { UserColumns } from "@/db/validation/schemas/user";
import { pagination } from "@/server/lib/pagination";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod/v4";
import { t } from "../trpc";
import { authed, authedProcedure } from "../trpc/auth";
import { ProblemService } from "./problems";
import { UserService } from "./users";

export * as SolutionService from "./solutions";

export const find = authed({
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
				author: UserColumns,
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
		await UserService.requireClass(user, record.class.id);

		return record;
	},
});

export const find_latest = authed({
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
				author: UserColumns,
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
		await UserService.requireClass(user, record.class.id);

		return record;
	},
});

export const list = authed({
	require: ["solutions:read"],
	input: z.object({
		problem_id: ProblemSchema.Select.shape.id.optional(),
		author_id: UserSchema.Select.shape.id.optional(),
		size: z.int().gte(1).lte(50).default(50),
		page: z.int().gte(1).default(1),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		console.log("input", input);

		// Commented out, because teachers has to view the solutions
		// of his/her student to give score to each.
		// // Error if User cannot read all Solutions of Problems AND is not the Author
		// if (!user.can("problems.solutions:read") && user.id != input.author_id)
		// 	throw new TRPCError({ code: "FORBIDDEN", message: "User cannot read other's solutions." });

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

export const list_latest = authed({
	require: ["problems.solutions:read", "solutions:read"],
	input: z.object({
		problem_id: ProblemSchema.Select.shape.id,
		size: z.int().gte(1).lte(50).default(50),
		page: z.int().gte(1).default(1),
	}),

	async fn({ input }) {
		// List Latest Solutions by all Users for a Problem
		const records = await pagination(() =>
			db
				.selectDistinctOn([solutions.author_id], {
					...getTableColumns(solutions),
					author: UserColumns,
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

export const create = authed({
	require: ["solutions:create"],
	input: z.object({
		data: SolutionSchema.Insert,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Check if User has access to Problem
		await ProblemService.find({ ctx, input: { id: input.data.problem_id } });

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

export const update_score = authed({
	require: ["solutions:update"],
	input: z.object({
		problem_id: ProblemSchema.Select.shape.id,
		author_id: UserSchema.Select.shape.id,
		score: z.number().min(0).max(100),
	}),

	async fn({ ctx, input }) {
		// const { user } = ctx;

		// Check if User has access to Problem (must be teacher or admin)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const problem = await ProblemService.find({ ctx, input: { id: input.problem_id } });

		// Update all solutions for this user and problem with the new score
		const updatedSolutions = await db
			.update(solutions)
			.set({
				score: input.score,
				date_modified: new Date(),
			})
			.where(
				and(
					eq(solutions.problem_id, input.problem_id),
					eq(solutions.author_id, input.author_id),
					eq(solutions.is_deleted, false),
				),
			)
			.returning();

		if (updatedSolutions.length === 0) {
			throw new TRPCError({ code: "NOT_FOUND", message: "No solutions found for this user and problem" });
		}

		return { updated_count: updatedSolutions.length, solutions: updatedSolutions };
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

const remove = authed({
	require: ["solutions:delete"],
	input: z.object({
		id: SolutionSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});
*/

export const routers = t.router({
	find: authedProcedure().input(find.input).query(find),
	find_latest: authedProcedure().input(find_latest.input).query(find_latest),
	list: authedProcedure().input(list.input).query(list),
	list_latest: authedProcedure().input(list_latest.input).query(list_latest),
	create: authedProcedure().input(create.input).mutation(create),
	update_score: authedProcedure().input(update_score.input).mutation(update_score),
});
