"use client";

import { DataTable } from "@/components/data-table";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useThrottledCallback } from "use-debounce";
import { classSelectColumns } from "./classes-columns";

interface ClassSelectorProps {
	onSelectionChange: (selectedClassId: string) => void;
}

export function ClassSelector({ onSelectionChange }: ClassSelectorProps) {
	const [search, setSearch] = useState<string>("");
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const onSearchChange = useThrottledCallback((searchValue: string) => {
		setSearch(searchValue);
		setPageIndex(0); // Reset to first page when searching
	}, 500);

	// Isolated query for class selection
	const classesQuery = trpc.classes.list.useQuery({
		size: pageSize,
		page: pageIndex + 1,
		search: search || undefined,
	});

	// Transform classes data
	const classes =
		classesQuery.data?.data?.map((classItem) => ({
			id: classItem.id,
			name: classItem.name,
			dateCreated: new Date(classItem.date_created),
			dateModified: new Date(classItem.date_modified),
		})) ?? [];

	return (
		<DataTable
			columns={classSelectColumns}
			data={classes}
			enablePagination={true}
			manualPagination={true}
			pageCount={classesQuery.data?.meta ? classesQuery.data.meta.total_pages : -1}
			pageIndex={pageIndex}
			pageSize={pageSize}
			defaultPageSize={pageSize}
			manualFiltering={false}
			onSearchChange={onSearchChange}
			onPaginationChange={(newPageIndex: number, newPageSize: number) => {
				setPageIndex(newPageIndex);
				setPageSize(newPageSize);
			}}
			filterSearchPlaceholder="Search classes..."
			enableSelection={true}
			singleSelection={true}
			onSelectionChange={(selectedClasses) => {
				onSelectionChange(selectedClasses[0]?.id || "");
			}}
			showColumnViewControl={false}
			className="py-0"
		/>
	);
}
