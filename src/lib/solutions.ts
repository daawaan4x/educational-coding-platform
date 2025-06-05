import { type solutionStatus } from "./types";

export const statuses = ["accepted", "wrong-answer", "error", "timeout", "pending"] as const satisfies solutionStatus[];
