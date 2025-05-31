import { z } from "zod";

export const addAccountSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	role: z.enum(["student", "admin", "teacher"]),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});
