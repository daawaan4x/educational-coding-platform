"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AccountItem, SolutionItem, SolutionsItem } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	CheckCheck,
	Circle,
	CircleAlert,
	CircleX,
	ClockAlert,
	Hourglass,
	MoreHorizontal,
	Stamp,
	Tag,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Specific student view
export const studentSolutions: SolutionItem[] = [
	{
		id: "b1d2a7c1-45ea-4b8d-9b3c-8f3e3a2b1c01",
		problemId: "f3c1a8d9-5a2e-47c8-93b1-2c62e8d5e872",
		authorId: "a9b2e7f5-c8e3-4ad0-8890-5f7c9e3e71d3",
		dateCreated: new Date("2025-01-10T09:30:00Z"),
		attempt: 1,
		code: "function sum(a, b) { return a + b; }",
		feedback: "Good use of function syntax. Consider edge cases.",
		status: "accepted",
	},
	{
		id: "b1d2a7c1-45ea-4b8d-9b3c-8f3e3a2b1c02",
		problemId: "f3c1a8d9-5a2e-47c8-93b1-2c62e8d5e872",
		authorId: "a9b2e7f5-c8e3-4ad0-8890-5f7c9e3e71d3",
		dateCreated: new Date("2025-01-10T10:15:00Z"),
		attempt: 2,
		code: `function sum(a, b) {
	if (typeof a !== 'number' || typeof b !== 'number') {
		return 0;
	}
	return a + b;
}`,
		feedback: "Great improvement with type checking!",
		status: "accepted",
	},
	{
		id: "e4f2a1b5-8c3d-4e6f-9a7b-2d5c8e1f4a6b",
		problemId: "f3c1a8d9-5a2e-47c8-93b1-2c62e8d5e872",
		authorId: "a9b2e7f5-c8e3-4ad0-8890-5f7c9e3e71d3",
		dateCreated: new Date("2025-01-14T10:30:00Z"),
		attempt: 3,
		code: `function sum(a, b) {
	try {
		throw new Error('Unexpected error');
		return a + b;
	} catch (error) {
		console.error(error);
		return null;
	}
}`,
		feedback: "Runtime error occurred during execution.",
		status: "error",
	},
	{
		id: "c3e5b2d8-9a4f-5e7c-8b6d-1f4a7c2e5b8c",
		problemId: "f3c1a8d9-5a2e-47c8-93b1-2c62e8d5e872",
		authorId: "a9b2e7f5-c8e3-4ad0-8890-5f7c9e3e71d3",
		dateCreated: new Date("2025-01-15T14:20:00Z"),
		attempt: 4,
		code: `function sum(a, b) {
	// This is wrong on purpose
	const result = a - b;
	return result;
}`,
		feedback: "Expected sum but got subtraction. Check your logic.",
		status: "wrong-answer",
	},
	{
		id: "d6f8c3a9-2e5b-6f8d-9c7a-3e6b9d2f8c3e",
		problemId: "f3c1a8d9-5a2e-47c8-93b1-2c62e8d5e872",
		authorId: "a9b2e7f5-c8e3-4ad0-8890-5f7c9e3e71d3",
		dateCreated: new Date("2025-01-16T11:45:00Z"),
		attempt: 5,
		code: `function sum(a, b) {
	while(true) {
		console.log('infinite loop');
		// This will never break
	}
	return a + b;
}`,
		feedback: "Solution exceeded time limit. Avoid infinite loops.",
		status: "timeout",
	},
	{
		id: "f9a2d5e1-7c4b-8f9a-2d5e-6c9b2f5a8d1c",
		problemId: "f3c1a8d9-5a2e-47c8-93b1-2c62e8d5e872",
		authorId: "a9b2e7f5-c8e3-4ad0-8890-5f7c9e3e71d3",
		dateCreated: new Date("2025-01-17T16:00:00Z"),
		attempt: 6,
		code: `function sum(a, b) {
	// Comprehensive solution with validation
	if (a === null || a === undefined || b === null || b === undefined) {
		throw new Error('Parameters cannot be null or undefined');
	}
	
	if (typeof a !== 'number' || typeof b !== 'number') {
		throw new Error('Both parameters must be numbers');
	}
	
	return a + b;
}`,
		feedback: "Solution is being evaluated...",
		status: "pending",
	},
];

// Teacher view of all the students solutions/submission in a class
export const studentsSolutions: SolutionsItem[] = [
	{
		problemId: "f3c1a8d9-5a2e-47c8-93b1-2c62e8d5e872",
		authorId: "a9b2e7f5-c8e3-4ad0-8890-5f7c9e3e71d3",
		authorFirstName: "John",
		authorLastName: "Doe",
		attempts: 3,
		score: 85,
	},
	{
		problemId: "d2b84f13-832f-42fa-912d-3b5096c4b7df",
		authorId: "b42efbf0-2b70-4f93-bc8f-8d2d92f30b99",
		authorFirstName: "Jane",
		authorLastName: "Smith",
		attempts: 3,
		score: 92,
	},
	{
		problemId: "8f4a10e7-5b4c-4c70-a145-3d328f92811e",
		authorId: "ef7a4a25-684f-4de9-89f1-90b2a2a61719",
		authorFirstName: "Michael",
		authorLastName: "Johnson",
		attempts: 1,
		score: 100,
	},
	{
		problemId: "ab1c9fa6-3c44-46d7-a0dc-e90b1d46ff5e",
		authorId: "4ccf720f-1c2d-4a0b-bb92-f64f135e5a02",
		authorFirstName: "Sarah",
		authorLastName: "Williams",
		attempts: 3,
		score: 88,
	},
	{
		problemId: "c03f3b13-8ef5-456d-a8ae-fd1a5b6a2ac7",
		authorId: "d7217b18-3275-4b91-841a-b0df0c214109",
		authorFirstName: "David",
		authorLastName: "Brown",
		attempts: 1,
		score: 95,
	},
	{
		problemId: "e15a8b2c-9d47-4f82-b364-1a7c5e8f9b12",
		authorId: "f8c3d4e1-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
		authorFirstName: "Emily",
		authorLastName: "Davis",
		attempts: 2,
		score: 78,
	},
	{
		problemId: "g26b9c3d-ae58-5093-c475-2b8d6f0a1c23",
		authorId: "h9d4e5f2-6b7c-5d8e-9f0a-1b2c3d4e5f6g",
		authorFirstName: "Robert",
		authorLastName: "Miller",
		attempts: 4,
		score: 82,
	},
	{
		problemId: "i37c0d4e-bf69-61a4-d586-3c9e70b2d34",
		authorId: "j0e5f6g3-7c8d-6e9f-a0b1-2c3d4e5f6g7h",
		authorFirstName: "Lisa",
		authorLastName: "Wilson",
		attempts: 1,
		score: 96,
	},
	{
		problemId: "k48d1e5f-c07a-72b5-e697-4d0f81c3e45",
		authorId: "l1f6g7h4-8d9e-7f0a-b1c2-3d4e5f6g7h8i",
		authorFirstName: "Christopher",
		authorLastName: "Moore",
		attempts: 3,
		score: 90,
	},
	{
		problemId: "m59e2f6g-d18b-83c6-f7a8-5e1092d4f56",
		authorId: "n2g7h8i5-9e0f-80b1-c2d3-4e5f6g7h8i9j",
		authorFirstName: "Amanda",
		authorLastName: "Taylor",
		attempts: 2,
		score: 84,
	},
	{
		problemId: "o60f3g7h-e29c-94d7-g8b9-6f2103e5g67",
		authorId: "p3h8i9j6-a1f2-91c2-d3e4-5f6g7h8i9j0k",
		authorFirstName: "Daniel",
		authorLastName: "Anderson",
		attempts: 5,
		score: 76,
	},
	{
		problemId: "q71g4h8i-f30d-a5e8-h9c0-7g3214f6h78",
		authorId: "r4i9j0k7-b2g3-a2d3-e4f5-6g7h8i9j0k1l",
		authorFirstName: "Jessica",
		authorLastName: "Thomas",
		attempts: 1,
		score: 98,
	},
	{
		problemId: "s82h5i9j-g41e-b6f9-i0d1-8h4325g7i89",
		authorId: "t5j0k1l8-c3h4-b3e4-f5g6-7h8i9j0k1l2m",
		authorFirstName: "Matthew",
		authorLastName: "Jackson",
		attempts: 3,
		score: 87,
	},
	{
		problemId: "u93i6j0k-h52f-c7g0-j1e2-9i5436h8j90",
		authorId: "v6k1l2m9-d4i5-c4f5-g6h7-8i9j0k1l2m3n",
		authorFirstName: "Ashley",
		authorLastName: "White",
		attempts: 2,
		score: 91,
	},
	{
		problemId: "w04j7k1l-i63g-d8h1-k2f3-0j6547i9k01",
		authorId: "x7l2m3n0-e5j6-d5g6-h7i8-9j0k1l2m3n4o",
		authorFirstName: "Joshua",
		authorLastName: "Harris",
		attempts: 4,
		score: 79,
	},
	{
		problemId: "y15k8l2m-j74h-e9i2-l3g4-1k7658j0l12",
		authorId: "z8m3n4o1-f6k7-e6h7-i8j9-0k1l2m3n4o5p",
		authorFirstName: "Megan",
		authorLastName: "Martin",
		attempts: 1,
		score: 93,
	},
	{
		problemId: "a26l9m3n-k85i-f0j3-m4h5-2l8769k1m23",
		authorId: "b9n4o5p2-g7l8-f7i8-j9k0-1l2m3n4o5p6q",
		authorFirstName: "Andrew",
		authorLastName: "Thompson",
		attempts: 3,
		score: 86,
	},
	{
		problemId: "c37m0n4o-l96j-g1k4-n5i6-3m980l2n34",
		authorId: "d0o5p6q3-h8m9-g8j9-k0l1-2m3n4o5p6q7r",
		authorFirstName: "Samantha",
		authorLastName: "Garcia",
		attempts: 2,
		score: 89,
	},
	{
		problemId: "e48n1o5p-ma7k-h2l5-o6j7-4n091m3o45",
		authorId: "f1p6q7r4-i9n0-h9k0-l1m2-3n4o5p6q7r8s",
		authorFirstName: "Ryan",
		authorLastName: "Martinez",
		attempts: 5,
		score: 74,
	},
	{
		problemId: "g59o2p6q-nb8l-i3m6-p7k8-5o102n4p56",
		authorId: "h2q7r8s5-j0o1-i0l1-m2n3-4o5p6q7r8s9t",
		authorFirstName: "Nicole",
		authorLastName: "Robinson",
		attempts: 1,
		score: 97,
	},
	{
		problemId: "i60p3q7r-oc9m-j4n7-q8l9-6p213o5q67",
		authorId: "j3r8s9t6-k1p2-j1m2-n3o4-5p6q7r8s9t0u",
		authorFirstName: "Kevin",
		authorLastName: "Clark",
		attempts: 3,
		score: 83,
	},
	{
		problemId: "k71q4r8s-pd0n-k5o8-r9m0-7q324p6r78",
		authorId: "l4s9t0u7-l2q3-k2n3-o4p5-6q7r8s9t0u1v",
		authorFirstName: "Rachel",
		authorLastName: "Rodriguez",
		attempts: 2,
		score: 92,
	},
	{
		problemId: "m82r5s9t-qe1o-l6p9-s0n1-8r435q7s89",
		authorId: "n5t0u1v8-m3r4-l3o4-p5q6-7r8s9t0u1v2w",
		authorFirstName: "Brandon",
		authorLastName: "Lewis",
		attempts: 4,
		score: 80,
	},
	{
		problemId: "o93s6t0u-rf2p-m7q0-t1o2-9s546r8t90",
		authorId: "p6u1v2w9-n4s5-m4p5-q6r7-8s9t0u1v2w3x",
		authorFirstName: "Lauren",
		authorLastName: "Lee",
		attempts: 1,
		score: 94,
	},
	{
		problemId: "q04t7u1v-sg3q-n8r1-u2p3-0t657s9u01",
		authorId: "r7v2w3x0-o5t6-n5q6-r7s8-9t0u1v2w3x4y",
		authorFirstName: "Tyler",
		authorLastName: "Walker",
		attempts: 3,
		score: 88,
	},
	{
		problemId: "s15u8v2w-th4r-o9s2-v3q4-1u768t0v12",
		authorId: "t8w3x4y1-p6u7-o6r7-s8t9-0u1v2w3x4y5z",
		authorFirstName: "Stephanie",
		authorLastName: "Hall",
		attempts: 2,
		score: 85,
	},
	{
		problemId: "u26v9w3x-ui5s-p0t3-w4r5-2v879u1w23",
		authorId: "v9x4y5z2-q7v8-p7s8-t9u0-1v2w3x4y5z6a",
		authorFirstName: "Jonathan",
		authorLastName: "Allen",
		attempts: 5,
		score: 77,
	},
	{
		problemId: "w37w0x4y-vj6t-q1u4-x5s6-3w980v2x34",
		authorId: "x0y5z6a3-r8w9-q8t9-u0v1-2w3x4y5z6a7b",
		authorFirstName: "Kimberly",
		authorLastName: "Young",
		attempts: 1,
		score: 99,
	},
	{
		problemId: "y48x1y5z-wk7u-r2v5-y6t7-4x091w3y45",
		authorId: "y1z6a7b4-s9x0-r9u0-v1w2-3x4y5z6a7b8c",
		authorFirstName: "Eric",
		authorLastName: "Hernandez",
		attempts: 3,
		score: 81,
	},
	{
		problemId: "a59y2z6a-xl8v-s3w6-z7u8-5y102x4z56",
		authorId: "z2a7b8c5-t0y1-s0v1-w2x3-4y5z6a7b8c9d",
		authorFirstName: "Michelle",
		authorLastName: "King",
		attempts: 2,
		score: 90,
	},
];

// For teacher view of solutions
export const studentsSolutionsColumns: ColumnDef<SolutionsItem>[] = [
	{
		accessorKey: "authorLastName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
	},
	{
		accessorKey: "authorFirstName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
	},
	{
		accessorKey: "attempts",
		header: "Attempts",
	},
	{
		accessorKey: "score",
		header: "Score",
	},
];

// For teacher view of one student's solutions
export const studentSolutionsColumns: ColumnDef<SolutionItem>[] = [
	{
		accessorKey: "attempt",
		header: "",
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
		cell: ({ row }) => {
			const { status } = row.original;
			if (status === "accepted") {
				return (
					<Badge variant="default">
						<CheckCheck /> Accepted
					</Badge>
				);
			} else if (status === "wrong-answer") {
				return (
					<Badge variant="destructive">
						<CircleX /> Wrong Answer
					</Badge>
				);
			} else if (status === "error") {
				return (
					<Badge variant="destructive">
						<CircleAlert /> Error
					</Badge>
				);
			} else if (status === "timeout") {
				return (
					<Badge variant="destructive">
						<ClockAlert /> Timeout
					</Badge>
				);
			} else if (status === "pending") {
				return (
					<Badge variant="outline">
						<Hourglass /> Pending
					</Badge>
				);
			} else {
				return <Badge variant="destructive">Unknown</Badge>;
			}
		},
	},
	{
		accessorKey: "dateCreated",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date Submitted" />,
		cell: ({ row }) => {
			const { dateCreated: date } = row.original;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const { status, feedback } = row.original;

			const [feedbackValue, setFeedbackValue] = useState(feedback || "");

			const onSubmit = () => {
				// TODO: Implement feedback submission
				console.log("Submitting feedback:", feedbackValue);
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<Dialog>
							<DialogTrigger asChild>
								<DropdownMenuItem onSelect={(event) => event.preventDefault()}>Feedback</DropdownMenuItem>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Give feedback</DialogTitle>
									<DialogDescription>Provide feedback on this student&apos;s solution submission.</DialogDescription>
								</DialogHeader>
								<div className="space-y-2">
									<Textarea
										id="feedback-input"
										placeholder="Enter feedback for the solution of the student..."
										value={feedbackValue}
										onChange={(e) => setFeedbackValue(e.target.value)}
										rows={4}
									/>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button type="submit" onClick={onSubmit}>
										Save
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						{!(status == "error" || status == "timeout") && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuLabel className="font-semibold">Marking</DropdownMenuLabel>
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<CheckCheck /> Accepted
									</DropdownMenuItem>
									<DropdownMenuItem>
										<CircleX /> Wrong Answer
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

// For student view of his/her solutions
export const studentOwnSolutionsColumns: ColumnDef<SolutionItem>[] = [
	{
		accessorKey: "attempt",
		header: "",
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
		cell: ({ row }) => {
			const { status } = row.original;
			if (status === "accepted") {
				return (
					<Badge variant="default">
						<CheckCheck /> Accepted
					</Badge>
				);
			} else if (status === "wrong-answer") {
				return (
					<Badge variant="destructive">
						<CircleX /> Wrong Answer
					</Badge>
				);
			} else if (status === "error") {
				return (
					<Badge variant="destructive">
						<CircleAlert /> Error
					</Badge>
				);
			} else if (status === "timeout") {
				return (
					<Badge variant="destructive">
						<ClockAlert /> Timeout
					</Badge>
				);
			} else if (status === "pending") {
				return (
					<Badge variant="outline">
						<Hourglass /> Pending
					</Badge>
				);
			} else {
				return <Badge variant="destructive">Unknown</Badge>;
			}
		},
	},
	{
		accessorKey: "dateCreated",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date Submitted" />,
		cell: ({ row }) => {
			const { dateCreated: date } = row.original;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		id: "feedback",
		header: "Feedback",
		cell: ({ row }) => {
			const { feedback } = row.original;

			if (!feedback) {
				return <span className="text-muted-foreground">No feedback provided</span>;
			}

			const maxChars = 27;

			const truncated = feedback.length > maxChars ? feedback.slice(0, maxChars) + "..." : feedback;

			return <div className="">{truncated}</div>;
		},
	},
];
