// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
	interface JWT {
		/** OpenID ID Token */
		user_id: string;
	}
}
