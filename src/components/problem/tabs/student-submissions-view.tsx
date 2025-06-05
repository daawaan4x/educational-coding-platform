import { studentOwnSolutionsColumns } from "@/app/(authed)/problems/add/solutions-columns";
import BanterLoader from "@/components/banter-load";
import { DataTable } from "@/components/data-table";
import { SolutionItem } from "@/lib/types";

interface StudentSubmissionsViewProps {
	studentSolutionsData: SolutionItem[];
	isLoadingStudentSolutions: boolean;
	onCodeEditorUpdate: (code: string) => void;
}

export function StudentSubmissionsView({
	studentSolutionsData,
	isLoadingStudentSolutions,
	onCodeEditorUpdate,
}: StudentSubmissionsViewProps) {
	return (
		<>
			{isLoadingStudentSolutions ? (
				<div className="flex h-full w-full items-center justify-center">
					<BanterLoader />
				</div>
			) : (
				<DataTable
					columns={studentOwnSolutionsColumns}
					data={studentSolutionsData}
					enablePagination={false}
					showColumnViewControl={true}
					notVisibleColumns={["dateCreated"]}
					onRowClick={(row) => {
						onCodeEditorUpdate(row.code);
					}}
				/>
			)}
		</>
	);
}
