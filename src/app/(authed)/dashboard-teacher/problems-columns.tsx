"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Progress } from "@/components/ui/progress";
import { ProblemItemWithProgress } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { completionStatuses, deadlineStatuses } from "../data";

export const problemsForTeacher: ProblemItemWithProgress[] = [
	{
		id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
		dateCreated: new Date("2025-04-01T09:00:00Z"),
		dateModified: new Date("2025-04-10T10:00:00Z"),
		deadline: new Date("2025-05-01T23:59:00Z"),
		title: "Two Sum",
		class: "Data Structures & Algorithms",
		studentsCompleted: 18,
		totalStudents: 20,
	},
	{
		id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
		dateCreated: new Date("2025-04-03T08:30:00Z"),
		dateModified: new Date("2025-04-11T12:00:00Z"),
		deadline: new Date("2025-05-05T23:59:00Z"),
		title: "Reverse String",
		class: "Javascript Basics",
		studentsCompleted: 15,
		totalStudents: 18,
	},
	{
		id: "c3d4e5f6-g7h8-9012-cdef-345678901234",
		dateCreated: new Date("2025-04-05T07:00:00Z"),
		dateModified: new Date("2025-04-12T09:00:00Z"),
		deadline: new Date("2025-05-10T23:59:00Z"),
		title: "Palindrome Check",
		class: "Intro to Python",
		studentsCompleted: 12,
		totalStudents: 16,
	},
	{
		id: "d4e5f6g7-h8i9-0123-defg-456789012345",
		dateCreated: new Date("2025-04-07T10:00:00Z"),
		dateModified: new Date("2025-04-13T13:00:00Z"),
		deadline: new Date("2025-05-07T23:59:00Z"),
		title: "FizzBuzz",
		class: "Javascript Basics",
		studentsCompleted: 17,
		totalStudents: 18,
	},
	{
		id: "e5f6g7h8-i9j0-1234-efgh-567890123456",
		dateCreated: new Date("2025-04-08T10:30:00Z"),
		dateModified: new Date("2025-04-15T11:30:00Z"),
		deadline: new Date("2025-05-12T23:59:00Z"),
		title: "Factorial Calculator",
		class: "Intro to Python",
		studentsCompleted: 14,
		totalStudents: 15,
	},
	{
		id: "f6g7h8i9-j0k1-2345-fghi-678901234567",
		dateCreated: new Date("2025-04-09T12:00:00Z"),
		dateModified: new Date("2025-04-17T14:00:00Z"),
		deadline: new Date("2025-05-15T23:59:00Z"),
		title: "Find Max in Array",
		class: "Frontend Development",
		studentsCompleted: 19,
		totalStudents: 20,
	},
	{
		id: "g7h8i9j0-k1l2-3456-ghij-789012345678",
		dateCreated: new Date("2025-04-10T09:45:00Z"),
		dateModified: new Date("2025-04-18T10:15:00Z"),
		deadline: new Date("2025-05-18T23:59:00Z"),
		title: "Binary Search",
		class: "Algorithms 101",
		studentsCompleted: 13,
		totalStudents: 14,
	},
	{
		id: "h8i9j0k1-l2m3-4567-hijk-890123456789",
		dateCreated: new Date("2025-04-11T14:00:00Z"),
		dateModified: new Date("2025-04-19T16:00:00Z"),
		deadline: new Date("2025-05-20T23:59:00Z"),
		title: "Count Vowels",
		class: "Javascript Basics",
		studentsCompleted: 16,
		totalStudents: 16,
	},
	{
		id: "i9j0k1l2-m3n4-5678-ijkl-901234567890",
		dateCreated: new Date("2025-04-12T10:00:00Z"),
		dateModified: new Date("2025-04-20T10:30:00Z"),
		deadline: new Date("2025-05-25T23:59:00Z"),
		title: "Merge Sorted Arrays",
		class: "Data Structures & Algorithms",
		studentsCompleted: 11,
		totalStudents: 13,
	},
	{
		id: "j0k1l2m3-n4o5-6789-jklm-012345678901",
		dateCreated: new Date("2025-04-13T08:30:00Z"),
		dateModified: new Date("2025-04-22T09:00:00Z"),
		deadline: new Date("2025-05-27T23:59:00Z"),
		title: "Remove Duplicates",
		class: "Frontend Development",
		studentsCompleted: 20,
		totalStudents: 20,
	},
	{
		id: "k1l2m3n4-o5p6-7890-klmn-123456789012",
		dateCreated: new Date("2025-04-14T09:30:00Z"),
		dateModified: new Date("2025-04-23T11:00:00Z"),
		deadline: new Date("2025-05-30T23:59:00Z"),
		title: "Object Deep Clone",
		class: "Javascript Basics",
		studentsCompleted: 13,
		totalStudents: 18,
	},
	{
		id: "l2m3n4o5-p6q7-8901-lmno-234567890123",
		dateCreated: new Date("2025-04-15T10:30:00Z"),
		dateModified: new Date("2025-04-24T12:00:00Z"),
		deadline: new Date("2025-06-01T23:59:00Z"),
		title: "Linked List Traversal",
		class: "Data Structures & Algorithms",
		studentsCompleted: 10,
		totalStudents: 14,
	},
	{
		id: "m3n4o5p6-q7r8-9012-mnop-345678901234",
		dateCreated: new Date("2025-04-16T11:00:00Z"),
		dateModified: new Date("2025-04-25T13:00:00Z"),
		deadline: new Date("2025-06-03T23:59:00Z"),
		title: "Anagram Check",
		class: "Intro to Python",
		studentsCompleted: 9,
		totalStudents: 10,
	},
	{
		id: "n4o5p6q7-r8s9-0123-nopq-456789012345",
		dateCreated: new Date("2025-04-17T09:00:00Z"),
		dateModified: new Date("2025-04-26T10:00:00Z"),
		deadline: new Date("2025-06-05T23:59:00Z"),
		title: "Matrix Transpose",
		class: "Algorithms 101",
		studentsCompleted: 8,
		totalStudents: 10,
	},
	{
		id: "o5p6q7r8-s9t0-1234-opqr-567890123456",
		dateCreated: new Date("2025-04-18T13:30:00Z"),
		dateModified: new Date("2025-04-27T14:30:00Z"),
		deadline: new Date("2025-06-07T23:59:00Z"),
		title: "Find Prime Numbers",
		class: "Intro to Python",
		studentsCompleted: 7,
		totalStudents: 10,
	},
	{
		id: "p6q7r8s9-t0u1-2345-pqrs-678901234567",
		dateCreated: new Date("2025-04-19T14:00:00Z"),
		dateModified: new Date("2025-04-28T15:00:00Z"),
		deadline: new Date("2025-06-10T23:59:00Z"),
		title: "Build Frequency Map",
		class: "Frontend Development",
		studentsCompleted: 14,
		totalStudents: 18,
	},
	{
		id: "q7r8s9t0-u1v2-3456-qrst-789012345678",
		dateCreated: new Date("2025-04-20T15:00:00Z"),
		dateModified: new Date("2025-04-29T16:00:00Z"),
		deadline: new Date("2025-06-12T23:59:00Z"),
		title: "Array Rotation",
		class: "Data Structures & Algorithms",
		studentsCompleted: 13,
		totalStudents: 15,
	},
	{
		id: "r8s9t0u1-v2w3-4567-rstu-890123456789",
		dateCreated: new Date("2025-04-21T10:00:00Z"),
		dateModified: new Date("2025-04-30T11:00:00Z"),
		deadline: new Date("2025-06-14T23:59:00Z"),
		title: "Bracket Validator",
		class: "Javascript Basics",
		studentsCompleted: 16,
		totalStudents: 18,
	},
	{
		id: "s9t0u1v2-w3x4-5678-stuv-901234567890",
		dateCreated: new Date("2025-04-22T08:00:00Z"),
		dateModified: new Date("2025-05-01T09:00:00Z"),
		deadline: new Date("2025-06-15T23:59:00Z"),
		title: "Sort by Frequency",
		class: "Algorithms 101",
		studentsCompleted: 12,
		totalStudents: 15,
	},
	{
		id: "t0u1v2w3-x4y5-6789-tuvw-012345678901",
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
			const { deadline: date } = row.original;
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
						{status && <span>{status.label}</span>}
					</div>
				);
			} else {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "due-soon");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						{status && <span>{status.label}</span>}
					</div>
				);
			}
		},
		filterFn: (row, id, value) => {
			return value === row.original.id;
		},
	},
	{
		accessorKey: "completed",
		header: "Completed",
		cell: ({ row }) => {
			const { totalStudents, studentsCompleted } = row.original;
			return <Progress value={(studentsCompleted / totalStudents) * 100} />;
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
		accessorKey: "completionStatus",
		header: "Completion Status",
		accessorFn: (row) => {
			// This function computes the value for filtering
			if (row.studentsCompleted === row.totalStudents) return "All Completed";
			else if (row.studentsCompleted > 0) return "Partially Completed";
			else return "Not Started";
		},
		cell: ({ row }) => {
			const { totalStudents, studentsCompleted } = row.original;
			let status;
			if (studentsCompleted === totalStudents) {
				status = completionStatuses.find((completionObj) => completionObj.value === "all-completed");
			} else if (studentsCompleted > 0) {
				status = completionStatuses.find((completionObj) => completionObj.value === "partially-completed");
			} else {
				status = completionStatuses.find((completionObj) => completionObj.value === "not-started");
			}
			return (
				<div className="flex items-center">
					{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
					{status && <span>{status.label}</span>}
				</div>
			);
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
