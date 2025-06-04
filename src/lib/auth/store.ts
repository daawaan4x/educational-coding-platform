import { UserSchema } from "@/db/validation";
import { create } from "zustand";
import { UserContext } from "./user";

export interface AuthStore {
	user?: UserContext;
	setUser: (user: UserSchema.Select) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: undefined,
	setUser: (user) => set(() => ({ user: new UserContext(user) })),
}));
