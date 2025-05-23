import z from "zod/v4";
import { users } from "../../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema, metafields } from "../utils";

export const Select = createSelectSchema(users);
export type Select = z.output<typeof Select>;

export const Insert = createInsertSchema(users).omit(metafields);
export type Insert = z.output<typeof Insert>;

export const Update = createUpdateSchema(users).omit(metafields);
export type Update = z.output<typeof Update>;
