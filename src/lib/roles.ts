import { Permission } from "./permissions";

export const roles = ["admin", "teacher", "student"] as const;

export type Role = (typeof roles)[number];

export type RolesPermissions = Record<Role, Permission[]>;

export const roles_permissions = {
	admin: [], // Admin Role will automatically override permission requirements

	teacher: [
		"classes:create",
		"classes:read",
		"classes:update",
		"classes:delete",
		"classes.users:manage",

		"problems:create",
		"problems:read",
		"problems:update",
		"problems:delete",

		"problems.solutions:read",

		"solutions:create",
		"solutions:read",
		"solutions:update",
		"solutions:delete",

		"users:read",
		"users:update",
	],

	student: [
		"classes:read",
		"problems:read",

		"solutions:create",
		"solutions:read",
		"solutions:update",
		"solutions:delete",

		"users:read",
		"users:update",
	],
} satisfies RolesPermissions;
