import { SolutionSchema } from "@/db/validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { authed, authedProcedure, router } from "../trpc";

const find = authed({
	require: ["solutions:read"],
	input: z.object({
		id: SolutionSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const list = authed({
	require: ["solutions:read"],
	input: z.object({
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const create = authed({
	require: ["solutions:create"],
	input: z.object({
		data: SolutionSchema.Insert,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

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

export const solutionService = {
	find,
	list,
	create,
	update,
	delete: delete_,
};

export const solutionsRouter = router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	delete: authedProcedure().input(delete_.input).mutation(delete_),
});
