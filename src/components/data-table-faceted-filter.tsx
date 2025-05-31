import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import * as React from "react";

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValue = column?.getFilterValue() as string;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					<PlusCircle className="mr-2 h-4 w-4" />
					{title}
					{selectedValue && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<div className="flex space-x-1">
								{options
									.filter((option) => option.value === selectedValue)
									.map((option) => (
										<Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
											{option.label}
										</Badge>
									))}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = option.value === selectedValue;
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											// If already selected, clear the filter (toggle behavior)
											if (isSelected) {
												column?.setFilterValue(undefined);
											} else {
												console.log(`Setting filter value for ${title} to ${option.value}`);
												// Set single value instead of array
												column?.setFilterValue(option.value);
											}
										}}>
										<div
											className={cn(
												"border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-full border",
												isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
											)}>
											<Check className="h-4 w-4" />
										</div>
										{option.icon && <option.icon className="text-muted-foreground mr-2 h-4 w-4" />}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValue && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center">
										Clear filter
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
