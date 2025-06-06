import { studentOwnSolutionsColumns } from "@/app/(authed)/problems/add/solutions-columns";
import BanterLoader from "@/components/banter-load";
import { DataTable } from "@/components/data-table";
import { useAuth } from "@/lib/auth";
import { Language } from "@/lib/languages";
import { trpc } from "@/lib/trpc";
import { SolutionItem } from "@/lib/types";
import { useState } from "react";

interface StudentSubmissionsViewProps {
	isLoadingStudentSolutions: boolean;
	onCodeEditorUpdate: (code: string, language: Language) => void;
	problemId?: string;
}

export function StudentSubmissionsView({
	isLoadingStudentSolutions,
	onCodeEditorUpdate,
	problemId,
}: StudentSubmissionsViewProps) {
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(50);

	const user = useAuth();

	const {
		data: solutionsData,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		isLoading: solutionsIsLoading,
		isError: solutionsIsError,
		error: solutionsError,
	} = trpc.solutions.list.useQuery(
		{
			problem_id: problemId,
			author_id: user.id,
			size: pageSize,
			page: pageIndex + 1,
		},
		{
			enabled: !!problemId && !!user.id,
		},
	);

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

	const pageCount = solutionsData?.meta ? solutionsData.meta.total_pages : undefined;

	return (
		<>
			{isLoadingStudentSolutions ? (
				<div className="flex h-full w-full items-center justify-center">
					<BanterLoader />
				</div>
			) : (
				<DataTable
					columns={studentOwnSolutionsColumns}
					data={solutions}
					enablePagination={true}
					showColumnViewControl={true}
					onRowClick={(row) => {
						onCodeEditorUpdate(row.code, row.language);
					}}
					manualPagination={true}
					pageIndex={pageIndex}
					pageSize={pageSize}
					pageCount={pageCount}
					defaultPageSize={pageSize}
					onPaginationChange={(newPageIndex, newPageSize) => {
						setPageIndex(newPageIndex);
						setPageSize(newPageSize);
					}}
				/>
			)}
		</>
	);
}
