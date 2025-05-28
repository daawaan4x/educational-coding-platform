import { keysof, pick } from "@/lib/utils";
import z from "zod/v4";
import { users } from "../../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema, metafields } from "../utils";

export const internals = {
	password_hash: true,
} as const;

export const UserColumns = pick(users, [...keysof(metafields), "email", "last_name", "first_name", "role"]);

export const Select = createSelectSchema(users).omit(internals);
export type Select = z.output<typeof Select>;

export const Insert = createInsertSchema(users)
	.extend({
		password: z.string().max(100),
	})
	.omit({
		...metafields,
		...internals,
	});
export type Insert = z.output<typeof Insert>;

export const Update = createUpdateSchema(users)
	.extend({
		password: z.string().max(100).optional(),
	})
	.omit({
		...metafields,
		...internals,
	});
export type Update = z.output<typeof Update>;
