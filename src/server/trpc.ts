import { UserSchema } from "@/db/validation";
import { Permission } from "@/lib/permissions";
import { Role } from "@/lib/roles";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod/v4";

export interface TRPCContext {
	user?: {
		id: string;
		data: Omit<UserSchema.Select, "id">;
		permissions: Permission[];
		roles: Role[];
		can(...permissions: Permission[]): boolean;
		is(...roles: Role[]): boolean;
	};
}

export interface AuthedTRPCContext {
	user: NonNullable<TRPCContext["user"]>;
}

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export function authedProcedure() {
	return publicProcedure.use(async (opts) => {
		// if (!opts.ctx.user) {
		// 	throw new TRPCError({ code: "UNAUTHORIZED" });
		// }

		return opts.next({
			ctx: {
				// TODO: Replace with real implementation
				user: {
					id: "",
					data: {
						date_created: new Date(),
						date_modified: new Date(),
						email: "",
						first_name: "",
						last_name: "",
						is_deleted: false,
					},

					roles: ["admin"],
					is() {
						return true;
					},

					permissions: ["users:read"],
					can() {
						return true;
					},
				},
			} satisfies TRPCContext,
		});
	});
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
		for (const claim of require) {
			if (!ctx.user.can(claim)) throw new TRPCError({ code: "FORBIDDEN" });
		}

		return args.fn(opts);
	};

	return Object.assign(fn, { require, input });
}
