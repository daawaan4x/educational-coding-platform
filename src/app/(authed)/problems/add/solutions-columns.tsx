/* eslint-disable @typescript-eslint/no-unused-vars */
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
	// {
	// 	accessorKey: "attempts",
	// 	header: "Attempts",
	// },
	{
		accessorKey: "score",
		header: "Score",
	},
];

// For teacher view of one student's solutions
export const studentSolutionsColumns: ColumnDef<SolutionItem>[] = [
	// {
	// 	accessorKey: "attempt",
	// 	header: "",
	// },
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
			const { status } = row.original;

			// const [feedbackValue, setFeedbackValue] = useState(feedback ?? "");

			// const onSubmit = () => {
			// 	// TODO: Implement feedback submission
			// 	console.log("Submitting feedback:", feedbackValue);
			// };

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{/* <Dialog>
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
						</Dialog> */}
						{!(status == "error" || status == "timeout") && (
							<>
								<DropdownMenuLabel className="font-semibold">Mark</DropdownMenuLabel>
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
	// {
	// 	accessorKey: "attempt",
	// 	header: "",
	// },
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
	// {
	// 	id: "feedback",
	// 	header: "Feedback",
	// 	cell: ({ row }) => {
	// 		const { feedback } = row.original;

	// 		if (!feedback) {
	// 			return <span className="text-muted-foreground">No feedback provided</span>;
	// 		}

	// 		const maxChars = 27;

	// 		const truncated = feedback.length > maxChars ? feedback.slice(0, maxChars) + "..." : feedback;

	// 		return <div className="">{truncated}</div>;
	// 	},
	// },
];
