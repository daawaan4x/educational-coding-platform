import { db } from "@/db";
import "dotenv/config";
import * as schema from "@/db/schema";
import { confirm } from "@inquirer/prompts";
import { reset, seed } from "drizzle-seed";
import symbols from "log-symbols";
import ora, { Ora } from "ora";

/**
 * Seeds the database with fake data using drizzle-seed
 */
async function main() {
	console.log(`\n--- SEED DATABASE WITH FAKE DATA ---\n`);

	let spinner: Ora;
	if (process.env.NODE_ENV != "development") throw new Error("This script is only allowed during development.");

	if (!(await confirm({ message: `${symbols.warning} This will reset the database. Proceed?`, default: false })))
		return;

	if (!(await confirm({ message: `${symbols.warning} This may take 15-30 seconds. Proceed?`, default: false }))) return;

	// Reset contents of database
	spinner = ora("Resetting database").start();
	await reset(db, schema).catch((error) => {
		spinner.fail();
		throw error;
	});
	spinner.succeed();

	// The numbers are inflated since there's a moderate chance for `is_deleted` = true
	spinner = ora("Seeding database").start();
	await seed(db, schema)
		.refine(() => ({
			classes: {
				count: 50, // 50 Classes
				with: {
					problems: 50, // 50 problems for each class
				},
			},
			users: {
				count: 50 * 50, // 50 users enrolled to each class
				with: {
					users_to_classes: 3, // 3 classes for each user
				},
			},
			problems: {
				count: 50 * 50, // 50 problems for 50 classes
				with: {
					solutions: 100, // 100 solutions for each problem
				},
			},
		}))
		.catch((error) => {
			spinner.fail();
			throw error;
		});
	spinner.succeed();
}

void main().then(() => process.exit(0));
