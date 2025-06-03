import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const db = drizzle({ client: postgres(process.env.DATABASE_URL), schema });
console.log(db.$client.options);

console.log("Database connection established");
