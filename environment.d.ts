declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			SERVER_URL: string;
		}
	}
}

export {};
