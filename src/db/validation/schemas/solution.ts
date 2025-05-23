import z from "zod/v4";
import { solutions } from "../../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema, metafields } from "../utils";

export const Select = createSelectSchema(solutions);
export type Select = z.output<typeof Select>;

export const Insert = createInsertSchema(solutions).omit(metafields);
export type Insert = z.output<typeof Insert>;

export const Update = createUpdateSchema(solutions).omit(metafields);
export type Update = z.output<typeof Update>;
