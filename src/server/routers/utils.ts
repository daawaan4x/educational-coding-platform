import { db } from "@/db";
import { eq } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

/**
 * Checks if a record with the given ID exists in the given table.
 */
export async function exists<TId extends PgColumn>(id_column: TId, id_value: TId["_"]["data"]) {
	const result = await db.select({}).from(id_column.table).where(eq(id_column, id_value)).limit(1);

	return result.length > 0;
}
