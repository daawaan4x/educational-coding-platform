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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { ProblemItemWithProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CirclePlus, FolderKanban } from "lucide-react";
import { completionStatuses, deadlineStatuses } from "../data";
import { classColumns, classes } from "./classes-columns";
import { problemColumns } from "./problems-columns";

export default function TeacherDashboardWrapper({ problems }: { problems: ProblemItemWithProgress[] }) {
	const { state, isMobile } = useSidebar();

	return (
		<div
			className={cn("align-items mt-3 flex w-full flex-col justify-center overflow-hidden px-8 pb-8", {
				"max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
			})}>
			<div className="flex items-center justify-between gap-3 border-b pb-2">
				<h2>Problems</h2>
				<div className="flex flex-wrap items-center justify-end gap-3 lg:flex-nowrap">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">
								<FolderKanban /> Manage Classes
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Manage Classes</DialogTitle>
								<DialogDescription>
									View and organize your classes. You can add, edit, or remove classes as needed.
								</DialogDescription>
							</DialogHeader>
							<DataTable
								columns={classColumns}
								data={classes}
								filterColumn="name"
								notVisibleColumns={["dateCreated", "dateModified"]}
								enablePagination={false}
							/>
						</DialogContent>
					</Dialog>
					<Button variant="outline">
						<CirclePlus /> Add Problem
					</Button>
				</div>
			</div>
			<DataTable
				columns={problemColumns}
				data={problems}
				filterColumn="title"
				notVisibleColumns={["studentsCompleted", "totalStudents", "dateCreated", "dateModified", "completionStatus"]}
				filters={[
					{
						column: "deadlineStatus",
						options: deadlineStatuses,
					},
					{
						column: "completionStatus",
						options: completionStatuses,
					},
				]}
			/>
		</div>
	);
}
