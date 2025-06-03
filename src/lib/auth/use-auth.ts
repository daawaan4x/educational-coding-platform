import { useAuthStore } from "./store";

export class UnsetUserError extends Error {
	constructor(message?: string);
	constructor(message?: string, options?: ErrorOptions);
	constructor(message = "Expected User to be set before using this function.", options?: ErrorOptions) {
		super(message, options);
	}
}

export function useAuth() {
	const user = useAuthStore((state) => state.user);
	if (!user) throw new UnsetUserError();
	return user;
}
