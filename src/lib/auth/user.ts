import { UserSchema } from "@/db/validation";
import { Permission } from "../permissions";
import { Role, roles_permissions } from "../roles";

export class UserContext {
	constructor(user: UserSchema.Select) {
		this.id = user.id;
		this.data = user;
		this.role = user.role;
		this.permissions = this.role ? roles_permissions[this.role] : [];
	}

	id: string;
	data: Omit<UserSchema.Select, "id">;
	permissions: Permission[];
	role: Role | null;

	/**
	 * Checks if the user can do any of the permissions
	 */
	can(...permissions: Permission[]) {
		if (this.is("admin")) return true;
		return permissions.some((permission) => this.permissions.includes(permission));
	}

	/**
	 * Checks if the user is any of the roles
	 */
	is(...roles: Role[]) {
		return roles.some((role) => this.role === role);
	}
}
