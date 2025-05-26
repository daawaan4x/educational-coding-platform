import { Permission } from "@/lib/permissions";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export function authedProcedure() {
	return publicProcedure.use(async (opts) => {
		if (!opts.ctx.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}

		return opts.next({
			ctx: { user: opts.ctx.user },
		});
	});
}

export interface AuthedTRPCContext {
	user: NonNullable<TRPCContext["user"]>;
}

export interface AuthedFn<TInput extends z.core.$ZodType, TReturn> {
	(opts: { ctx: AuthedTRPCContext; input: z.output<TInput> }): TReturn;
	require: Permission[];
	input: TInput;
}

/**
 * Utility function to define procedures for `authedProcedure`
 */
export function authed<TInput extends z.core.$ZodType, TReturn>(args: {
	require: Permission[];
	input: TInput;
	fn: (opts: { ctx: AuthedTRPCContext; input: z.output<TInput> }) => TReturn;
}): AuthedFn<TInput, TReturn> {
	let { fn } = args;
	const { require, input } = args;

	fn = (opts) => {
		// Check if User has all Claims
		const { ctx } = opts;
		const { user } = ctx;

		for (const claim of require) {
			if (!user.can(claim))
				throw new TRPCError({ code: "FORBIDDEN", message: "User does not have access to perform the action." });
		}

		return args.fn(opts);
	};

	return Object.assign(fn, { require, input });
}
