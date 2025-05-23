import { sql, SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { util } from "zod/v4/core";

/*
Example:

const subquery_problems = db
			.select({
				data: jsonb_agg(jsonb_build_object({ id: problems.id })).as("data"),
			})
			.from(problems)
			.where(eq(problems.class_id, classes.id))
			.as("problems");

		const subquery_users = db
			.select({
				data: jsonb_agg(jsonb_build_object({ id: users_to_classes.user_id })).as("data"),
			})
			.from(users_to_classes)
			.where(eq(users_to_classes.class_id, classes.id))
			.as("users");

		const query_class = db
			.select({
				...getTableColumns(classes),
				problems: sql<typeof subquery_problems.data._.type>`problems.data`.as("problems"),
				users: sql<typeof subquery_users.data._.type>`users.data`.as("users"),
			})
			.from(classes)
			.leftJoinLateral(subquery_problems, sql`true`)
			.leftJoinLateral(subquery_users, sql`true`)
			.limit(1);
*/
export function jsonb_distinct_agg<T>(expression: SQL<T>) {
	return sql<T[]>`jsonb_agg(DISTINCT ${expression})`;
}

/*
Example:

const [record] = await db
			.select({
				...getTableColumns(classes),
				problems: jsonb_distinct_agg(
					jsonb_build_object({
						id: problems.id,
					}),
				).as("problems"),
				users: jsonb_distinct_agg(
					jsonb_build_object({
						id: users_to_classes.user_id,
					}),
				).as("users"),
			})
			.from(classes)
			.leftJoin(problems, eq(classes.id, problems.class_id))
			.leftJoin(users_to_classes, eq(classes.id, users_to_classes.user_id))
			.where(and(eq(classes.id, input.id), eq(classes.is_deleted, false)))
			.limit(1);
*/
export function jsonb_agg<T>(expression: SQL<T>) {
	return sql<T[]>`coalesce(jsonb_agg(${expression}), '[]'::jsonb)`;
}

type ColumnDataType<TColumn extends PgColumn> = TColumn["_"]["data"];

type JsonBuildObjectType<T extends Record<string, PgColumn>> = {
	[K in keyof T]: ColumnDataType<T[K]>;
};

/**
 * @param shape Potential for SQL injections, so you shouldn't allow user-specified key names
 */
export function jsonb_build_object<T extends Record<string, PgColumn>>(shape: T) {
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

export function jsonb_build_array<T extends PgColumn>(column: T) {
	return sql<util.Flatten<ColumnDataType<T>>>`jsonb_build_array(${column})`;
}
