/* eslint-disable @typescript-eslint/no-unused-vars */
import { trpc } from "@/lib/trpc";
import type { Delta, Op } from "quill";
import { useEffect, useState } from "react";

interface ProblemData {
	id: string;
	name: string;
	description: string;
	deadline: Date;
	maxScore: number;
}

export function useProblemData(problemId?: string) {
	const [isLoading, setIsLoading] = useState(false);

	const {
		data: problemData,
		isLoading: isQueryLoading,
		error,
	} = trpc.problems.find.useQuery(
		{ id: problemId! },
		{
			enabled: !!problemId, // Only run query if problemId exists
			retry: false,
		},
	);

	const parseProblemDescription = (description: string): { ops: Op[] } => {
		try {
			// Try to parse as Delta first
			const parsed: unknown = JSON.parse(description);
			if (typeof parsed === "object" && parsed !== null && "ops" in parsed) {
				const parsedObj = parsed as Record<string, unknown>;
				if (Array.isArray(parsedObj.ops)) {
					return parsed as { ops: Op[] };
				}
			}
			// If not Delta format, create a simple text delta
			return {
				ops: [{ insert: description }],
			};
		} catch {
			// If parsing fails, treat as plain text
			return {
				ops: [{ insert: description }],
			};
		}
	};

	const extractDateAndTime = (deadline: Date) => {
		const date = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
		const time = `${deadline.getHours().toString().padStart(2, "0")}:${deadline.getMinutes().toString().padStart(2, "0")}`;
		return { date, time };
	};

	useEffect(() => {
		setIsLoading(isQueryLoading);
	}, [isQueryLoading]);

	const transformedData = problemData
		? {
				...problemData,
				parsedDescription: parseProblemDescription(problemData.description),
				...extractDateAndTime(problemData.deadline),
			}
		: null;

	return {
		problemData: transformedData,
		isLoading,
		error,
		hasProblemId: !!problemId,
	};
}
