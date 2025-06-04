"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { ProblemItem } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { deadlineStatuses } from "../data";

export const problemColumns: ColumnDef<ProblemItem>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
	},
	{
		accessorKey: "class",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
	},
	{
		accessorKey: "deadline",
		header: "Deadline",
		cell: ({ row }) => {
			const { deadline: date } = row.original;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "dateModified",
		header: "Date Modified",
		cell: ({ row }) => {
			const { dateModified: date } = row.original;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "dateCreated",
		header: "Date Created",
		cell: ({ row }) => {
			const { dateCreated: date } = row.original;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "deadlineStatus",
		header: "Deadline Status",
		accessorFn: (row) => {
			const deadline = row.deadline;
			const now = new Date();
			return deadline <= now ? "overdue" : "due-soon";
		},
		cell: ({ row }) => {
			const { deadline } = row.original;
			const now = new Date();

			if (deadline <= now) {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "overdue");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						{status?.label && <span>{status.label}</span>}
					</div>
				);
			} else {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "due-soon");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						{status?.label && <span>{status.label}</span>}
					</div>
				);
			}
		},
		filterFn: (row, id, value) => {
			return value === row.original.id;
		},
	},
];

// Tooltip component for progress bar not working
{
	/* <TooltipProvider><Tooltip>
	<TooltipTrigger><Progress value={(studentsCompleted / totalStudents) * 100} /></TooltipTrigger>
	<TooltipContent>
		<sup>{studentsCompleted}</sup>&frasl;<sub>{totalStudents}</sub>
	</TooltipContent>
</Tooltip></TooltipProvider> */
}
