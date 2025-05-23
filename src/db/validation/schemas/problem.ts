import z from "zod/v4";
import { problems } from "../../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema, metafields } from "../utils";

export const Select = createSelectSchema(problems);
export type Select = z.output<typeof Select>;

export const Insert = createInsertSchema(problems).omit(metafields);
export type Insert = z.output<typeof Insert>;

export const Update = createUpdateSchema(problems).omit(metafields);
export type Update = z.output<typeof Update>;
