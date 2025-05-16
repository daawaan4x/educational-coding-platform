import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const testTable = pgTable("Test", {
	id: uuid().primaryKey().defaultRandom(),
	value: varchar({ length: 255 }),
});
