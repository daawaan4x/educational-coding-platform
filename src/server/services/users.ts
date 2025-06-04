import { db } from "@/db";
import { classes, users, users_to_classes } from "@/db/schema";
import { ClassSchema, UserSchema } from "@/db/validation";
import { UserColumns } from "@/db/validation/schemas/user";
import { pagination } from "@/server/lib/pagination";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { t } from "../trpc";
import { authed, authedProcedure } from "../trpc/auth";
import { UserContext } from "../trpc/context";
import { hashPassword, verifyPassword } from "./users/password";

export * as UserService from "./users";

export const find = authed({
	require: ["users:read"],
	input: z.object({
		id: UserSchema.Select.shape.id.optional(),
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		// Get User
		const query_user = db
			.select({
				...UserColumns,
			})
			.from(users)
			.where(and(eq(users.id, input.id ?? user.id), eq(users.is_deleted, false)));

		const [record] = await query_user;
		if (!record) throw new TRPCError({ code: "NOT_FOUND" });

		return record;
	},
});

export const list = authed({
	require: ["users:read"],
	input: z.object({
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
		class_id: ClassSchema.Select.shape.id.optional(),
	}),

	async fn({ input }) {
		// Get list of User (Optional: for a Class)
		const query_users = () =>
			db
				.selectDistinctOn([users.id], UserColumns)
				.from(users)
				.leftJoin(users_to_classes, eq(users.id, users_to_classes.user_id))
				.leftJoin(classes, eq(users_to_classes.class_id, classes.id))
				.where(
					and(
						eq(users.is_deleted, false),
						input.class_id ? eq(users_to_classes.class_id, input.class_id) : undefined,
						input.class_id ? eq(classes.is_deleted, false) : undefined,
					),
				)
				.orderBy(users.id) // order-by is required by distinct-on
				.$dynamic();

		const records = await pagination(query_users)(input);

		return records;
	},
});

export const create = authed({
	require: ["users:create"],
	input: z.object({
		data: UserSchema.Insert,
	}),

	async fn({ input }) {
		// Create User
		const [record] = await db
			.insert(users)
			.values({
				email: input.data.email,
				password_hash: await hashPassword(input.data.password),
				last_name: input.data.last_name,
				first_name: input.data.first_name,
				role: input.data.role,
			})
			.returning(UserColumns);
		return record;
	},
});

export const update = authed({
	require: ["users:update"],
	input: z.object({
		id: UserSchema.Select.shape.id.optional(),
		data: UserSchema.Update,
	}),

	async fn({ ctx, input }) {
		const { user } = ctx;

		if (!user.is("admin") && input.id && user.id != input.id)
			throw new TRPCError({ code: "FORBIDDEN", message: "User cannot modify other's info." });

		// Update User
		const [record] = await db
			.update(users)
			.set({
				...input.data,
				date_modified: sql`now()`,
			})
			.where(eq(users.id, input.id ?? user.id))
			.returning(UserColumns);

		return record;
	},
});

export const remove = authed({
	require: ["users:delete"],
	input: z.object({
		id: UserSchema.Select.shape.id,
	}),

	async fn({ input }) {
		// Soft-delete User
		const [record] = await db
			.update(users)
			.set({
				is_deleted: true,
			})
			.where(eq(users.id, input.id))
			.returning(UserColumns);

		return record;
	},
});

export async function requireClass(user: UserContext, id: ClassSchema.Select["id"]) {
	// Check if Class exists
	const [class_] = await db
		.select({})
		.from(classes)
		.where(and(eq(classes.id, id), eq(classes.is_deleted, false)));
	if (!class_) throw new TRPCError({ code: "NOT_FOUND", message: "Class does not exist" });

	// Skip check if admin
	if (user.is("admin")) return;

	// Check if User is in class
	const [user_in_class] = await db
		.select({
			...getTableColumns(users_to_classes),
		})
		.from(users_to_classes)
		.where(and(eq(users_to_classes.user_id, user.id), eq(users_to_classes.class_id, id)));

	if (!user_in_class) throw new TRPCError({ code: "FORBIDDEN", message: "User does not have access to the class." });
}

export async function authenticate(email: string, password: string) {
	const error = new Error("Incorrect Username or Password.");

	// Get User
	const query_user = db
		.select()
		.from(users)
		.where(and(eq(users.email, email), eq(users.is_deleted, false)));

	const [record] = await query_user;
	if (!record) throw error;

	const match = await verifyPassword(password, record.password_hash ?? "");
	if (!match) throw error;

	return UserSchema.Select.parse(record);
}

export const routers = t.router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	delete: authedProcedure().input(remove.input).mutation(remove),
});
