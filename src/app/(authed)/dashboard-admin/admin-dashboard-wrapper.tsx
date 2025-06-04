/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

// We need to use this wrapper because the width of the content must vary
// depending on the sidebar state. We need a client component to use React Context.
import BanterLoad from "@/components/banter-load";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CirclePlus, Search, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { accountColumns } from "./accounts-columns";

const searchSchema = z.object({
	search_key: z.string().optional(),
	search_type: z.enum(["firstName", "lastName", "email"]),
	roles: z.array(z.enum(["student", "teacher", "admin"])).min(1, "At least one role must be selected"),
});

export default function AdminDashboardWrapper() {
	const { state, isMobile } = useSidebar();

	// Pagination state
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(50);

	// Search state
	const [isSearchMode, setIsSearchMode] = useState(false);
	const [searchParams, setSearchParams] = useState<z.infer<typeof searchSchema> | null>(null);

	const [isServerProcessing, setIsServerProcessing] = useState(false);

	// Add create user mutation
	const createUser = trpc.users.create.useMutation();

	// Search form
	const searchForm = useForm<z.infer<typeof searchSchema>>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			search_key: "",
			search_type: "firstName",
			roles: [],
		},
	});

	// Watch form values to determine if clear button should show
	const watchedValues = searchForm.watch();
	const hasFormInputs =
		watchedValues.search_key?.trim() !== "" || (watchedValues.roles && watchedValues.roles.length > 0);

	// Use unified list query with optional search parameters
	const listQuery = trpc.users.list.useQuery({
		size: pageSize,
		page: pageIndex + 1,
		...(isSearchMode &&
			searchParams && {
				search_key: searchParams.search_key,
				search_type: searchParams.search_type,
				roles: searchParams.roles,
			}),
	});

	// Use the query result
	const usersData = listQuery.data;
	const isLoading = listQuery.isLoading;
	const error = listQuery.error;

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
		setIsServerProcessing(true);
		toast.loading("Adding account...", { id: "create-account" });

		createUser.mutate(
			{
				data: {
					email: values.email,
					password: values.password,
					first_name: values.firstName,
					last_name: values.lastName,
					role: values.role,
				},
			},
			{
				onSuccess: () => {
					toast.success("Account added", { id: "create-account" });
					form.reset();
					setIsServerProcessing(false);

					// Refetch the appropriate query to update the table
					listQuery.refetch();
				},
				onError: (error) => {
					toast.error("Failed to add account", { id: "create-account" });
					setIsServerProcessing(false);
					console.error("Error creating user:", error);
				},
			},
		);
	}

	function onSearch(values: z.infer<typeof searchSchema>) {
		setSearchParams(values);
		setIsSearchMode(true);
		setPageIndex(0); // Reset to first page
	}

	function clearSearch() {
		setIsSearchMode(false);
		setSearchParams(null);
		setPageIndex(0);
		searchForm.reset();
	}

	// Handle pagination changes - this now maintains the current search state
	const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
		console.log("Pagination change:", {
			newPageIndex,
			newPageSize,
			currentPageIndex: pageIndex,
			isSearchMode,
			hasSearchParams: !!searchParams,
		});

		// Only update state if values actually changed
		if (newPageIndex !== pageIndex || newPageSize !== pageSize) {
			setPageIndex(newPageIndex);
			setPageSize(newPageSize);
			// Note: We don't change isSearchMode or searchParams here
			// This ensures pagination maintains the current query type
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
		}) ?? [];

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
				"h-full max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
			})}>
			<div className="flex items-center justify-between gap-3 border-b pb-2">
				<h2>Manage Accounts</h2>

				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" disabled={isServerProcessing}>
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
									<Button type="submit" disabled={isServerProcessing}>
										{isServerProcessing ? "Saving..." : "Save changes"}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			<div id="search-users" className="my-4 rounded-lg border p-4">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-medium">Search Users</h3>
					{(isSearchMode || hasFormInputs) && (
						<Button variant="outline" size="sm" onClick={clearSearch}>
							<X className="mr-2 h-4 w-4" />
							Clear Search
						</Button>
					)}
				</div>

				<Form {...searchForm}>
					<form onSubmit={searchForm.handleSubmit(onSearch)} className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<FormField
								control={searchForm.control}
								name="search_key"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Search Term</FormLabel>
										<FormControl>
											<Input placeholder="Enter search term..." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={searchForm.control}
								name="search_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Search By</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select search type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="firstName">First Name</SelectItem>
												<SelectItem value="lastName">Last Name</SelectItem>
												<SelectItem value="email">Email</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-end">
								<Button type="submit" className="w-full">
									<Search className="mr-2 h-4 w-4" />
									Search
								</Button>
							</div>
						</div>

						<FormField
							control={searchForm.control}
							name="roles"
							render={() => (
								<FormItem>
									<FormLabel>Filter by Roles</FormLabel>
									<div className="flex space-x-4">
										{["student", "teacher", "admin"].map((role) => (
											<FormField
												key={role}
												control={searchForm.control}
												name="roles"
												render={({ field }) => {
													return (
														<FormItem key={role} className="flex flex-row items-start space-y-0 space-x-3">
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(role as "student" | "teacher" | "admin")}
																	onCheckedChange={(checked) => {
																		const typedRole = role as "student" | "teacher" | "admin";
																		return checked
																			? field.onChange([...(field.value || []), typedRole])
																			: field.onChange(field.value?.filter((value) => value !== typedRole));
																	}}
																/>
															</FormControl>
															<FormLabel className="text-sm font-normal capitalize">{role}</FormLabel>
														</FormItem>
													);
												}}
											/>
										))}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</div>

			{isLoading ? (
				<div className="flex h-6/10 w-full items-center justify-center">
					<BanterLoad />
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
