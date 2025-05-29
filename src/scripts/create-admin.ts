import { db } from "@/db";
import { users } from "@/db/schema";
import { UserService } from "@/server/services/users";
import { SYSTEM_CONTEXT } from "@/server/trpc/auth";
import "dotenv/config";
import { and, eq } from "drizzle-orm";
import symbols from "log-symbols";
import ora, { Ora } from "ora";

/**
 * Creates the initial Admin using the credentials from the environment variables
 */
async function main() {
	let spinner: Ora;
	console.log(`\n--- CREATE ADMIN USER ---\n`);

	const email = process.env.ADMIN_EMAIL;
	console.log(symbols.info, `Parsed Email: ${email}`);

	const password = process.env.ADMIN_PASSWORD;
	console.log(symbols.info, `Parsed Password: ${password}`);

	// Find Admin

	spinner = ora("Checking preexisting Admin user").start();
	const [record_old] = await db
		.select()
		.from(users)
		.where(and(eq(users.email, email)))
		.catch((error) => {
			spinner.fail();
			throw error;
		});
	spinner.succeed();

	if (record_old) {
		// Revert Admin if deleted
		if (record_old.is_deleted) {
			spinner = ora("Account was deleted, restoring").start();
			const record = await db
				.update(users)
				.set({ is_deleted: true })
				.where(eq(users.id, record_old.id))
				.returning()
				.catch((error) => {
					spinner.fail();
					throw error;
				});
			spinner.succeed();
			console.log(record);
		} else {
			console.log(symbols.info, "Admin user already exists.");
			console.log(record_old);
		}

		return;
	}

	// Create Admin
	spinner = ora("Creating Admin Account").start();
	const record = await UserService.create({
		ctx: SYSTEM_CONTEXT,
		input: {
			data: {
				email: process.env.ADMIN_EMAIL,
				password: process.env.ADMIN_PASSWORD,
				first_name: "Admin",
				last_name: "Admin",
				role: "admin",
			},
		},
	}).catch((error) => {
		spinner.fail();
		throw error;
	});
	spinner.succeed();

	console.log(record);
}

void main().then(() => process.exit(0));
