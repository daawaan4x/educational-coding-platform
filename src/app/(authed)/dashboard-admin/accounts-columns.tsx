/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { rolesInfo } from "@/app/(authed)/data";
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
import { Badge } from "@/components/ui/badge";
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
import { AccountItem } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define schema for edit form
const editAccountSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
});

export const accountColumns: ColumnDef<AccountItem>[] = [
	{
		accessorKey: "lastName",
		header: "Last Name",
	},
	{
		accessorKey: "firstName",
		header: "First Name",
	},
	{
		accessorKey: "email",
		header: "Email",
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
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const { role } = row.original;
			if (role) {
				return (
					<span className="flex flex-row flex-wrap gap-2">
						<Badge variant="outline" key={role}>
							{(() => {
								const roleInfo = rolesInfo.find((_) => _.value === role);
								const IconComponent = roleInfo?.icon;
								return IconComponent ? <IconComponent className="mr-1 h-4 w-4" /> : null;
							})()}{" "}
							{role && capitalizeFirstLetter(role)}
						</Badge>
					</span>
				);
			} else {
				return "";
			}
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const account = row.original;

			// Add update and delete user mutations
			const updateUser = trpc.users.update.useMutation();
			const deleteUser = trpc.users.delete.useMutation();
			const utils = trpc.useUtils();

			// Add dropdown and dialog state control
			const [dropdownOpen, setDropdownOpen] = useState(false);
			const [editDialogOpen, setEditDialogOpen] = useState(false);

			// Add form hook for edit dialog
			const form = useForm<z.infer<typeof editAccountSchema>>({
				resolver: zodResolver(editAccountSchema),
				defaultValues: {
					firstName: account.firstName,
					lastName: account.lastName,
					email: account.email,
				},
			});

			function onSubmit(values: z.infer<typeof editAccountSchema>) {
				toast.loading("Updating account...", { id: "update-account" });

				updateUser.mutate(
					{
						id: account.id,
						data: {
							first_name: values.firstName,
							last_name: values.lastName,
							email: values.email,
						},
					},
					{
						onSuccess: () => {
							toast.success("Account updated successfully", { id: "update-account" });
							setEditDialogOpen(false);
							setDropdownOpen(false);
							// Refresh the data
							void utils.users.list.invalidate();
						},
						onError: (error) => {
							toast.error("Failed to update account", { id: "update-account" });
							console.error("Error updating user:", error);
						},
					},
				);
			}

			function handleDelete() {
				// Close the dropdown menu immediately when delete starts
				setDropdownOpen(false);

				toast.loading("Deleting account...", { id: "delete-account" });

				deleteUser.mutate(
					{ id: account.id },
					{
						onSuccess: () => {
							toast.success("Account deleted successfully", { id: "delete-account" });
							// Refetch the users list to update the table
							void utils.users.list.invalidate();
						},
						onError: (error) => {
							toast.error("Failed to delete account", { id: "delete-account" });
							console.error("Error deleting user:", error);
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
									<DialogTitle>Edit account</DialogTitle>
									<DialogDescription>
										Make changes to the account here. Click save when you&apos;re done.
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
											name="firstName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>First Name</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Last Name</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<DialogFooter>
											<Button type="submit" disabled={updateUser.isPending}>
												{updateUser.isPending ? "Saving..." : "Save changes"}
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
									<AlertDialogTitle>Are you sure you want to delete this account?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete the account for {account.firstName}{" "}
										{account.lastName} and remove their data from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDelete} disabled={deleteUser.isPending}>
										{deleteUser.isPending ? "Deleting..." : "Delete"}
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
