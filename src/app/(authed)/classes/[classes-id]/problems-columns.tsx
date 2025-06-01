"use client";

import { completionStatuses, deadlineStatuses } from "@/app/(authed)/data";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Progress } from "@/components/ui/progress";
import { ProblemItemStudent, ProblemItemWithProgress } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const problems: ProblemItemWithProgress[] = [
	{
		id: "550e8400-e29b-41d4-a716-446655440001",
		dateCreated: new Date("2025-04-01T09:00:00Z"),
		dateModified: new Date("2025-04-10T10:00:00Z"),
		deadline: new Date("2025-05-01T23:59:00Z"),
		title: "Two Sum",
		class: "Data Structures & Algorithms",
		studentsCompleted: 18,
		totalStudents: 20,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440002",
		dateCreated: new Date("2025-04-03T08:30:00Z"),
		dateModified: new Date("2025-04-11T12:00:00Z"),
		deadline: new Date("2025-05-05T23:59:00Z"),
		title: "Reverse String",
		class: "Javascript Basics",
		studentsCompleted: 15,
		totalStudents: 18,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440003",
		dateCreated: new Date("2025-04-05T07:00:00Z"),
		dateModified: new Date("2025-04-12T09:00:00Z"),
		deadline: new Date("2025-05-10T23:59:00Z"),
		title: "Palindrome Check",
		class: "Intro to Python",
		studentsCompleted: 12,
		totalStudents: 16,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440004",
		dateCreated: new Date("2025-04-07T10:00:00Z"),
		dateModified: new Date("2025-04-13T13:00:00Z"),
		deadline: new Date("2025-05-07T23:59:00Z"),
		title: "FizzBuzz",
		class: "Javascript Basics",
		studentsCompleted: 17,
		totalStudents: 18,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440005",
		dateCreated: new Date("2025-04-08T10:30:00Z"),
		dateModified: new Date("2025-04-15T11:30:00Z"),
		deadline: new Date("2025-05-12T23:59:00Z"),
		title: "Factorial Calculator",
		class: "Intro to Python",
		studentsCompleted: 14,
		totalStudents: 15,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440006",
		dateCreated: new Date("2025-04-09T12:00:00Z"),
		dateModified: new Date("2025-04-17T14:00:00Z"),
		deadline: new Date("2025-05-15T23:59:00Z"),
		title: "Find Max in Array",
		class: "Frontend Development",
		studentsCompleted: 19,
		totalStudents: 20,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440007",
		dateCreated: new Date("2025-04-10T09:45:00Z"),
		dateModified: new Date("2025-04-18T10:15:00Z"),
		deadline: new Date("2025-05-18T23:59:00Z"),
		title: "Binary Search",
		class: "Algorithms 101",
		studentsCompleted: 13,
		totalStudents: 14,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440008",
		dateCreated: new Date("2025-04-11T14:00:00Z"),
		dateModified: new Date("2025-04-19T16:00:00Z"),
		deadline: new Date("2025-05-20T23:59:00Z"),
		title: "Count Vowels",
		class: "Javascript Basics",
		studentsCompleted: 16,
		totalStudents: 16,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440009",
		dateCreated: new Date("2025-04-12T10:00:00Z"),
		dateModified: new Date("2025-04-20T10:30:00Z"),
		deadline: new Date("2025-05-25T23:59:00Z"),
		title: "Merge Sorted Arrays",
		class: "Data Structures & Algorithms",
		studentsCompleted: 11,
		totalStudents: 13,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440010",
		dateCreated: new Date("2025-04-13T08:30:00Z"),
		dateModified: new Date("2025-04-22T09:00:00Z"),
		deadline: new Date("2025-05-27T23:59:00Z"),
		title: "Remove Duplicates",
		class: "Frontend Development",
		studentsCompleted: 20,
		totalStudents: 20,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440011",
		dateCreated: new Date("2025-04-14T09:30:00Z"),
		dateModified: new Date("2025-04-23T11:00:00Z"),
		deadline: new Date("2025-05-30T23:59:00Z"),
		title: "Object Deep Clone",
		class: "Javascript Basics",
		studentsCompleted: 13,
		totalStudents: 18,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440012",
		dateCreated: new Date("2025-04-15T10:30:00Z"),
		dateModified: new Date("2025-04-24T12:00:00Z"),
		deadline: new Date("2025-06-01T23:59:00Z"),
		title: "Linked List Traversal",
		class: "Data Structures & Algorithms",
		studentsCompleted: 10,
		totalStudents: 14,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440013",
		dateCreated: new Date("2025-04-16T11:00:00Z"),
		dateModified: new Date("2025-04-25T13:00:00Z"),
		deadline: new Date("2025-06-03T23:59:00Z"),
		title: "Anagram Check",
		class: "Intro to Python",
		studentsCompleted: 9,
		totalStudents: 10,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440014",
		dateCreated: new Date("2025-04-17T09:00:00Z"),
		dateModified: new Date("2025-04-26T10:00:00Z"),
		deadline: new Date("2025-06-05T23:59:00Z"),
		title: "Matrix Transpose",
		class: "Algorithms 101",
		studentsCompleted: 8,
		totalStudents: 10,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440015",
		dateCreated: new Date("2025-04-18T13:30:00Z"),
		dateModified: new Date("2025-04-27T14:30:00Z"),
		deadline: new Date("2025-06-07T23:59:00Z"),
		title: "Find Prime Numbers",
		class: "Intro to Python",
		studentsCompleted: 7,
		totalStudents: 10,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440016",
		dateCreated: new Date("2025-04-19T14:00:00Z"),
		dateModified: new Date("2025-04-28T15:00:00Z"),
		deadline: new Date("2025-06-10T23:59:00Z"),
		title: "Build Frequency Map",
		class: "Frontend Development",
		studentsCompleted: 14,
		totalStudents: 18,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440017",
		dateCreated: new Date("2025-04-20T15:00:00Z"),
		dateModified: new Date("2025-04-29T16:00:00Z"),
		deadline: new Date("2025-06-12T23:59:00Z"),
		title: "Array Rotation",
		class: "Data Structures & Algorithms",
		studentsCompleted: 13,
		totalStudents: 15,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440018",
		dateCreated: new Date("2025-04-21T10:00:00Z"),
		dateModified: new Date("2025-04-30T11:00:00Z"),
		deadline: new Date("2025-06-14T23:59:00Z"),
		title: "Bracket Validator",
		class: "Javascript Basics",
		studentsCompleted: 16,
		totalStudents: 18,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440019",
		dateCreated: new Date("2025-04-22T08:00:00Z"),
		dateModified: new Date("2025-05-01T09:00:00Z"),
		deadline: new Date("2025-06-15T23:59:00Z"),
		title: "Sort by Frequency",
		class: "Algorithms 101",
		studentsCompleted: 12,
		totalStudents: 15,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440020",
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
						<span>{status?.label}</span>
					</div>
				);
			} else {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "Due Soon");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						<span>{status?.label}</span>
					</div>
				);
			}
		},
		filterFn: (row, id, value) => {
			return value === row.getValue(id);
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
		accessorKey: "completed",
		header: "Completed",
		cell: ({ row }: { row: { getValue: (key: string) => number | string } }) => {
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
			if (studentsCompleted === totalStudents) {
				const status = completionStatuses.find((completionObj) => completionObj.value === "All Completed");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						<span>{status?.label}</span>
					</div>
				);
			} else if (studentsCompleted > 0) {
				const status = completionStatuses.find((completionObj) => completionObj.value === "Partially Completed");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						<span>{status?.label}</span>
					</div>
				);
			} else {
				const status = completionStatuses.find((completionObj) => completionObj.value === "Not Started");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						<span>{status?.label}</span>
					</div>
				);
			}
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

export const problemsForStudent: ProblemItemStudent[] = [
	{
		id: "550e8400-e29b-41d4-a716-446655440001",
		title: "FizzBuzz",
		dateCreated: new Date("2025-05-01T10:00:00Z"),
		dateModified: new Date("2025-05-02T11:30:00Z"),
		deadline: new Date("2025-05-05T23:59:59Z"),
		score: 10,
		maxScore: 10,
		submitted: true,
		attempts: 1,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440002",
		title: "Reverse a String",
		dateCreated: new Date("2025-05-02T09:15:00Z"),
		dateModified: new Date("2025-05-03T12:45:00Z"),
		deadline: new Date("2025-05-06T23:59:59Z"),
		score: 8,
		maxScore: 10,
		submitted: true,
		attempts: 2,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440003",
		title: "Palindrome Check",
		dateCreated: new Date("2025-05-03T08:30:00Z"),
		dateModified: new Date("2025-05-03T09:00:00Z"),
		deadline: new Date("2025-05-07T23:59:59Z"),
		score: 0,
		maxScore: 10,
		submitted: false,
		attempts: 0,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440004",
		title: "Two Sum",
		dateCreated: new Date("2025-05-03T10:00:00Z"),
		dateModified: new Date("2025-05-04T15:00:00Z"),
		deadline: new Date("2025-05-08T23:59:59Z"),
		score: 10,
		maxScore: 10,
		submitted: true,
		attempts: 1,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440005",
		title: "Merge Sorted Arrays",
		dateCreated: new Date("2025-05-04T12:00:00Z"),
		dateModified: new Date("2025-05-04T16:30:00Z"),
		deadline: new Date("2025-05-09T23:59:59Z"),
		score: 7,
		maxScore: 10,
		submitted: true,
		attempts: 3,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440006",
		title: "Valid Parentheses",
		dateCreated: new Date("2025-05-05T09:30:00Z"),
		dateModified: new Date("2025-05-06T10:00:00Z"),
		deadline: new Date("2025-05-10T23:59:59Z"),
		score: 10,
		maxScore: 10,
		submitted: true,
		attempts: 1,
		maxAttempts: 2,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440007",
		title: "Max Subarray Sum",
		dateCreated: new Date("2025-05-06T14:00:00Z"),
		dateModified: new Date("2025-05-07T11:15:00Z"),
		deadline: new Date("2025-05-11T23:59:59Z"),
		score: 6,
		maxScore: 10,
		submitted: true,
		attempts: 2,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440008",
		title: "Binary Search",
		dateCreated: new Date("2025-05-07T08:00:00Z"),
		dateModified: new Date("2025-05-07T08:00:00Z"),
		deadline: new Date("2025-05-12T23:59:59Z"),
		score: 0,
		maxScore: 10,
		submitted: false,
		attempts: 0,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440009",
		title: "Climbing Stairs",
		dateCreated: new Date("2025-05-08T10:30:00Z"),
		dateModified: new Date("2025-05-09T10:30:00Z"),
		deadline: new Date("2025-05-13T23:59:59Z"),
		score: 9,
		maxScore: 10,
		submitted: true,
		attempts: 1,
		maxAttempts: 2,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440010",
		title: "Longest Common Prefix",
		dateCreated: new Date("2025-05-09T13:00:00Z"),
		dateModified: new Date("2025-05-10T14:00:00Z"),
		deadline: new Date("2025-05-14T23:59:59Z"),
		score: 5,
		maxScore: 10,
		submitted: true,
		attempts: 3,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440011",
		title: "Linked List Cycle",
		dateCreated: new Date("2025-05-10T15:00:00Z"),
		dateModified: new Date("2025-05-11T16:00:00Z"),
		deadline: new Date("2025-05-15T23:59:59Z"),
		score: 0,
		maxScore: 10,
		submitted: false,
		attempts: 0,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440012",
		title: "Min Stack",
		dateCreated: new Date("2025-05-11T11:45:00Z"),
		dateModified: new Date("2025-05-12T12:45:00Z"),
		deadline: new Date("2025-05-16T23:59:59Z"),
		score: 8,
		maxScore: 10,
		submitted: true,
		attempts: 2,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440013",
		title: "Valid Anagram",
		dateCreated: new Date("2025-05-12T10:15:00Z"),
		dateModified: new Date("2025-05-13T11:00:00Z"),
		deadline: new Date("2025-05-17T23:59:59Z"),
		score: 10,
		maxScore: 10,
		submitted: true,
		attempts: 1,
		maxAttempts: 2,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440014",
		title: "Group Anagrams",
		dateCreated: new Date("2025-05-13T09:30:00Z"),
		dateModified: new Date("2025-05-14T09:30:00Z"),
		deadline: new Date("2025-05-18T23:59:59Z"),
		score: 6,
		maxScore: 10,
		submitted: true,
		attempts: 2,
		maxAttempts: 3,
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440015",
		title: "Top K Frequent Elements",
		dateCreated: new Date("2025-05-14T08:45:00Z"),
		dateModified: new Date("2025-05-15T09:45:00Z"),
		deadline: new Date("2025-05-19T23:59:59Z"),
		score: 0,
		maxScore: 10,
		submitted: false,
		attempts: 0,
		maxAttempts: 3,
	},
];

export const problemColumnsForStudent: ColumnDef<ProblemItemStudent>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
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
						<span>{status?.label}</span>
					</div>
				);
			} else {
				const status = deadlineStatuses.find((statusObj) => statusObj.value === "Due Soon");
				return (
					<div className="flex items-center">
						{status?.icon && <status.icon className="text-muted-foreground mr-2 h-4 w-4" />}
						<span>{status?.label}</span>
					</div>
				);
			}
		},
		filterFn: (row, id, value) => {
			return value === row.getValue(id);
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
		accessorKey: "dateModified",
		header: "Date Modified",
		cell: ({ row }) => {
			const date = row.getValue("dateModified") as Date;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		accessorKey: "submitted",
		header: "Submitted",
		cell: ({ row }) => {
			const submitted = row.getValue("submitted") as boolean;
			return submitted ? "Yes" : "No";
		},
	},
	{
		accessorKey: "score",
		header: "Score",
		cell: ({ row }) => {
			const { score, maxScore, submitted } = row.original as { score: number; maxScore: number; submitted: boolean };
			if (!submitted) {
				return <span className="text-muted-foreground">...</span>;
			}
			return (
				<div className="flex items-center">
					<sup>{score}</sup>&frasl;<sub>{maxScore}</sub>
				</div>
			);
		},
	},
	{
		accessorKey: "attempts",
		header: "Attempts",
		cell: ({ row }) => {
			const { attempts, maxAttempts, submitted } = row.original as {
				attempts: number;
				maxAttempts: number;
				submitted: boolean;
			};
			if (!submitted) {
				return <span className="text-muted-foreground">...</span>;
			}
			return (
				<div className="flex items-center">
					<sup>{attempts}</sup>&frasl;<sub>{maxAttempts}</sub>
				</div>
			);
		},
	},
];
