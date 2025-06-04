/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// We need to use this wrapper because the width of the content must vary
// depending on the sidebar state. We need a client component to use React Context.
import { DataTable } from "@/components/data-table";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import { trpc } from "@/lib/trpc";
import { AccountItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { addAccountSchema } from "@/lib/validations/addAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { accountColumns } from "./accounts-columns";

export default function AdminDashboardWrapper() {
	const { state, isMobile } = useSidebar();

	// Pagination state
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(50);

	// Fetch users list using tRPC with pagination
	const {
		data: usersData,
		isLoading,
		error,
	} = trpc.users.list.useQuery({
		size: pageSize,
		page: pageIndex + 1, // tRPC uses 1-based indexing
	});

	// Form definition with react-hook-form
	const form = useForm<z.infer<typeof addAccountSchema>>({
		resolver: zodResolver(addAccountSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			role: "student",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof addAccountSchema>) {
		// This will be implemented later
		console.log(values);
	}

	// Handle pagination changes
	const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
		console.log("Pagination change:", { newPageIndex, newPageSize, currentPageIndex: pageIndex });

		// Only update state if values actually changed
		if (newPageIndex !== pageIndex || newPageSize !== pageSize) {
			setPageIndex(newPageIndex);
			setPageSize(newPageSize);
		}
	};

	// Transform user data to match AccountItem interface
	const accounts: AccountItem[] =
		usersData?.data.map((user) => {
			return {
				id: user.id,
				firstName: user.first_name,
				lastName: user.last_name,
				email: user.email,
				roles: [user.role],
				dateCreated: user.date_created,
				dateModified: user.date_modified,
			};
		}) || [];

	// Calculate total page count from pagination meta
	const pageCount = usersData?.meta ? usersData.meta.total_pages : -1;

	console.log("Current pagination state:", { pageIndex, pageSize, pageCount, hasData: !!usersData });

	if (error) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-red-500">Error loading users: {error.message}</p>
			</div>
		);
	}

	return (
		<div
			className={cn("align-items mt-3 flex w-full flex-col justify-center overflow-hidden px-8 pb-8", {
				"max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
			})}>
			<div className="flex items-center justify-between gap-3 border-b pb-2">
				<h2>Manage Accounts</h2>

				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">
							<CirclePlus /> Add Account
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Add account</DialogTitle>
							<DialogDescription>
								Fill out the details below to add a new account. Click save when you&apos;re done.
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={(e) => {
									form.handleSubmit(onSubmit)(e);
								}}
								className="grid gap-4 py-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem className="grid grid-cols-4 items-center gap-4">
											<FormLabel className="text-right">First Name</FormLabel>
											<FormControl>
												<Input placeholder="First Name" className="col-span-3" {...field} />
											</FormControl>
											<FormMessage className="col-span-4 col-start-2" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem className="grid grid-cols-4 items-center gap-4">
											<FormLabel className="text-right">Last Name</FormLabel>
											<FormControl>
												<Input placeholder="Last Name" className="col-span-3" {...field} />
											</FormControl>
											<FormMessage className="col-span-4 col-start-2" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem className="grid grid-cols-4 items-center gap-4">
											<FormLabel className="text-right">Role</FormLabel>
											<div className="col-span-3">
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select a role" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="student">Student</SelectItem>
														<SelectItem value="admin">Admin</SelectItem>
														<SelectItem value="teacher">Teacher</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<FormMessage className="col-span-4 col-start-2" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem className="grid grid-cols-4 items-center gap-4">
											<FormLabel className="text-right">Email</FormLabel>
											<FormControl>
												<Input placeholder="Email" className="col-span-3" {...field} />
											</FormControl>
											<FormMessage className="col-span-4 col-start-2" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem className="grid grid-cols-4 items-center gap-4">
											<FormLabel className="text-right">Password</FormLabel>
											<FormControl>
												<Input type="password" placeholder="Password" className="col-span-3" {...field} />
											</FormControl>
											<FormMessage className="col-span-4 col-start-2" />
										</FormItem>
									)}
								/>
								<DialogFooter>
									<Button type="submit">Save changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			{isLoading ? (
				<div className="flex h-64 items-center justify-center">
					<p>Loading users...</p>
				</div>
			) : (
				<DataTable
					columns={accountColumns}
					data={accounts}
					filterColumn="lastName"
					notVisibleColumns={["dateCreated", "dateModified", "classes"]}
					enablePagination={true}
					manualPagination={true}
					pageCount={pageCount}
					pageIndex={pageIndex}
					pageSize={pageSize}
					onPaginationChange={handlePaginationChange}
					defaultPageSize={pageSize}
				/>
			)}
		</div>
	);
}
