import z from "zod/v4";
import { problems } from "../../schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema, metafields } from "../utils";

export const Select = createSelectSchema(problems, { id: z.guid(), author_id: z.guid(), class_id: z.guid() });
export type Select = z.output<typeof Select>;

export const Insert = createInsertSchema(problems, { author_id: z.guid(), class_id: z.guid() }).omit({
	...metafields,
	author_id: true,
});
export type Insert = z.output<typeof Insert>;

export const Update = createUpdateSchema(problems, { author_id: z.guid(), class_id: z.guid() }).omit({
	...metafields,
	author_id: true,
	class_id: true,
});
export type Update = z.output<typeof Update>;
