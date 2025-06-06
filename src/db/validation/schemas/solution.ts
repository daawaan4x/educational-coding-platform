import z from "zod/v4";
import { solutions } from "../../schema";
import { createInsertSchema, createSelectSchema, metafields } from "../utils";

export const Select = createSelectSchema(solutions, { id: z.guid(), author_id: z.guid(), problem_id: z.guid() });
export type Select = z.output<typeof Select>;

export const Insert = createInsertSchema(solutions, { author_id: z.guid(), problem_id: z.guid() }).omit({
	...metafields,
	author_id: true,
});
export type Insert = z.output<typeof Insert>;

/*
IMPORTANT: Solutions are meant to be immutable 

export const Update = createUpdateSchema(solutions).omit(metafields);
export type Update = z.output<typeof Update>;
*/
