"use client";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";
import { AccountItem } from "@/lib/types";
import { ColumnFiltersState } from "@tanstack/react-table";
import { ChevronLeft, CircleMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useThrottledCallback } from "use-debounce";
import { rolesInfo } from "../data";
import { accountColumns } from "./accounts-columns";

interface ClassStudentsManagerProps {
	classId: string;
	className: string;
	onBack: () => void;
}

export function ClassStudentsManager({ classId, className, onBack }: ClassStudentsManagerProps) {
	const [selectedUsers, setSelectedUsers] = useState<AccountItem[]>([]);

	// Pagination state
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(50);

	// Filter state
	const [search, setSearchValue] = useState<string | undefined>(undefined);
	const [role, setRole] = useState<"student" | "teacher" | "admin" | undefined>(undefined);

	// Dialog state
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

	const onSearchChange = useThrottledCallback((search: string) => {
		setSearchValue(search);
		setPageIndex(0);
	}, 500);

	const onFilterChange = useThrottledCallback((filters: ColumnFiltersState) => {
		setRole(filters.find((filter) => filter.id == "role")?.value as "student" | "teacher" | "admin" | undefined);
		setPageIndex(0);
	}, 500);

	// Query for users in this class
	const usersQuery = trpc.users.list.useQuery({
		size: pageSize,
		page: pageIndex + 1,
		class_id: classId,
		search,
		roles: role ? [role] : undefined,
	});

	// Remove users from class mutation
	const removeUsersFromClass = trpc.classes.remove_users.useMutation();

	// Add utils for cache invalidation
	const utils = trpc.useUtils();

	// Transform user data to match AccountItem interface
	const accounts: AccountItem[] =
		usersQuery.data?.data.map((user) => ({
			id: user.id,
			firstName: user.first_name,
			lastName: user.last_name,
			email: user.email,
			role: user.role,
			dateCreated: user.date_created,
			dateModified: user.date_modified,
		})) ?? [];

	const pageCount = usersQuery.data?.meta ? usersQuery.data.meta.total_pages : -1;

	const handleRemoveUsers = () => {
		if (selectedUsers.length === 0) return;

		toast.loading("Removing users from class...", { id: "remove-from-class" });

		removeUsersFromClass.mutate(
			{
				id: classId,
				user_ids: selectedUsers.map((user) => user.id),
			},
			{
				onSuccess: (result) => {
					let message = `Successfully removed ${result.removed} user${result.removed !== 1 ? "s" : ""} from class`;

					if (result.not_in_class > 0) {
						message += ` (${result.not_in_class} were not in class)`;
					}

					toast.success(message, { id: "remove-from-class" });
					setIsRemoveDialogOpen(false);
					setSelectedUsers([]);
					// Invalidate and refetch related queries
					void utils.users.list.invalidate();
					void utils.classes.list.invalidate();
				},
				onError: (error) => {
					toast.error(`Failed to remove users from class: ${error.message}`, {
						id: "remove-from-class",
					});
				},
			},
		);
	};

	if (usersQuery.error) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-red-500">Error loading users: {usersQuery.error.message}</p>
			</div>
		);
	}

	return (
		<>
			<div className="flex items-center justify-between gap-3 border-b pb-2">
				<div className="flex flex-row items-center gap-3">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="secondary" className="w-fit" onClick={onBack}>
								<ChevronLeft />
								<span className="sr-only">Go back to class list</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Go back</p>
						</TooltipContent>
					</Tooltip>
					<h2>Manage Class {className}</h2>
				</div>

				<Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" disabled={selectedUsers.length === 0}>
							<CircleMinus /> Remove From Class
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[500px]">
						<DialogHeader>
							<DialogTitle>Remove users from class</DialogTitle>
							<DialogDescription>
								Are you sure you want to remove the following {selectedUsers.length} user
								{selectedUsers.length !== 1 ? "s" : ""} from {className}?
							</DialogDescription>
							<div className="mt-2 max-h-48 overflow-y-auto rounded-md border px-3 pt-2 pb-3">
								<span className="mb-1 text-sm leading-none font-bold">Users to remove</span>
								<div className="mt-1 flex flex-col gap-2">
									{selectedUsers.map((user) => (
										<div key={user.id} className="text-muted-foreground text-sm leading-none">
											{user.lastName}, {user.firstName} ({user.email}) -{" "}
											{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown"}
										</div>
									))}
								</div>
							</div>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
								Cancel
							</Button>
							<Button variant="destructive" disabled={removeUsersFromClass.isPending} onClick={handleRemoveUsers}>
								{removeUsersFromClass.isPending ? "Removing..." : "Remove from class"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
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
				onSelectionChange={setSelectedUsers}
				isLoading={usersQuery.isLoading}
			/>
		</>
	);
}
