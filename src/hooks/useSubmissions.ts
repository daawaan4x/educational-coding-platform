/* eslint-disable @typescript-eslint/no-unused-vars */
import { SolutionItem, SolutionsItem } from "@/lib/types";
import { useState } from "react";

export function useSubmissions() {
	const [studentSolutionsView, setStudentSolutionsView] = useState(false);
	const [selectedStudentID, setSelectedStudentID] = useState<string | null>(null);
	const [selectedStudentInfo, setSelectedStudentInfo] = useState<{
		firstName: string;
		lastName: string;
		score: number;
		id: string;
	} | null>(null);

	// Loading states and data for submissions
	const [studentsSolutionsData, setStudentsSolutionsData] = useState<SolutionsItem[]>([]);
	const [studentSolutionsData, setStudentSolutionsData] = useState<SolutionItem[]>([]);
	const [isLoadingStudentsSolutions, setIsLoadingStudentsSolutions] = useState(false);
	const [isLoadingStudentSolutions, setIsLoadingStudentSolutions] = useState(false);

	const handleStudentRowClick = (row: SolutionsItem) => {
		setStudentSolutionsView(true);
		setSelectedStudentID(row.authorId);
		setSelectedStudentInfo({
			firstName: row.authorFirstName,
			lastName: row.authorLastName,
			score: row.score,
			id: row.authorId,
		});
		// Reset student solutions data to trigger fresh fetch
		setStudentSolutionsData([]);
	};

	const handleBackToStudentsList = (): void => {
		setStudentSolutionsView(false);
		setSelectedStudentID(null);
		setSelectedStudentInfo(null);
		// Reset student solutions data
		setStudentSolutionsData([]);
	};

	const updateStudentScore = (newScore: number): void => {
		setSelectedStudentInfo((prev) => (prev ? { ...prev, score: newScore } : null));
	};

	return {
		studentSolutionsView,
		selectedStudentID,
		selectedStudentInfo,
		studentsSolutionsData,
		studentSolutionsData,
		isLoadingStudentsSolutions,
		isLoadingStudentSolutions,
		handleStudentRowClick,
		handleBackToStudentsList,
		updateStudentScore,
	};
}
