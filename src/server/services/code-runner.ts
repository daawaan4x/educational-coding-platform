import { Language, languages } from "@/lib/languages";
import { z } from "zod/v4";
import { t } from "../trpc";
import { authed, authedProcedure } from "../trpc/auth";

export * as CodeRunnerService from "./code-runner";

const languageCodes = {
	c: 50,
	cpp: 54,
	py: 71,
	java: 62,
	php: 68,
	js: 63,
	ts: 74,
} satisfies Record<Language, number>;

function decode(base64?: string | null) {
	if (!base64) return base64;
	const binaryString = atob(base64);
	const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
	return new TextDecoder("utf-8").decode(bytes);
}

export const run = authed({
	require: ["solutions:create"],
	input: z.object({
		language: z.enum(languages),
		source_code: z.string().min(1).max(10_000),
		stdin: z.string().min(0).max(1_000),
	}),

	async fn({ input }) {
		const url = new URL("/submissions?base64_encoded=true&wait=true", process.env.JUDGE0_URL);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				language_id: languageCodes[input.language],
				source_code: btoa(input.source_code),
				stdin: btoa(input.stdin),
			}),
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
		const json: any = await response.json();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (json.error) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const result: {
				error: string;
				token: string;
			} = json;

			return {
				type: "error",
				error: result.error,
			} as const;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (json.stdout || json.stderr || json.compile_output) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const result: {
				stdout: string | null;
				time: string;
				memory: number;
				stderr: string | null;
				token: string;
				compile_output: string | null;
				message: string | null;
				status: {
					id: number;
					description: string;
				};
			} = json;

			return {
				type: "success",
				stdout: decode(result.stdout),
				time: result.time,
				memory: result.memory,
				stderr: decode(result.stderr),
				compile_output: decode(result.compile_output),
				message: result.message,
			} as const;
		}

		return {
			type: "unknown",
			value: JSON.stringify(json),
		} as const;
	},
});

export const routers = t.router({
	run: authedProcedure().input(run.input).mutation(run),
});
