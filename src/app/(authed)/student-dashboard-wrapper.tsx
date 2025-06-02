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
import { ProblemItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CirclePlus, FolderKanban } from "lucide-react";
import { deadlineStatuses } from "./data";
import { problemColumns } from "./problems-columns";

export default function StudentDashboardWrapper({ problems }: { problems: ProblemItem[] }) {
	const { state, isMobile } = useSidebar();

	return (
		<div
			className={cn("align-items mt-3 flex w-full flex-col justify-center overflow-hidden px-8 pb-8", {
				"max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
			})}>
			<div className="flex items-center justify-between gap-3 border-b pb-2">
				<h2>Problems</h2>
			</div>
			<DataTable
				columns={problemColumns}
				data={problems}
				filterColumn="title"
				notVisibleColumns={["studentsCompleted", "totalStudents", "dateCreated", "dateModified"]}
				filters={[
					{
						column: "deadlineStatus",
						options: deadlineStatuses,
					},
				]}
			/>
		</div>
	);
}
