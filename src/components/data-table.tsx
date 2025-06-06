"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { camelToCapitalizedWords, camelToWords, cn, listToFalseObject } from "@/lib/utils";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	TableOptions,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { X } from "lucide-react";
import { ComponentType, useState } from "react";
import BanterLoad from "./banter-load";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTablePagination } from "./data-table-pagination";

export interface FilterOptionItem {
	readonly value: string;
	readonly label: string;
	readonly icon?: ComponentType<{ className?: string | undefined }>;
}

export interface Filter {
	column: string;
	options: readonly FilterOptionItem[];
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterColumn?: string;
	notVisibleColumns?: string[];
	filters?: Filter[];
	enablePagination?: boolean;
	defaultPageSize?: number;
	onRowClick?: (row: TData) => void;
	showRowDialog?: boolean;
	dialogContent?: (row: TData) => React.ReactNode;
	showColumnViewControl?: boolean;
	// Server-side pagination props
	manualPagination?: boolean;
	pageCount?: number;
	onPaginationChange?: (pageIndex: number, pageSize: number) => void;
	// Add these props for controlled pagination
	pageIndex?: number;
	pageSize?: number;
	manualFiltering?: boolean;
	onFilterChange?: (filters: ColumnFiltersState) => void;
	onSearchChange?: (search: string) => void;
	filterSearchPlaceholder?: string;
	enableSelection?: boolean;
	singleSelection?: boolean; // Add single selection mode
	onSelectionChange?: (selectedRows: TData[]) => void;
	className?: string;
	isLoading?: boolean;
}

// `filterColumn` is for filtering a specific column with a text input.
// `filters` is for filtering multiple columns with predefined options.

export function DataTable<TData, TValue>({
	columns,
	data,
	filterColumn,
	notVisibleColumns = [],
	filters,
	enablePagination = true,
	defaultPageSize,
	onRowClick,
	showRowDialog = false,
	dialogContent,
	showColumnViewControl = true,
	manualPagination = false,
	pageCount,
	onPaginationChange,
	pageIndex: controlledPageIndex,
	pageSize: controlledPageSize,
	manualFiltering = false,
	onFilterChange,
	onSearchChange,
	filterSearchPlaceholder = "Search...",
	enableSelection = false,
	singleSelection = false,
	onSelectionChange,
	className = "",
	isLoading = false,
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(listToFalseObject(notVisibleColumns));
	const [selectedRow, setSelectedRow] = useState<TData | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowSelection, setRowSelection] = useState({});

	// Use controlled pagination state when manual pagination is enabled
	const pagination = manualPagination
		? {
				pageIndex: controlledPageIndex ?? 0,
				pageSize: controlledPageSize ?? defaultPageSize ?? 10,
			}
		: {
				pageIndex: 0,
				pageSize: defaultPageSize ?? 10,
			};

	const handleRowClick = (row: TData) => {
		if (showRowDialog) {
			setSelectedRow(row);
			setIsDialogOpen(true);
		}
		onRowClick?.(row);
	};

	const reactTableOptions: TableOptions<TData> = {
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: (newRowSelection) => {
			let updatedSelection = typeof newRowSelection === "function" ? newRowSelection(rowSelection) : newRowSelection;

			if (singleSelection) {
				// For single selection, only keep the last selected row
				const selectedKeys = Object.keys(updatedSelection).filter((key) => updatedSelection[key]);
				if (selectedKeys.length > 0) {
					// Clear all selections and only keep the last one
					const lastSelectedKey = selectedKeys[selectedKeys.length - 1];
					updatedSelection = { [lastSelectedKey]: true };
				}
			}

			setRowSelection(updatedSelection);

			if (enableSelection && onSelectionChange) {
				// Get selected rows using the updated selection
				const selectedRowIndices = Object.keys(updatedSelection).filter((key) => updatedSelection[key]);
				const selectedRows = selectedRowIndices.map((index) => data[parseInt(index)]);
				onSelectionChange(selectedRows);
			}
		},
		state: {
			columnFilters,
			columnVisibility,
			pagination,
			rowSelection: enableSelection ? rowSelection : {},
		},
		...(enablePagination && !manualPagination && { getPaginationRowModel: getPaginationRowModel() }),
		...(manualPagination && {
			manualPagination: true,
			pageCount: pageCount ?? -1,
			onPaginationChange: (
				updater:
					| ((old: { pageIndex: number; pageSize: number }) => { pageIndex: number; pageSize: number })
					| { pageIndex: number; pageSize: number },
			) => {
				const currentPagination = pagination;
				const newPagination = typeof updater === "function" ? updater(currentPagination) : updater;
				onPaginationChange?.(newPagination.pageIndex, newPagination.pageSize);
			},
		}),
		...(manualFiltering
			? {
					manualFiltering: true,
					onColumnFiltersChange: (updater) => {
						const filters = typeof updater == "function" ? updater(columnFilters) : updater;
						setColumnFilters(filters);
						onFilterChange?.(filters);
					},
				}
			: {
					onColumnFiltersChange: setColumnFilters,
					getFilteredRowModel: getFilteredRowModel(),
				}),
	};

	const table = useReactTable(reactTableOptions);

	const isFiltered = table.getState().columnFilters.length > 0;
	const { state, isMobile } = useSidebar();

	return (
		<div className={`max-w-full overflow-auto ${className}`}>
			{
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
				(filterColumn || filters || showColumnViewControl || onSearchChange) && (
					<div className="flex items-center justify-between gap-3 py-4">
						<div className="flex flex-1 flex-row flex-wrap items-center gap-2">
							{filterColumn ? (
								<Input
									placeholder={`Filter ${camelToWords(filterColumn)}s...`}
									value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
									onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
									className="max-w-sm"
								/>
							) : (
								""
							)}

							{onSearchChange ? (
								<Input
									placeholder={filterSearchPlaceholder}
									onChange={(event) => onSearchChange(event.target.value)}
									className="max-w-sm"
								/>
							) : (
								""
							)}

							{filters ? (
								<div
									className={cn("flex flex-1 flex-row flex-wrap items-center gap-2 sm:flex-nowrap", {
										"sm:flex-wrap md:flex-nowrap": state == "expanded" && !isMobile,
										"block sm:flex-wrap md:flex-nowrap": state != "expanded" && !isMobile,
										"sm:flex-wrap md:flex-wrap lg:flex-nowrap": state == "expanded" && !isMobile && isFiltered,
									})}>
									{filters.map((filter) => {
										return (
											<DataTableFacetedFilter
												key={filter.column}
												column={table.getColumn(filter.column)}
												title={camelToCapitalizedWords(filter.column)}
												options={filter.options as unknown as FilterOptionItem[]}
											/>
										);
									})}
									{isFiltered && (
										<Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
											Reset
											<X />
										</Button>
									)}
								</div>
							) : (
								""
							)}
						</div>

						<div className="flex justify-end">
							{showColumnViewControl && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" className="ml-auto">
											Columns
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{table
											.getAllColumns()
											.filter((column) => column.getCanHide())
											.map((column) => {
												return (
													<DropdownMenuCheckboxItem
														key={column.id}
														className="capitalize"
														checked={column.getIsVisible()}
														onCheckedChange={(value) => column.toggleVisibility(!!value)}>
														{camelToCapitalizedWords(column.id)}
													</DropdownMenuCheckboxItem>
												);
											})}
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>
				)
			}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									onClick={() => handleRowClick(row.original)}
									className={onRowClick || showRowDialog ? "hover:bg-muted/50 cursor-pointer" : ""}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									{isLoading ? <BanterLoad /> : "No Results"}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{enablePagination && enablePagination == true ? (
				<div className="py-4">
					<DataTablePagination table={table} defaultPageSize={defaultPageSize} />
				</div>
			) : (
				""
			)}

			{showRowDialog && (
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Row Details</DialogTitle>
						</DialogHeader>
						{selectedRow && dialogContent?.(selectedRow)}
					</DialogContent>
				</Dialog>
			)}

			{enableSelection && (
				<div className="text-muted-foreground flex-1 text-center text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
					selected.
				</div>
			)}
		</div>
	);
}
