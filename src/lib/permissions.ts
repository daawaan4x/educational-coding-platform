export const resources = ["classes", "problems", "problems.solutions", "solutions", "users", "users.classes"] as const;
export type Resource = (typeof resources)[number];

export const actions = ["create", "read", "update", "delete", "manage"] as const;
export type Action = (typeof actions)[number];

type BasePermission = `${Resource}:${Action}`;
export const permissions = [
	"classes:create",
	"classes:read",
	"classes:update",
	"classes:delete",

	"problems:create",
	"problems:read",
	"problems:update",
	"problems:delete",

	"solutions:create",
	"solutions:read",
	"solutions:update",
	"solutions:delete",

	"users:create",
	"users:read",
	"users:update",
	"users:delete",

	"users.classes:manage",
] satisfies BasePermission[];

export type Permission = (typeof permissions)[number];
