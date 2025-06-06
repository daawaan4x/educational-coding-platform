/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ClassItem } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Dummy data. To be replace by real values from the server.
export const classes: ClassItem[] = [
	{
		id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
		name: "Javascript Basics",
		dateCreated: new Date("2025-01-10T08:00:00Z"),
		dateModified: new Date("2025-02-01T10:00:00Z"),
	},
	{
		id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
		name: "Data Structures & Algorithms",
		dateCreated: new Date("2025-01-15T09:30:00Z"),
		dateModified: new Date("2025-02-05T11:00:00Z"),
	},
	{
		id: "c3d4e5f6-g7h8-9012-cdef-345678901234",
		name: "Web Development Fundamentals",
		dateCreated: new Date("2025-02-01T14:00:00Z"),
		dateModified: new Date("2025-02-20T09:45:00Z"),
	},
	{
		id: "d4e5f6g7-h8i9-0123-defa-456789012345",
		name: "Object-Oriented Programming",
		dateCreated: new Date("2025-03-10T07:45:00Z"),
		dateModified: new Date("2025-03-25T08:30:00Z"),
	},
	{
		id: "e5f6g7h8-i9j0-1234-efab-567890123456",
		name: "Database Systems",
		dateCreated: new Date("2025-03-20T13:15:00Z"),
		dateModified: new Date("2025-04-10T15:00:00Z"),
	},
];

const editClassSchema = z.object({
	name: z.string().min(1, "Class name is required"),
});

export const classColumns: ColumnDef<ClassItem>[] = [
	{
		accessorKey: "name",
		header: "Name",
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
		accessorKey: "dateModified",
		header: "Date Modified",
		cell: ({ row }) => {
			const { dateModified: date } = row.original;
			return format(date, "MMM d, yyyy h:mm a");
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const classItem = row.original;
			const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
			const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
			const [isDropdownOpen, setIsDropdownOpen] = useState(false);

			const utils = trpc.useUtils();

			const updateClassMutation = trpc.classes.update.useMutation({
				onSuccess: () => {
					toast.success("Class updated successfully");
					setIsEditDialogOpen(false);
					setIsDropdownOpen(false);
					utils.classes.list_by_user.invalidate();
				},
				onError: (error) => {
					toast.error(`Failed to update class: ${error.message}`);
				},
			});

			const deleteClassMutation = trpc.classes.remove.useMutation({
				onSuccess: () => {
					toast.success("Class deleted successfully");
					setIsDeleteDialogOpen(false);
					setIsDropdownOpen(false);
					utils.classes.list_by_user.invalidate();
				},
				onError: (error) => {
					toast.error(`Failed to delete class: ${error.message}`);
				},
			});

			const form = useForm<z.infer<typeof editClassSchema>>({
				resolver: zodResolver(editClassSchema),
				defaultValues: { name: classItem.name },
			});

			function onSubmit(values: z.infer<typeof editClassSchema>) {
				updateClassMutation.mutate({
					id: classItem.id,
					data: { name: values.name },
				});
			}

			function handleDelete() {
				deleteClassMutation.mutate({ id: classItem.id });
			}

			return (
				<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
							<DialogTrigger asChild>
								<DropdownMenuItem onSelect={(event) => event.preventDefault()}>Edit</DropdownMenuItem>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Edit class</DialogTitle>
									<DialogDescription>
										Make changes to this class here. Click save when you&apos;re done.
									</DialogDescription>
								</DialogHeader>
								<Form {...form}>
									<form
										onSubmit={(e) => {
											form.handleSubmit(onSubmit)(e);
										}}
										className="space-y-4 pt-4">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Class Name</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<DialogFooter>
											<Button type="submit" disabled={updateClassMutation.isPending}>
												{updateClassMutation.isPending ? "Saving..." : "Save"}
											</Button>
										</DialogFooter>
									</form>
								</Form>
							</DialogContent>
						</Dialog>
						<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem variant="destructive" onSelect={(event) => event.preventDefault()}>
									Delete
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure you want to delete this class?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete this class, all problems in this class,
										and all associated information.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDelete} disabled={deleteClassMutation.isPending}>
										{deleteClassMutation.isPending ? "Deleting..." : "Delete"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
