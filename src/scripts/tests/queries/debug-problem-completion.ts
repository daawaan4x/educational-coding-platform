import { db } from "@/db";
import { classes, problems, solutions, users, users_to_classes } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * Queries the completion stats of a problem with multiple simpler queries for debugging
 *
 * `pnpm exec tsx ./src/scripts/tests/queries/test.ts`
 */
async function main() {
	// Replace this ID
	const problem_id = "55c50174-ebe3-43bc-6975-7732b4fb7da6";

	const [problem] = await db.select().from(problems).where(eq(problems.id, problem_id));
	console.log("Problem:", problem);

	const [problem_class] = await db.select().from(classes).where(eq(classes.id, problem.class_id));
	console.log("Class:", problem_class);

	const problem_class_students = await db
		.select()
		.from(users_to_classes)
		.innerJoin(users, eq(users_to_classes.user_id, users.id))
		.where(
			and(
				//
				eq(users_to_classes.class_id, problem.class_id),
				eq(users.role, "student"),
				eq(users.is_deleted, false),
			),
		);
	console.log("Total Students", problem_class_students.length);

	const problem_solutions = await db
		.select()
		.from(solutions)
		.innerJoin(users, eq(solutions.author_id, users.id))
		.where(
			and(
				//
				eq(solutions.problem_id, problem.id),
				eq(solutions.submitted, true),
				eq(solutions.is_deleted, false),
				eq(users.role, "student"),
				eq(users.is_deleted, false),
			),
		);
	console.log("Completed Students", [...new Set(problem_solutions.map((s) => s.solutions.author_id))].length);
}

void main().then(() => process.exit(0));
