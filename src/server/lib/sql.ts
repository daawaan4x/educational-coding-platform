import { sql, SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { util } from "zod/v4/core";

export function jsonb_agg<T>(expression: SQL<T>) {
	return sql<T[]>`coalesce(jsonb_agg(${expression}), '[]'::jsonb)`;
}

type DataType<T> = T extends PgColumn ? T["_"]["data"] : T extends SQL<infer U> ? U : unknown;

type JsonBuildObjectType<T extends Record<string, PgColumn | SQL>> = {
	[K in keyof T]: DataType<T[K]>;
};

/**
 * @param shape Potential for SQL injections, so you shouldn't allow user-specified key names
 */
export function jsonb_build_object<T extends Record<string, PgColumn | SQL>>(shape: T) {
	const chunks: SQL[] = [];

	Object.entries(shape).forEach(([key, value]) => {
		if (chunks.length > 0) {
			chunks.push(sql.raw(","));
		}
		chunks.push(sql.raw(`'${key}',`));
		chunks.push(sql`${value}`);
	});

	return sql<util.Flatten<JsonBuildObjectType<T>>>`jsonb_build_object(${sql.join(chunks)})`;
}
