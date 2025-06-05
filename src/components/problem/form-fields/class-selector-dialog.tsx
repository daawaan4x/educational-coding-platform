"use client";

import { classSelectColumns } from "@/app/(authed)/dashboard-admin/classes-columns";
import { DataTable } from "@/components/data-table";
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
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useThrottledCallback } from "use-debounce";

interface ClassSelectorDialogProps {
	selectedClassId?: string;
	onClassSelect: (classId: string, className: string) => void;
	children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClassSelectorDialog({ selectedClassId, onClassSelect, children }: ClassSelectorDialogProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState<string>("");
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [selectedClass, setSelectedClass] = useState<{ id: string; name: string } | null>(null);

	const onSearchChange = useThrottledCallback((searchValue: string) => {
		setSearch(searchValue);
		setPageIndex(0);
	}, 500);

	const classesQuery = trpc.classes.list.useQuery({
		size: pageSize,
		page: pageIndex + 1,
		search: search || undefined,
	});

	const classes =
		classesQuery.data?.data?.map((classItem) => ({
			id: classItem.id,
			name: classItem.name,
			dateCreated: new Date(classItem.date_created),
			dateModified: new Date(classItem.date_modified),
		})) ?? [];

	const handleSelectClass = () => {
		if (selectedClass) {
			console.log("Selecting class:", selectedClass);
			onClassSelect(selectedClass.id, selectedClass.name);
			setOpen(false);
			setSelectedClass(null);
		}
	};

	const handleSelectionChange = (
		selectedClasses: { id: string; name: string; dateCreated: Date; dateModified: Date }[],
	) => {
		console.log("Selection changed:", selectedClasses);
		if (selectedClasses.length > 0) {
			const selected = selectedClasses[0];
			console.log("Selected class:", selected);
			setSelectedClass({
				id: selected.id,
				name: selected.name,
			});
		} else {
			setSelectedClass(null);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Select Class</DialogTitle>
					<DialogDescription>Choose a class where this problem will be assigned.</DialogDescription>
				</DialogHeader>
				<div className="max-h-96 overflow-y-auto">
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
						onSelectionChange={handleSelectionChange}
						showColumnViewControl={false}
						className="py-0"
					/>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSelectClass} disabled={!selectedClass}>
						Select Class
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
