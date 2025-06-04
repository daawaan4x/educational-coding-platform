/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { AccountItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { addAccountSchema } from "@/lib/validations/addAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnFiltersState } from "@tanstack/react-table";
import { BookOpenText, CirclePlus, DoorClosed, DoorOpen, Search, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useThrottledCallback } from "use-debounce";
import { z } from "zod";
import { rolesInfo } from "../data";
import { accountColumns } from "./accounts-columns";
import { classColumns } from "./classes-columns";

// Add class creation schema
const createClassSchema = z.object({
	name: z.string().min(1, "Class name is required"),
});

export default function AdminDashboardWrapper() {
	const { state, isMobile } = useSidebar();

	// Pagination state
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(50);

	// Selection state
	const [selectedAccounts, setSelectedAccounts] = useState<AccountItem[]>([]);

	useEffect(() => {
		console.log(
			"Selected accounts changed:",
			selectedAccounts.map((acc) => acc.lastName),
		);
	}, [selectedAccounts]);

	const [search, setSearchValue] = useState<string | undefined>(undefined);
	const [role, setRole] = useState<"student" | "teacher" | "admin" | undefined>(undefined);

	const onSearchChange = useThrottledCallback((search: string) => {
		setSearchValue(search);
	}, 500);

	const onFilterChange = useThrottledCallback((filters: ColumnFiltersState) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
		setRole(filters.find((filter) => filter.id == "role")?.value as any);
	}, 500);

	const [isServerProcessing, setIsServerProcessing] = useState(false);

	const [tabValue, setTabValue] = useState("accounts");

	// Add create user mutation
	const createUser = trpc.users.create.useMutation();

	// Add create class mutation and form
	const createClass = trpc.classes.create.useMutation();
	const [isClassFormOpen, setIsClassFormOpen] = useState(false);
	const utils = trpc.useUtils();

	// Add separate pagination and search state for classes
	const [classesPageIndex, setClassesPageIndex] = useState(0);
	const [classesPageSize, setClassesPageSize] = useState(50);
	const [classesSearch, setClassesSearchValue] = useState<string | undefined>(undefined);

	const onClassesSearchChange = useThrottledCallback((search: string) => {
		setClassesSearchValue(search);
		setClassesPageIndex(0); // Reset to first page when searching
	}, 500);

	// Class form definition
	const classForm = useForm<z.infer<typeof createClassSchema>>({
		resolver: zodResolver(createClassSchema),
		defaultValues: {
			name: "",
		},
	});

	function onClassSubmit(values: z.infer<typeof createClassSchema>) {
		toast.loading("Creating class...", { id: "create-class" });

		createClass.mutate(
			{
				data: {
					name: values.name,
				},
			},
			{
				onSuccess: () => {
					toast.success("Class created successfully", { id: "create-class" });
					classForm.reset();
					setIsClassFormOpen(false);
					// Invalidate the classes list cache to show the new class
					void utils.classes.list.invalidate();
				},
				onError: (error) => {
					toast.error("Failed to create class", { id: "create-class" });
					console.error("Error creating class:", error);
				},
			},
		);
	}

	// Use unified list query with optional search parameters
	const listQuery = trpc.users.list.useQuery({
		size: pageSize,
		page: pageIndex + 1,
		search,
		roles: role ? [role] : undefined,
	});

	// Add classes list query
	const classesQuery = trpc.classes.list.useQuery({
		size: classesPageSize,
		page: classesPageIndex + 1,
		search: classesSearch,
	});

	// Use the query result
	const usersData = listQuery.data;
	const classesData = classesQuery.data;
	const isLoading = listQuery.isLoading ?? classesQuery.isLoading;
	const error = listQuery.error ?? classesQuery.error;

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

	// Transform user data to match AccountItem interface
	const accounts: AccountItem[] =
		usersData?.data.map((user) => {
			return {
				id: user.id,
				firstName: user.first_name,
				lastName: user.last_name,
				email: user.email,
				role: user.role,
				dateCreated: user.date_created,
				dateModified: user.date_modified,
			};
		}) ?? [];

	// Transform classes data to match ClassItem interface
	const classes =
		classesData?.data?.map((classItem) => ({
			id: classItem.id,
			name: classItem.name,
			dateCreated: new Date(classItem.date_created),
			dateModified: new Date(classItem.date_modified),
		})) ?? [];

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
			className={cn("align-items mt-3 flex w-full flex-col justify-start overflow-hidden px-8 pb-8", {
				"h-full max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
			})}>
			<Tabs value={tabValue} onValueChange={setTabValue}>
				<TabsList className="mb-2">
					<TabsTrigger value="accounts">
						<Users /> Accounts
					</TabsTrigger>
					<TabsTrigger value="classes">
						<BookOpenText /> Classes
					</TabsTrigger>
				</TabsList>
				<TabsContent value="accounts">
					<div className="flex items-center justify-between gap-3 border-b pb-2">
						<h2>Manage Accounts</h2>

						<div className="flex flex-row flex-wrap justify-end gap-3 md:flex-nowrap">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" disabled={!selectedAccounts.length} className="group">
										<DoorClosed className="group-hover:hidden" />
										<DoorOpen className="hidden group-hover:block" />
										Add to class
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
														<FormLabel className="text-right">Name</FormLabel>
														<FormControl>
															<Input placeholder="Class Name" className="col-span-3" {...field} />
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
					</div>

					<DataTable
						columns={accountColumns}
						data={accounts}
						notVisibleColumns={["dateCreated", "dateModified", "classes"]}
						enablePagination={true}
						manualPagination={true}
						pageCount={pageCount}
						pageIndex={pageIndex}
						pageSize={pageSize}
						defaultPageSize={pageSize}
						manualFiltering={true}
						onSearchChange={onSearchChange}
						onPaginationChange={(newPageIndex: number, newPageSize: number) => {
							setPageIndex(newPageIndex);
							setPageSize(newPageSize);
						}}
						filters={[
							{
								column: "role",
								options: rolesInfo,
							},
						]}
						onFilterChange={onFilterChange}
						filterSearchPlaceholder="Search by name or email..."
						enableSelection={true}
						onSelectionChange={setSelectedAccounts}
					/>
				</TabsContent>
				<TabsContent value="classes">
					<div className="flex items-center justify-between gap-3 border-b pb-2">
						<h2>Manage Classes</h2>

						<Dialog open={isClassFormOpen} onOpenChange={setIsClassFormOpen}>
							<DialogTrigger asChild>
								<Button variant="outline" disabled={createClass.isPending}>
									<CirclePlus /> Add Class
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Add class</DialogTitle>
									<DialogDescription>
										Fill out the details below to add a new class. Click save when you&apos;re done.
									</DialogDescription>
								</DialogHeader>
								<Form {...classForm}>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											void classForm.handleSubmit(onClassSubmit)(e);
										}}
										className="grid gap-4 py-4">
										<FormField
											control={classForm.control}
											name="name"
											render={({ field }) => (
												<FormItem className="grid grid-cols-4 items-center gap-4">
													<FormLabel className="text-right">Class Name</FormLabel>
													<FormControl>
														<Input placeholder="Class Name" className="col-span-3" {...field} />
													</FormControl>
													<FormMessage className="col-span-4 col-start-2" />
												</FormItem>
											)}
										/>
										<DialogFooter>
											<Button type="submit" disabled={createClass.isPending}>
												{createClass.isPending ? "Creating..." : "Create Class"}
											</Button>
										</DialogFooter>
									</form>
								</Form>
							</DialogContent>
						</Dialog>
					</div>

					<DataTable
						columns={classColumns}
						data={classes}
						notVisibleColumns={["dateModified"]}
						enablePagination={true}
						manualPagination={true}
						pageCount={classesData?.meta ? classesData.meta.total_pages : -1}
						pageIndex={classesPageIndex}
						pageSize={classesPageSize}
						defaultPageSize={classesPageSize}
						manualFiltering={false}
						onSearchChange={onClassesSearchChange}
						onPaginationChange={(newPageIndex: number, newPageSize: number) => {
							setClassesPageIndex(newPageIndex);
							setClassesPageSize(newPageSize);
						}}
						filterSearchPlaceholder="Search classes..."
						enableSelection={false}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
