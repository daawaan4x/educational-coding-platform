import z from "zod/v4";
import { classes } from "../../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema, metafields } from "../utils";

export const Select = createSelectSchema(classes);
export type Select = z.output<typeof Select>;

export const Insert = createInsertSchema(classes).omit(metafields);
export type Insert = z.output<typeof Insert>;

export const Update = createUpdateSchema(classes).omit(metafields);
export type Update = z.output<typeof Update>;
