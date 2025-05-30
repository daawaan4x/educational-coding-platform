import { Permission } from "@/lib/permissions";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { t } from ".";
import { TRPCContext, UserContext } from "./context";

export function authedProcedure() {
	return t.procedure.use(async (opts) => {
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

export const SYSTEM_CONTEXT: AuthedTRPCContext = {
	user: new UserContext({
		id: "",
		date_created: new Date(),
		date_modified: new Date(),
		email: "",
		first_name: "System",
		last_name: "Admin",
		is_deleted: false,
		role: "admin",
	}),
};

export interface AuthedFn<TInput extends z.core.$ZodType, TReturn> {
	(opts: { ctx: AuthedTRPCContext; input: z.input<TInput> }): TReturn;
	require: Permission[];
	input: TInput;
}

/**
 * Utility function to define procedures for `authedProcedure`
 */
export function authed<TInput extends z.ZodType, TReturn>(args: {
	require: Permission[];
	input: TInput;
	fn: (opts: { ctx: AuthedTRPCContext; input: z.output<TInput> }) => TReturn;
}): AuthedFn<TInput, TReturn> {
	let { fn } = args;
	const { require, input } = args;

	fn = (opts) => {
		// Check if User has all Claims
		const { ctx, input } = opts;
		const { user } = ctx;

		for (const claim of require) {
			if (!user.can(claim))
				throw new TRPCError({ code: "FORBIDDEN", message: "User does not have access to perform the action." });
		}

		return args.fn({
			ctx,
			input: args.input.parse(input),
		});
	};

	return Object.assign(fn, { require, input });
}
