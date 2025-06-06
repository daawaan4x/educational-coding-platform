import { studentSolutionsColumns } from "@/app/(authed)/problems/add/solutions-columns";
import { DataTable } from "@/components/data-table";
import { Language } from "@/lib/languages";
import { trpc } from "@/lib/trpc";
import { SolutionItem } from "@/lib/types";
import { useEffect, useState } from "react";

interface TeacherStudentSubmissionsViewProps {
	onCodeEditorUpdate: (code: string, language: Language) => void;
	problemId: string;
	selectedStudentInfo: { firstName: string; lastName: string; score: number; id: string };
}

export default function TeacherStudentSubmissionsView({
	onCodeEditorUpdate,
	problemId,
	selectedStudentInfo,
}: TeacherStudentSubmissionsViewProps) {
	const [solutionsPageIndex, setSolutionsPageIndex] = useState(0);
	const [solutionsPageSize, setSolutionsPageSize] = useState(50);

	const {
		data: solutionsData,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		isLoading: solutionsIsLoading,
		isError: solutionsIsError,
		error: solutionsError,
		refetch: refetchSolutions,
	} = trpc.solutions.list.useQuery(
		{
			problem_id: problemId,
			author_id: selectedStudentInfo?.id,
			size: solutionsPageSize,
			page: solutionsPageIndex + 1,
		},
		{
			enabled: !!problemId && !!selectedStudentInfo?.id,
		},
	);

	// Refetch solutions when selectedStudentInfo changes (e.g., after score update)
	useEffect(() => {
		if (selectedStudentInfo?.id) {
			void refetchSolutions();
		}
	}, [selectedStudentInfo?.id, selectedStudentInfo?.score, refetchSolutions]);

	const solutions: SolutionItem[] =
		solutionsData?.data.map((solution) => {
			return {
				id: solution.id,
				dateCreated: solution.date_created,
				code: solution.code,
				language: solution.language,
				status: solution.status,
			};
		}) ?? [];

	if (solutionsIsError) {
		console.error("Error fetching users:", solutionsError);
	}

	const solutionsPageCount = solutionsData?.meta ? solutionsData.meta.total_pages : undefined;

	return (
		<DataTable
			columns={studentSolutionsColumns}
			data={solutions}
			enablePagination={false}
			showColumnViewControl={false}
			onRowClick={(row) => {
				onCodeEditorUpdate(row.code, row.language);
			}}
			manualPagination={true}
			pageIndex={solutionsPageIndex}
			pageSize={solutionsPageSize}
			pageCount={solutionsPageCount}
			defaultPageSize={solutionsPageSize}
			onPaginationChange={(newPageIndex, newPageSize) => {
				setSolutionsPageIndex(newPageIndex);
				setSolutionsPageSize(newPageSize);
			}}
		/>
	);
}
