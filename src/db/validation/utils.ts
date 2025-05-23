import { createSchemaFactory } from "drizzle-zod";

export const { createSelectSchema, createInsertSchema, createUpdateSchema } = createSchemaFactory({
	coerce: {
		date: true,
	},
});

export const metafields = {
	id: true,
	date_created: true,
	date_modified: true,
} as const;
