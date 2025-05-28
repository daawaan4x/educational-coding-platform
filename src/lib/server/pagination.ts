import { db } from "@/db";
import { PgSelect } from "drizzle-orm/pg-core";

/**
 * Wraps `.$dynamic()` drizzle queries for reusable pagination
 */
export function pagination<T extends PgSelect>(query: () => T) {
	return async function paginate(args: { size: number; page: number }) {
		const limit = args.size;
		const offset = (args.page - 1) * args.size;

		const page_query = query().limit(limit).offset(offset);
		const count_query = db.$count(query());

		const [data, count] = await Promise.all([page_query, count_query]);

		return {
			data,
			meta: {
				size: args.size,
				page: args.page,
				total_count: count,
				total_pages: Math.ceil(count / args.size),
			},
		};
	};
}
