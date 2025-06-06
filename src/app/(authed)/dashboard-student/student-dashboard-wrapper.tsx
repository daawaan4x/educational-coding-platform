/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// We need to use this wrapper because the width of the content must vary
// depending on the sidebar state. We need a client component to use React Context.
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
import { ProblemItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AppRouter } from "@/server/trpc/app";
import { ColumnFiltersState } from "@tanstack/react-table";
import { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { CirclePlus, FolderKanban } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebounce, useDebouncedCallback, useThrottledCallback } from "use-debounce";
import { deadlineStatuses } from "../data";
import { problemColumns } from "./problems-columns";

export default function StudentDashboardWrapper() {
	const router = useRouter();
	const { state, isMobile } = useSidebar();

	const [search, setSearchValue] = useState<string | undefined>(undefined);
	const [deadlineStatus, setDeadlineStatus] = useState<(typeof deadlineStatuses)[number]["value"] | undefined>(
		undefined,
	);

	const onSearchChange = useThrottledCallback((search: string) => {
		setSearchValue(search);
	}, 500);

	const onFilterChange = useThrottledCallback((filters: ColumnFiltersState) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
		setDeadlineStatus(filters.find((filter) => filter.id == "deadlineStatus")?.value as any);
	}, 500);

	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const { data, isLoading, error } = trpc.problems.list.useQuery({
		size: pageSize,
		page: pageIndex + 1,
		search,
		deadline_status: deadlineStatus,
	});

	const problems: ProblemItem[] =
		data?.data.map((problem) => ({
			id: problem.id,
			class: problem.class.name,
			dateCreated: problem.date_created,
			dateModified: problem.date_modified,
			title: problem.name,
			deadline: problem.deadline,
		})) ?? [];

	const pageCount = data?.meta?.total_pages ?? -1;

	if (error) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-red-500">Error loading users: {error.message}</p>
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
			</div>
			<DataTable
				columns={problemColumns}
				data={problems}
				notVisibleColumns={["studentsCompleted", "totalStudents", "dateCreated", "dateModified"]}
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
				]}
				onFilterChange={onFilterChange}
				onRowClick={(row) => {
					router.push(`/problems/${row.id}`);
				}}
				isLoading={isLoading}
			/>
		</div>
	);
}
