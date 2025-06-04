/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

// We need to use this wrapper because the width of the content must vary
// depending on the sidebar state. We need a client component to use React Context.
import BanterLoad from "@/components/banter-load";
import { DataTable, FilterOptionItem } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { trpc } from "@/lib/trpc";
import { ProblemItemWithProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AppRouter } from "@/server/trpc/app";
import { ColumnFiltersState } from "@tanstack/react-table";
import { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { CirclePlus, FolderKanban } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDebounce, useDebouncedCallback, useThrottledCallback } from "use-debounce";
import { completionStatuses, deadlineStatuses } from "../data";
import { classColumns } from "./classes-columns";
import { problemColumns } from "./problems-columns";

export default function TeacherDashboardWrapper() {
	const { state, isMobile } = useSidebar();
	const { data: session, status } = useSession();

	const [search, setSearchValue] = useState<string | undefined>(undefined);
	const [deadlineStatus, setDeadlineStatus] = useState<(typeof deadlineStatuses)[number]["value"] | undefined>(
		undefined,
	);
	const [completionStatus, setCompletionStatus] = useState<(typeof completionStatuses)[number]["value"] | undefined>(
		undefined,
	);

	const onSearchChange = useThrottledCallback((search: string) => {
		setSearchValue(search);
	}, 500);

	const onFilterChange = useThrottledCallback((filters: ColumnFiltersState) => {
		const deadlineFilter = filters.find((filter) => filter.id === "deadlineStatus");
		const completionFilter = filters.find((filter) => filter.id === "completionStatus");

		setDeadlineStatus(deadlineFilter?.value as (typeof deadlineStatuses)[number]["value"] | undefined);
		setCompletionStatus(completionFilter?.value as (typeof completionStatuses)[number]["value"] | undefined);
	}, 500);

	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const { data, isLoading, error } = trpc.problems.list.useQuery({
		size: pageSize,
		page: pageIndex + 1,
		search,
		deadlineStatus,
		completionStatus: completionStatus
			? (completionStatus as "not-started" | "partially-completed" | "all-completed")
			: undefined,
		checkCompletion: true,
	});

	const problems: ProblemItemWithProgress[] =
		data?.data.map((problem) => ({
			id: problem.id,
			class: problem.class.name,
			dateCreated: problem.date_created,
			dateModified: problem.date_modified,
			title: problem.name,
			deadline: problem.deadline,
			studentsCompleted: problem.studentsCompleted ?? 0,
			totalStudents: problem.totalStudents ?? 0,
		})) ?? [];

	const pageCount = data?.meta?.total_pages ?? -1;

	// Fetch classes for the current user
	const { data: classesData, isLoading: isLoadingClasses } = trpc.classes.list_by_user.useQuery(
		{
			user_id: session?.user?.id ?? "",
			size: 50,
			page: 1,
		},
		{
			enabled: !!session?.user?.id,
		},
	);

	const userClasses =
		classesData?.data.map((classItem) => ({
			id: classItem.id,
			name: classItem.name,
			dateCreated: new Date(classItem.date_created),
			dateModified: new Date(classItem.date_modified),
		})) ?? [];

	if (error) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-red-500">Error loading problems: {error.message}</p>
			</div>
		);
	}

	return (
		<div
			className={cn("align-items mt-3 flex w-full flex-col justify-center overflow-hidden px-8 pb-8", {
				"max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
			})}>
			<div className="flex items-center justify-between gap-3 border-b pb-2">
				<h2>Problems</h2>
				<div className="flex flex-wrap items-center justify-end gap-3 lg:flex-nowrap">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">
								<FolderKanban /> Manage Classes
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Manage Classes</DialogTitle>
								<DialogDescription>
									View and organize your classes. You can add, edit, or remove classes as needed.
								</DialogDescription>
							</DialogHeader>
							{isLoadingClasses ? (
								<div className="flex h-full w-full items-center justify-center">
									<BanterLoad />
								</div>
							) : (
								<DataTable
									columns={classColumns}
									data={userClasses}
									filterColumn="name"
									notVisibleColumns={["dateCreated", "dateModified"]}
									enablePagination={false}
								/>
							)}
						</DialogContent>
					</Dialog>
					<Button variant="outline">
						<CirclePlus /> Add Problem
					</Button>
				</div>
			</div>{" "}
			<DataTable
				columns={problemColumns}
				data={problems}
				notVisibleColumns={["studentsCompleted", "totalStudents", "dateCreated", "dateModified", "completionStatus"]}
				enablePagination={true}
				pageCount={pageCount}
				pageIndex={pageIndex}
				pageSize={pageSize}
				defaultPageSize={pageSize}
				onPaginationChange={(newPageIndex: number, newPageSize: number) => {
					setPageIndex(newPageIndex);
					setPageSize(newPageSize);
				}}
				manualPagination={true}
				manualFiltering={true}
				onSearchChange={onSearchChange}
				filters={[
					{
						column: "deadlineStatus",
						options: deadlineStatuses,
					},
					{
						column: "completionStatus",
						options: completionStatuses,
					},
				]}
				onFilterChange={onFilterChange}
			/>
		</div>
	);
}
