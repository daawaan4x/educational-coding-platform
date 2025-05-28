import { db } from "@/db";
import { users } from "@/db/schema";
import { userService } from "@/server/routers/users";
import { SYSTEM_CONTEXT } from "@/server/trpc";
import "dotenv/config";
import { and, eq } from "drizzle-orm";

async function main() {
	console.log("Creating Admin ...");

	const email = process.env.ADMIN_EMAIL;
	console.log(`Parsed Email: ${email}`);

	const password = process.env.ADMIN_PASSWORD;
	console.log(`Parsed Password: ${password}`);

	// Find Admin
	console.log("Checking preexisting Admin Account ...");
	const [record_old] = await db
		.select()
		.from(users)
		.where(and(eq(users.email, email)));

	if (record_old) {
		console.log("Found old Admin Account.");

		// Revert Admin if deleted
		if (record_old.is_deleted) {
			console.log("Account was deleted, restoring ...");
			await db.update(users).set({ is_deleted: true }).where(eq(users.id, record_old.id));
			console.log("Account has been restored.");
		}

		return;
	}

	// Create Admin
	console.log("Creating Admin Account ...");
	const record = await userService.create({
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
	});

	console.log("Account has been created.");
	console.log(record);
}

void main().finally(() => process.exit(0));
