import { db } from "@/db";
import { classes, users, users_to_classes } from "@/db/schema";
import { ClassSchema, UserSchema } from "@/db/validation";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { UserContext } from "../context/user";
import { authed, authedProcedure, router } from "../trpc";
import { exists } from "./utils";

const find = authed({
	require: ["users:read"],
	input: z.object({
		id: UserSchema.Select.shape.id,
	}),

	async fn({ input }) {
		// Get User
		const query_user = db
			.select()
			.from(users)
			.where(and(eq(users.id, input.id), eq(users.is_deleted, false)));

		const [record] = await query_user;
		if (!record) throw new TRPCError({ code: "NOT_FOUND" });

		return record;
	},
});

const list = authed({
	require: ["users:read"],
	input: z.object({
		size: z.int().gte(1).lte(50).default(1),
		page: z.int().gte(1).default(1),
	}),

	async fn({ input }) {
		// Get list of User
		const query_user = db
			.select()
			.from(users)
			.where(eq(users.is_deleted, false))
			.limit(input.size)
			.offset((input.page - 1) * input.size);

		const records = await query_user;

		return records;
	},
});

const create = authed({
	require: ["users:create"],
	input: z.object({
		data: UserSchema.Insert,
	}),

	async fn({ input }) {
		// Create User
		const [record] = await db.insert(users).values(input.data).returning();
		return record;
	},
});

const update = authed({
	require: ["users:update"],
	input: z.object({
		id: UserSchema.Select.shape.id,
		data: UserSchema.Update,
	}),

	async fn({ input }) {
		// Update User
		const [record] = await db
			.update(users)
			.set({
				...input.data,
				date_modified: sql`now()`,
			})
			.where(eq(users.id, input.id))
			.returning();

		return record;
	},
});

const delete_ = authed({
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
			.where(eq(users.id, input.id));

		return record;
	},
});

async function requireClass(user: UserContext, id: ClassSchema.Select["id"]) {
	// Check if Class exists
	if (!(await exists(classes.id, id))) throw new TRPCError({ code: "NOT_FOUND", message: "Class does not exist" });

	// Skip check if admin
	if (user.is("admin")) return;

	// Check if User is in class
	const [user_in_class] = await db
		.select()
		.from(users_to_classes)
		.where(and(eq(users_to_classes.user_id, user.id), eq(users_to_classes.class_id, id)))
		.limit(1);

	if (!user_in_class) throw new TRPCError({ code: "FORBIDDEN", message: "User does not have access to the class." });
}

export const userService = {
	find,
	list,
	create,
	update,
	delete: delete_,

	requireClass,
};

export const usersRouter = router({
	find: authedProcedure().input(find.input).query(find),
	list: authedProcedure().input(list.input).query(list),
	create: authedProcedure().input(create.input).mutation(create),
	update: authedProcedure().input(update.input).mutation(update),
	delete: authedProcedure().input(delete_.input).mutation(delete_),
});
