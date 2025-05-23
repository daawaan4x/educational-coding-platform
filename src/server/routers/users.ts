import { UserSchema } from "@/db/validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { authed, authedProcedure, router } from "../trpc";

const find = authed({
	require: ["users:read"],
	input: z.object({
		id: UserSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const list = authed({
	require: ["users:read"],
	input: z.object({
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const create = authed({
	require: ["users:create"],
	input: z.object({
		data: UserSchema.Insert,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

const update = authed({
	require: ["users:update"],
	input: z.object({
		id: UserSchema.Select.shape.id,
		data: UserSchema.Update,
	}),

	fn() {
		return false;
	},
});

const delete_ = authed({
	require: ["users:delete"],
	input: z.object({
		id: UserSchema.Select.shape.id,
	}),

	fn() {
		throw new TRPCError({ code: "NOT_IMPLEMENTED" });
	},
});

export const userService = {
	find,
	list,
	create,
	update,
	delete: delete_,
};

export const usersRouter = router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	delete: authedProcedure().input(delete_.input).mutation(delete_),
});
