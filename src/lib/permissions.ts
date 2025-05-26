export const resources = ["classes", "classes.users", "problems", "problems.solutions", "solutions", "users"] as const;
export type Resource = (typeof resources)[number];

export const actions = ["create", "read", "update", "delete", "manage"] as const;
export type Action = (typeof actions)[number];

type BasePermission = `${Resource}:${Action}`;
export const permissions = [
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

	"users:create",
	"users:read",
	"users:update",
	"users:delete",
] satisfies BasePermission[];

export type Permission = (typeof permissions)[number];
