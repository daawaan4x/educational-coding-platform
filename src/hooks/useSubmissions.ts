import { studentSolutions, studentsSolutions } from "@/app/(authed)/problems/add/solutions-columns";
import { SolutionItem, SolutionsItem } from "@/lib/types";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useSubmissions(role: "student" | "teacher") {
	const [studentSolutionsView, setStudentSolutionsView] = useState(false);
	const [selectedStudentID, setSelectedStudentID] = useState<string | null>(null);
	const [selectedStudentInfo, setSelectedStudentInfo] = useState<{
		firstName: string;
		lastName: string;
		score: number;
	} | null>(null);

	// Loading states and data for submissions
	const [studentsSolutionsData, setStudentsSolutionsData] = useState<SolutionsItem[]>([]);
	const [studentSolutionsData, setStudentSolutionsData] = useState<SolutionItem[]>([]);
	const [isLoadingStudentsSolutions, setIsLoadingStudentsSolutions] = useState(false);
	const [isLoadingStudentSolutions, setIsLoadingStudentSolutions] = useState(false);

	// Simulate fetching students solutions overview
	const fetchStudentsSolutions = async () => {
		setIsLoadingStudentsSolutions(true);
		try {
			// Simulate API delay | Replace with the TRPC call
			await new Promise((resolve) => setTimeout(resolve, 1200));
			setStudentsSolutionsData(studentsSolutions);
		} catch (error) {
			console.error("Failed to fetch students solutions:", error);
		} finally {
			setIsLoadingStudentsSolutions(false);
		}
	};

	// Simulate fetching individual student solutions
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fetchStudentSolutions = async (studentId: string) => {
		setIsLoadingStudentSolutions(true);
		try {
			// Simulate API delay | Replace with the TRPC call
			await new Promise((resolve) => setTimeout(resolve, 800));
			setStudentSolutionsData(studentSolutions);
		} catch (error) {
			console.error("Failed to fetch student solutions:", error);
		} finally {
			setIsLoadingStudentSolutions(false);
		}
	};

	const handleStudentRowClick = (row: SolutionsItem) => {
		setStudentSolutionsView(true);
		setSelectedStudentID(row.authorId);
		setSelectedStudentInfo({
			firstName: row.authorFirstName,
			lastName: row.authorLastName,
			score: row.score,
		});
		// Reset student solutions data to trigger fresh fetch
		setStudentSolutionsData([]);
	};

	const handleBackToStudentsList = () => {
		setStudentSolutionsView(false);
		setSelectedStudentID(null);
		setSelectedStudentInfo(null);
		// Reset student solutions data
		setStudentSolutionsData([]);
	};

	const updateStudentScore = (newScore: number) => {
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
		fetchStudentsSolutions,
		fetchStudentSolutions,
		handleStudentRowClick,
		handleBackToStudentsList,
		updateStudentScore,
	};
}
