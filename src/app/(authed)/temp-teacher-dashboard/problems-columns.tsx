/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Progress } from "@/components/ui/progress";
import { ProblemItemWithProgress } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { completionStatuses, deadlineStatuses } from "../data";

export const problems: ProblemItemWithProgress[] = [
	{
		dateCreated: new Date("2025-04-01T09:00:00Z"),
		dateModified: new Date("2025-04-10T10:00:00Z"),
		deadline: new Date("2025-05-01T23:59:00Z"),
		title: "Two Sum",
		class: "Data Structures & Algorithms",
		studentsCompleted: 18,
		totalStudents: 20,
	},
	{
		dateCreated: new Date("2025-04-03T08:30:00Z"),
		dateModified: new Date("2025-04-11T12:00:00Z"),
		deadline: new Date("2025-05-05T23:59:00Z"),
		title: "Reverse String",
		class: "Javascript Basics",
		studentsCompleted: 15,
		totalStudents: 18,
	},
	{
		dateCreated: new Date("2025-04-05T07:00:00Z"),
		dateModified: new Date("2025-04-12T09:00:00Z"),
		deadline: new Date("2025-05-10T23:59:00Z"),
		title: "Palindrome Check",
		class: "Intro to Python",
		studentsCompleted: 12,
		totalStudents: 16,
	},
	{
		dateCreated: new Date("2025-04-07T10:00:00Z"),
		dateModified: new Date("2025-04-13T13:00:00Z"),
		deadline: new Date("2025-05-07T23:59:00Z"),
		title: "FizzBuzz",
		class: "Javascript Basics",
		studentsCompleted: 17,
		totalStudents: 18,
	},
	{
		dateCreated: new Date("2025-04-08T10:30:00Z"),
		dateModified: new Date("2025-04-15T11:30:00Z"),
		deadline: new Date("2025-05-12T23:59:00Z"),
		title: "Factorial Calculator",
		class: "Intro to Python",
		studentsCompleted: 14,
		totalStudents: 15,
	},
	{
		dateCreated: new Date("2025-04-09T12:00:00Z"),
		dateModified: new Date("2025-04-17T14:00:00Z"),
		deadline: new Date("2025-05-15T23:59:00Z"),
		title: "Find Max in Array",
		class: "Frontend Development",
		studentsCompleted: 19,
		totalStudents: 20,
	},
	{
		dateCreated: new Date("2025-04-10T09:45:00Z"),
		dateModified: new Date("2025-04-18T10:15:00Z"),
		deadline: new Date("2025-05-18T23:59:00Z"),
		title: "Binary Search",
		class: "Algorithms 101",
		studentsCompleted: 13,
		totalStudents: 14,
	},
	{
		dateCreated: new Date("2025-04-11T14:00:00Z"),
		dateModified: new Date("2025-04-19T16:00:00Z"),
		deadline: new Date("2025-05-20T23:59:00Z"),
		title: "Count Vowels",
		class: "Javascript Basics",
		studentsCompleted: 16,
		totalStudents: 16,
	},
	{
		dateCreated: new Date("2025-04-12T10:00:00Z"),
		dateModified: new Date("2025-04-20T10:30:00Z"),
		deadline: new Date("2025-05-25T23:59:00Z"),
		title: "Merge Sorted Arrays",
		class: "Data Structures & Algorithms",
		studentsCompleted: 11,
		totalStudents: 13,
	},
	{
		dateCreated: new Date("2025-04-13T08:30:00Z"),
		dateModified: new Date("2025-04-22T09:00:00Z"),
		deadline: new Date("2025-05-27T23:59:00Z"),
		title: "Remove Duplicates",
		class: "Frontend Development",
		studentsCompleted: 20,
		totalStudents: 20,
	},
	{
		dateCreated: new Date("2025-04-14T09:30:00Z"),
		dateModified: new Date("2025-04-23T11:00:00Z"),
		deadline: new Date("2025-05-30T23:59:00Z"),
		title: "Object Deep Clone",
		class: "Javascript Basics",
		studentsCompleted: 13,
		totalStudents: 18,
	},
	{
		dateCreated: new Date("2025-04-15T10:30:00Z"),
		dateModified: new Date("2025-04-24T12:00:00Z"),
		deadline: new Date("2025-06-01T23:59:00Z"),
		title: "Linked List Traversal",
		class: "Data Structures & Algorithms",
		studentsCompleted: 10,
		totalStudents: 14,
	},
	{
		dateCreated: new Date("2025-04-16T11:00:00Z"),
		dateModified: new Date("2025-04-25T13:00:00Z"),
		deadline: new Date("2025-06-03T23:59:00Z"),
		title: "Anagram Check",
		class: "Intro to Python",
		studentsCompleted: 9,
		totalStudents: 10,
	},
	{
		dateCreated: new Date("2025-04-17T09:00:00Z"),
		dateModified: new Date("2025-04-26T10:00:00Z"),
		deadline: new Date("2025-06-05T23:59:00Z"),
		title: "Matrix Transpose",
		class: "Algorithms 101",
		studentsCompleted: 8,
		totalStudents: 10,
	},
	{
		dateCreated: new Date("2025-04-18T13:30:00Z"),
		dateModified: new Date("2025-04-27T14:30:00Z"),
		deadline: new Date("2025-06-07T23:59:00Z"),
		title: "Find Prime Numbers",
		class: "Intro to Python",
		studentsCompleted: 7,
		totalStudents: 10,
	},
	{
		dateCreated: new Date("2025-04-19T14:00:00Z"),
		dateModified: new Date("2025-04-28T15:00:00Z"),
		deadline: new Date("2025-06-10T23:59:00Z"),
		title: "Build Frequency Map",
		class: "Frontend Development",
		studentsCompleted: 14,
		totalStudents: 18,
	},
	{
		dateCreated: new Date("2025-04-20T15:00:00Z"),
		dateModified: new Date("2025-04-29T16:00:00Z"),
		deadline: new Date("2025-06-12T23:59:00Z"),
		title: "Array Rotation",
		class: "Data Structures & Algorithms",
		studentsCompleted: 13,
		totalStudents: 15,
	},
	{
		dateCreated: new Date("2025-04-21T10:00:00Z"),
		dateModified: new Date("2025-04-30T11:00:00Z"),
		deadline: new Date("2025-06-14T23:59:00Z"),
		title: "Bracket Validator",
		class: "Javascript Basics",
		studentsCompleted: 16,
		totalStudents: 18,
	},
	{
		dateCreated: new Date("2025-04-22T08:00:00Z"),
		dateModified: new Date("2025-05-01T09:00:00Z"),
		deadline: new Date("2025-06-15T23:59:00Z"),
		title: "Sort by Frequency",
		class: "Algorithms 101",
		studentsCompleted: 12,
		totalStudents: 15,
	},
	{
		dateCreated: new Date("2025-04-23T13:30:00Z"),
		dateModified: new Date("2025-05-02T14:30:00Z"),
		deadline: new Date("2025-06-17T23:59:00Z"),
		title: "Flatten Nested Array",
		class: "Frontend Development",
		studentsCompleted: 17,
		totalStudents: 18,
	},
];

export const problemColumns: ColumnDef<ProblemItemWithProgress>[] = [
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
			const date = row.getValue("deadline") as Date;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "studentsCompleted",
		header: "Students Completed",
	},
	{
		accessorKey: "totalStudents",
		header: "Total Students",
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
			const deadline = row.getValue("deadline") as Date;
			const now = new Date();

			if (deadline <= now) {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "Overdue");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						{status && <span>{status.label}</span>}
					</div>
				);
			} else {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "Due Soon");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						{status && <span>{status.label}</span>}
					</div>
				);
			}
		},
		filterFn: (row, id, value) => {
			return value === row.getValue(id);
		},
	},
	{
		accessorKey: "completed",
		header: "Completed",
		cell: ({
			row,
		}: {
			row: {
				getValue: (key: string) => unknown;
			};
		}) => {
			const totalStudents = row.getValue("totalStudents") as number;
			const studentsCompleted = row.getValue("studentsCompleted") as number;
			return <Progress value={(studentsCompleted / totalStudents) * 100} />;
		},
	},
	{
		accessorKey: "dateModified",
		header: "Date Modified",
		cell: ({ row }) => {
			const date = row.getValue("dateModified") as Date;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "dateCreated",
		header: "Date Created",
		cell: ({ row }) => {
			const date = row.getValue("dateCreated") as Date;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "completionStatus",
		header: "Completion Status",
		accessorFn: (row) => {
			// This function computes the value for filtering
			if (row.studentsCompleted === row.totalStudents) return "All Completed";
			else if (row.studentsCompleted > 0) return "Partially Completed";
			else return "Not Started";
		},
		cell: ({ row }) => {
			const totalStudents = row.getValue("totalStudents") as number;
			const studentsCompleted = row.getValue("studentsCompleted") as number;
			let status;
			if (studentsCompleted === totalStudents) {
				status = completionStatuses.find((completionObj) => completionObj.value === "All Completed");
			} else if (studentsCompleted > 0) {
				status = completionStatuses.find((completionObj) => completionObj.value === "Partially Completed");
			} else {
				status = completionStatuses.find((completionObj) => completionObj.value === "Not Started");
			}
			return (
				<div className="flex items-center">
					{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
					{status && <span>{status.label}</span>}
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value === row.getValue(id);
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
