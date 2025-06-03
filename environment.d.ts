declare global {
	namespace NodeJS {
		interface ProcessEnv {
			/**
			 * Database Connection URL for Drizzle
			 */
			DATABASE_URL: string;

			/**
			 * Required by Next-Auth (see https://authjs.dev/getting-started/installation)
			 */
			AUTH_SECRET: string;

			/**
			 * # of Salt Rounds used for hashing user passwords
			 */
			USERPASS_SALT_ROUNDS: number;

			/**
			 * Initial Administrator Account
			 */
			ADMIN_EMAIL: string;
			ADMIN_PASSWORD: string;
		}
	}
}

export {};
