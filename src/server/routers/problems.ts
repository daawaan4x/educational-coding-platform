import { ProblemSchema } from "@/db/validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { authed, authedProcedure, router } from "../trpc";

const find = authed({
	require: ["problems:read"],
	input: z.object({
		id: ProblemSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const list = authed({
	require: ["problems:read"],
	input: z.object({
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const create = authed({
	require: ["problems:create"],
	input: z.object({
		data: ProblemSchema.Insert,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const update = authed({
	require: ["problems:update"],
	input: z.object({
		id: ProblemSchema.Select.shape.id,
		data: ProblemSchema.Update,
	}),

	fn() {
		return false;
	},
});

const delete_ = authed({
	require: ["problems:delete"],
	input: z.object({
		id: ProblemSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

export const problemService = {
	find,
	list,
	create,
	update,
	delete: delete_,
};

export const problemsRouter = router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	delete: authedProcedure().input(delete_.input).mutation(delete_),
});
