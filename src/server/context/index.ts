import { UserContext } from "./user";

export interface TRPCContext {
	user?: UserContext;
}
