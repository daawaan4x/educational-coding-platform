import { studentSolutionsColumns } from "@/app/(authed)/problems/add/solutions-columns";
import BanterLoader from "@/components/banter-load";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SolutionItem, SolutionsItem } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";

interface TeacherSubmissionsViewProps {
	studentSolutionsView: boolean;
	selectedStudentInfo: {
		firstName: string;
		lastName: string;
		score: number;
	} | null;
	studentSolutionsData: SolutionItem[];
	studentsSolutionsData: SolutionsItem[];
	isLoadingStudentSolutions: boolean;
	isLoadingStudentsSolutions: boolean;
	onStudentRowClick: (row: SolutionsItem) => void;
	onBackToStudentsList: () => void;
	onCodeEditorUpdate: (code: string) => void;
	onScoreUpdate: (score: number) => void;
	maxScore: number;
	studentsSolutionsColumns: ColumnDef<SolutionsItem>[];
}

export function TeacherSubmissionsView({
	studentSolutionsView,
	selectedStudentInfo,
	studentSolutionsData,
	studentsSolutionsData,
	isLoadingStudentSolutions,
	isLoadingStudentsSolutions,
	onStudentRowClick,
	onBackToStudentsList,
	onCodeEditorUpdate,
	onScoreUpdate,
	maxScore,
	studentsSolutionsColumns,
}: TeacherSubmissionsViewProps) {
	if (studentSolutionsView) {
		return (
			<div className="flex h-full w-full flex-col gap-2">
				{/* Back Button */}
				<div className="flex flex-row items-center justify-between">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="secondary" className="w-fit" onClick={onBackToStudentsList}>
								<ChevronLeft />
								<span className="sr-only">Go back to student list</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Go back</p>
						</TooltipContent>
					</Tooltip>
				</div>

				{/* Individual Student Solutions */}
				{isLoadingStudentSolutions ? (
					<div className="flex h-9/10 w-full items-center justify-center">
						<BanterLoader />
					</div>
				) : (
					<>
						<div className="mb-1 text-center">
							<h2 className="text-lg font-semibold">
								{selectedStudentInfo?.firstName} {selectedStudentInfo?.lastName}&apos;s Solutions
							</h2>
						</div>

						{/* Score Update Section */}
						<div className="mb-4 space-y-2">
							<Label htmlFor="studentScore">Score</Label>
							<div className="flex gap-2">
								<Input
									id="studentScore"
									type="number"
									min="0"
									max="100"
									placeholder="Enter score"
									value={selectedStudentInfo?.score?.toString() ?? ""}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const value = Number(e.target.value);
										const constrainedValue = Math.min(Math.max(value, 0), maxScore);
										onScoreUpdate(constrainedValue);
									}}
								/>
								<Button
									variant="secondary"
									onClick={() => {
										// Handle score update
										console.log("Updating score");
									}}>
									Update
								</Button>
							</div>
						</div>

						{/* Student Solutions Table */}
						<DataTable
							columns={studentSolutionsColumns}
							data={studentSolutionsData}
							enablePagination={false}
							showColumnViewControl={false}
							onRowClick={(row) => {
								onCodeEditorUpdate(row.code);
							}}
						/>
					</>
				)}
			</div>
		);
	}

	// Students List View
	return (
		<>
			{isLoadingStudentsSolutions ? (
				<div className="flex h-full w-full items-center justify-center">
					<BanterLoader />
				</div>
			) : (
				<DataTable
					columns={studentsSolutionsColumns}
					data={studentsSolutionsData}
					enablePagination={false}
					onRowClick={onStudentRowClick}
				/>
			)}
		</>
	);
}
