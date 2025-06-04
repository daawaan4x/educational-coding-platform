/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

// Define schema for edit form
const editClassSchema = z.object({
	name: z.string().min(1, "Class name is required"),
});

export const classColumns: ColumnDef<ClassItem>[] = [
	{
		accessorKey: "name",
		header: "Class Name",
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

			// Add update and delete class mutations
			const updateClass = trpc.classes.update.useMutation();
			const deleteClass = trpc.classes.remove.useMutation();
			const utils = trpc.useUtils();

			// Add dropdown and dialog state control
			const [dropdownOpen, setDropdownOpen] = useState(false);
			const [editDialogOpen, setEditDialogOpen] = useState(false);

			// Add form hook for edit dialog
			const form = useForm<z.infer<typeof editClassSchema>>({
				resolver: zodResolver(editClassSchema),
				defaultValues: {
					name: classItem.name,
				},
			});

			function onSubmit(values: z.infer<typeof editClassSchema>) {
				toast.loading("Updating class...", { id: "update-class" });

				updateClass.mutate(
					{
						id: classItem.id,
						data: {
							name: values.name,
						},
					},
					{
						onSuccess: () => {
							toast.success("Class updated successfully", { id: "update-class" });
							setEditDialogOpen(false);
							setDropdownOpen(false);
							// Refresh the data
							void utils.classes.list.invalidate();
						},
						onError: (error) => {
							toast.error("Failed to update class", { id: "update-class" });
							console.error("Error updating class:", error);
						},
					},
				);
			}

			function handleDelete() {
				// Close the dropdown menu immediately when delete starts
				setDropdownOpen(false);

				toast.loading("Deleting class...", { id: "delete-class" });

				deleteClass.mutate(
					{ id: classItem.id },
					{
						onSuccess: () => {
							toast.success("Class deleted successfully", { id: "delete-class" });
							// Refetch the classes list to update the table
							void utils.classes.list.invalidate();
						},
						onError: (error) => {
							toast.error("Failed to delete class", { id: "delete-class" });
							console.error("Error deleting class:", error);
						},
					},
				);
			}

			return (
				<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
							<DialogTrigger asChild>
								<DropdownMenuItem onSelect={(event) => event.preventDefault()}>Edit</DropdownMenuItem>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Edit class</DialogTitle>
									<DialogDescription>
										Make changes to the class here. Click save when you&apos;re done.
									</DialogDescription>
								</DialogHeader>
								<Form {...form}>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											void form.handleSubmit(onSubmit)(e);
										}}
										className="grid gap-4 py-4">
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
											<Button type="submit" disabled={updateClass.isPending}>
												{updateClass.isPending ? "Saving..." : "Save changes"}
											</Button>
										</DialogFooter>
									</form>
								</Form>
							</DialogContent>
						</Dialog>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem variant="destructive" onSelect={(event) => event.preventDefault()}>
									Delete
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure you want to delete this class?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete the class "{classItem.name}" and remove
										it from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDelete} disabled={deleteClass.isPending}>
										{deleteClass.isPending ? "Deleting..." : "Delete"}
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
