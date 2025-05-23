import { ClassSchema } from "@/db/validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { authed, authedProcedure, router } from "../trpc";

const find = authed({
	require: ["classes:read"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const list = authed({
	require: ["classes:read"], // user must have "classes:read" permission to access endpoint
	input: z.object({
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const create = authed({
	require: ["classes:create"],
	input: z.object({
		data: ClassSchema.Insert,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const update = authed({
	require: ["classes:update"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
		data: ClassSchema.Update,
	}),

	fn() {
		return false;
	},
});

const delete_ = authed({
	require: ["classes:delete"],
	input: z.object({
		id: ClassSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
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
