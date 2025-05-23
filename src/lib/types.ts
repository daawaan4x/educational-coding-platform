// Temporary way of distinguishing role in the frontend
export enum UserRole {
	Admin = "ADMIN",
	Teacher = "TEACHER",
	Student = "STUDENT",
}

export type UserRoleString = "admin" | "teacher" | "student";

export interface Account {
	firstName: string;
	lastName: string;
	email: string;
	dateCreated: Date;
	dateModified: Date;
	roles: UserRoleString[];
	classes?: string[];
}
