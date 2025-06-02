"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Progress } from "@/components/ui/progress";
import { ProblemItem } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { completionStatuses, deadlineStatuses } from "./data";

export const problems: ProblemItem[] = [
	{
		id: "550e8400-e29b-41d4-a716-446655440001",
		dateCreated: new Date("2025-04-01T09:00:00Z"),
		dateModified: new Date("2025-04-10T10:00:00Z"),
		deadline: new Date("2025-05-01T23:59:00Z"),
		title: "Two Sum",
		class: "Data Structures & Algorithms",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440002",
		dateCreated: new Date("2025-04-03T08:00:00Z"),
		dateModified: new Date("2025-04-11T09:00:00Z"),
		deadline: new Date("2025-05-03T23:59:00Z"),
		title: "Reverse String",
		class: "Javascript Basics",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440003",
		dateCreated: new Date("2025-04-05T07:00:00Z"),
		dateModified: new Date("2025-04-12T09:00:00Z"),
		deadline: new Date("2025-05-10T23:59:00Z"),
		title: "Palindrome Check",
		class: "Intro to Python",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440004",
		dateCreated: new Date("2025-04-07T10:00:00Z"),
		dateModified: new Date("2025-04-13T13:00:00Z"),
		deadline: new Date("2025-05-07T23:59:00Z"),
		title: "FizzBuzz",
		class: "Javascript Basics",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440005",
		dateCreated: new Date("2025-04-08T10:30:00Z"),
		dateModified: new Date("2025-04-15T11:30:00Z"),
		deadline: new Date("2025-05-12T23:59:00Z"),
		title: "Factorial Calculator",
		class: "Intro to Python",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440006",
		dateCreated: new Date("2025-04-09T12:00:00Z"),
		dateModified: new Date("2025-04-17T14:00:00Z"),
		deadline: new Date("2025-05-15T23:59:00Z"),
		title: "Find Max in Array",
		class: "Frontend Development",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440007",
		dateCreated: new Date("2025-04-10T09:45:00Z"),
		dateModified: new Date("2025-04-18T10:15:00Z"),
		deadline: new Date("2025-05-18T23:59:00Z"),
		title: "Binary Search",
		class: "Algorithms 101",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440008",
		dateCreated: new Date("2025-04-11T14:00:00Z"),
		dateModified: new Date("2025-04-19T16:00:00Z"),
		deadline: new Date("2025-05-20T23:59:00Z"),
		title: "Count Vowels",
		class: "Javascript Basics",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440009",
		dateCreated: new Date("2025-04-12T10:00:00Z"),
		dateModified: new Date("2025-04-20T10:30:00Z"),
		deadline: new Date("2025-05-25T23:59:00Z"),
		title: "Merge Sorted Arrays",
		class: "Data Structures & Algorithms",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440010",
		dateCreated: new Date("2025-04-13T08:30:00Z"),
		dateModified: new Date("2025-04-22T09:00:00Z"),
		deadline: new Date("2025-05-27T23:59:00Z"),
		title: "Remove Duplicates",
		class: "Frontend Development",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440011",
		dateCreated: new Date("2025-04-14T09:30:00Z"),
		dateModified: new Date("2025-04-23T11:00:00Z"),
		deadline: new Date("2025-05-30T23:59:00Z"),
		title: "Object Deep Clone",
		class: "Javascript Basics",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440012",
		dateCreated: new Date("2025-04-15T10:30:00Z"),
		dateModified: new Date("2025-04-24T12:00:00Z"),
		deadline: new Date("2025-06-01T23:59:00Z"),
		title: "Linked List Traversal",
		class: "Data Structures & Algorithms",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440013",
		dateCreated: new Date("2025-04-16T11:00:00Z"),
		dateModified: new Date("2025-04-25T13:00:00Z"),
		deadline: new Date("2025-06-03T23:59:00Z"),
		title: "Anagram Check",
		class: "Intro to Python",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440014",
		dateCreated: new Date("2025-04-17T09:00:00Z"),
		dateModified: new Date("2025-04-26T10:00:00Z"),
		deadline: new Date("2025-06-05T23:59:00Z"),
		title: "Matrix Transpose",
		class: "Algorithms 101",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440015",
		dateCreated: new Date("2025-04-18T13:30:00Z"),
		dateModified: new Date("2025-04-27T14:30:00Z"),
		deadline: new Date("2025-06-07T23:59:00Z"),
		title: "Find Prime Numbers",
		class: "Intro to Python",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440016",
		dateCreated: new Date("2025-04-19T14:00:00Z"),
		dateModified: new Date("2025-04-28T15:00:00Z"),
		deadline: new Date("2025-06-10T23:59:00Z"),
		title: "Build Frequency Map",
		class: "Frontend Development",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440017",
		dateCreated: new Date("2025-04-20T15:00:00Z"),
		dateModified: new Date("2025-04-29T16:00:00Z"),
		deadline: new Date("2025-06-12T23:59:00Z"),
		title: "Array Rotation",
		class: "Data Structures & Algorithms",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440018",
		dateCreated: new Date("2025-04-21T10:00:00Z"),
		dateModified: new Date("2025-04-30T11:00:00Z"),
		deadline: new Date("2025-06-14T23:59:00Z"),
		title: "Bracket Validator",
		class: "Javascript Basics",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440019",
		dateCreated: new Date("2025-04-22T08:00:00Z"),
		dateModified: new Date("2025-05-01T09:00:00Z"),
		deadline: new Date("2025-06-15T23:59:00Z"),
		title: "Sort by Frequency",
		class: "Algorithms 101",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440020",
		dateCreated: new Date("2025-04-23T13:30:00Z"),
		dateModified: new Date("2025-05-02T14:30:00Z"),
		deadline: new Date("2025-06-17T23:59:00Z"),
		title: "Flatten Nested Array",
		class: "Frontend Development",
	},
];

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
			return deadline <= now ? "Overdue" : "Due Soon";
		},
		cell: ({ row }) => {
			const { deadline } = row.original;
			const now = new Date();

			if (deadline <= now) {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "Overdue");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						{status?.label && <span>{status.label}</span>}
					</div>
				);
			} else {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "Due Soon");
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
