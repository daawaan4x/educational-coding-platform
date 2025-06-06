/* eslint-disable @typescript-eslint/no-unused-vars */
import BanterLoader from "@/components/banter-load";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Language } from "@/lib/languages";
import { trpc } from "@/lib/trpc";
import { SolutionItem, SolutionsItem } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TeacherStudentSubmissionsView from "./teacher-student-submissions-view";

interface TeacherSubmissionsViewProps {
	classId?: string;
	submissions: Submission;
	onCodeEditorUpdate: (code: string, language: Language) => void;
	studentsSolutionsColumns: ColumnDef<SolutionsItem>[];
	problemId?: string;
	maxScore: number;
}

interface Submission {
	studentSolutionsView: boolean;
	selectedStudentInfo: {
		firstName: string;
		lastName: string;
		score: number;
		id: string;
	} | null;
	studentSolutionsData: SolutionItem[];
	studentsSolutionsData: SolutionsItem[];
	isLoadingStudentSolutions: boolean;
	isLoadingStudentsSolutions: boolean;
	handleStudentRowClick: (row: SolutionsItem) => void;
	handleBackToStudentsList: () => void;
	updateStudentScore: (score: number) => void;
}

export function TeacherSubmissionsView({
	classId,
	submissions,
	onCodeEditorUpdate,
	maxScore,
	studentsSolutionsColumns,
	problemId,
}: TeacherSubmissionsViewProps) {
	const {
		studentSolutionsView,
		selectedStudentInfo,
		studentSolutionsData,
		studentsSolutionsData,
		isLoadingStudentSolutions,
		isLoadingStudentsSolutions,
		handleStudentRowClick: onStudentRowClick,
		handleBackToStudentsList: onBackToStudentsList,
		updateStudentScore: onScoreUpdate,
	} = submissions;

	// Pagination state
	const [studentsPageIndex, setStudentsPageIndex] = useState(0);
	const [studentsPageSize, setStudentsPageSize] = useState(50);
	const [studentsSearch, setStudentsSearch] = useState("");
	const [tempScore, setTempScore] = useState<number>(selectedStudentInfo?.score ?? 0);
	const [isUpdatingScore, setIsUpdatingScore] = useState(false);

	// Update score mutation
	const updateScoreMutation = trpc.solutions.update_score.useMutation({
		onSuccess: (data) => {
			toast.success(`Score updated successfully! Updated ${data.updated_count} solution(s).`);
			// Update the local score state
			onScoreUpdate(tempScore);
			setIsUpdatingScore(false);

			// Go back to students list and invalidate cache
			onBackToStudentsList();
		},
		onError: (error) => {
			toast.error(`Failed to update score: ${error.message}`);
			setIsUpdatingScore(false);
		},
	});

	const {
		data: usersData,
		isLoading: usersIsLoading,
		isError: usersIsError,
		error: usersError,
		refetch: refetchUsers,
	} = trpc.users.list.useQuery({
		size: studentsPageSize,
		page: studentsPageIndex + 1,
		class_id: classId,
		search: studentsSearch,
		with_scores: true,
		problem_id: problemId,
		roles: ["student"],
	});

	const utils = trpc.useUtils();

	console.log("selectedStudentInfo", selectedStudentInfo);
	console.log("problemId", problemId);

	// Update tempScore when selectedStudentInfo changes
	useEffect(() => {
		setTempScore(selectedStudentInfo?.score ?? 0);
	}, [selectedStudentInfo]);

	const handleScoreUpdate = async () => {
		if (!problemId || !selectedStudentInfo?.id) {
			toast.error("Missing problem ID or student information");
			return;
		}

		if (tempScore < 0 || tempScore > maxScore) {
			toast.error(`Score must be between 0 and ${maxScore}`);
			return;
		}

		setIsUpdatingScore(true);
		toast.loading("Updating score...", { id: "score-update" });

		try {
			await updateScoreMutation.mutateAsync({
				problem_id: problemId,
				author_id: selectedStudentInfo.id,
				score: tempScore,
			});

			// Invalidate users cache to refresh the list
			await utils.users.list.invalidate();
			toast.dismiss("score-update");
		} catch (error) {
			toast.dismiss("score-update");
			console.error("Failed to update score:", error);
		}
	};

	const users: SolutionsItem[] =
		usersData?.data.map((user) => {
			return {
				authorId: user.id,
				authorFirstName: user.first_name,
				authorLastName: user.last_name,
				score: user.score ?? 0,
			};
		}) ?? [];

	if (usersIsError) {
		console.error("Error fetching users:", usersError);
	}

	const studentsPageCount = usersData?.meta ? usersData.meta.total_pages : undefined;

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
							<Label htmlFor="studentScore">Score (out of {maxScore})</Label>
							<div className="flex gap-2">
								<Input
									id="studentScore"
									type="number"
									min="0"
									max={maxScore}
									placeholder="Enter score"
									value={tempScore.toString()}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const value = Number(e.target.value);
										const constrainedValue = Math.min(Math.max(value, 0), maxScore);
										setTempScore(constrainedValue);
									}}
									disabled={isUpdatingScore}
								/>
								<Button
									variant="secondary"
									onClick={() => void handleScoreUpdate()}
									disabled={isUpdatingScore || tempScore === selectedStudentInfo?.score}>
									{isUpdatingScore ? "Updating..." : "Update"}
								</Button>
							</div>
						</div>

						{/* Student Solutions Table */}
						{problemId && selectedStudentInfo && (
							<TeacherStudentSubmissionsView
								onCodeEditorUpdate={onCodeEditorUpdate}
								problemId={problemId}
								selectedStudentInfo={selectedStudentInfo}
							/>
						)}
					</>
				)}
			</div>
		);
	}

	// Students List View
	return (
		<>
			{usersIsLoading ? (
				<div className="flex h-full w-full items-center justify-center">
					<BanterLoader />
				</div>
			) : (
				<DataTable
					columns={studentsSolutionsColumns}
					data={users}
					enablePagination={false}
					onRowClick={onStudentRowClick}
					manualPagination={true}
					pageIndex={studentsPageIndex}
					pageSize={studentsPageSize}
					pageCount={studentsPageCount}
					defaultPageSize={studentsPageSize}
					manualFiltering={true}
					onSearchChange={(value) => setStudentsSearch(value)}
					onPaginationChange={(newPageIndex, newPageSize) => {
						setStudentsPageIndex(newPageIndex);
						setStudentsPageSize(newPageSize);
					}}
				/>
			)}
		</>
	);
}
