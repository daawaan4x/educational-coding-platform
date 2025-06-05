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

			/**
			 * **FOR DEVELOPMENT ONLY**: Allows logging-in to any user using only email without password
			 */
			SKIP_AUTH: boolean;

			/**
			 * URL for Judge0 API
			 */
			JUDGE0_URL: string;

			/**
			 * **PUBLIC:** Enable Judge0
			 */
			NEXT_PUBLIC_JUDGE0: boolean;
		}
	}
}

export {};
