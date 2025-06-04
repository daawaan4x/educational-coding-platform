/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
"use client";

// We need to use this wrapper because the width of the content must vary
// depending on the sidebar state. We need a client component to use React Context.
import { completionStatuses, deadlineStatuses } from "@/app/(authed)/data";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProblemItemStudent, ProblemItemWithProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bolt, CirclePlus, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { participants, participantsColumns } from "./participants-columns";
import { problemColumns, problemColumnsForStudent, problems, problemsForStudent } from "./problems-columns";

// TODO: Replace with actual role logic from authentication/user context
const role: "teacher" | "student" = "teacher";

export default function ClassPageWrapper() {
	const { state, isMobile } = useSidebar();
	const [tabValue, setTabValue] = useState("problems");
	const [problemsTeachers, setProblemsTeachers] = useState<ProblemItemWithProgress[]>([]);
	const [problemsStudents, setProblemsStudents] = useState<ProblemItemStudent[]>([]); // For student view
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (role === "teacher") {
			async function fetchProblems() {
				try {
					//   trpc fetch
					setProblemsTeachers(problems);
				} catch (err) {
					setError("Error fetching problems");
				} finally {
					setIsLoading(false);
				}
			}

			fetchProblems();
		} else if (role === "student") {
			async function fetchProblems() {
				try {
					//   trpc fetch
					setProblemsStudents(problemsForStudent);
				} catch (err) {
					setError("Error fetching problems");
				} finally {
					setIsLoading(false);
				}
			}

			fetchProblems();
		}
	}, []);

	if (error) return <div className="text-center text-red-500">{error}</div>;
	if (isLoading) return <Loading />;

	return (
		<div
			className={cn("align-items mt-3 flex w-full flex-col justify-center overflow-hidden px-8 pb-8", {
				"max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
			})}>
			<div className="flex flex-row items-center justify-between gap-3">
				<h1 className="mb-6">[Class name]</h1>
				{role === "teacher" && (
					<Button variant="outline">
						<Bolt /> Edit
					</Button>
				)}
			</div>
			<Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
				<div className="flex w-full items-center">
					<div className="flex w-full flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
						<TabsList>
							<TabsTrigger value="problems">Problems</TabsTrigger>
							<TabsTrigger value="participants">Participants</TabsTrigger>
						</TabsList>
						{tabValue === "problems" && (
							<Button>
								<CirclePlus /> Add Problem
							</Button>
						)}
					</div>
				</div>
				<TabsContent value="problems" className="w-full">
					{role === "teacher" && (
						<DataTable
							columns={problemColumns}
							data={problems}
							filterColumn="title"
							notVisibleColumns={[
								"studentsCompleted",
								"totalStudents",
								"dateCreated",
								"dateModified",
								"completionStatus",
								"class",
							]}
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
							defaultPageSize={30}
						/>
					)}
					{role === "student" && (
						<DataTable
							columns={problemColumnsForStudent}
							data={problemsForStudent}
							filterColumn="title"
							notVisibleColumns={["dateCreated", "dateModified"]}
							filters={[
								{
									column: "deadlineStatus",
									options: deadlineStatuses,
								},
							]}
							defaultPageSize={30}
						/>
					)}
				</TabsContent>
				<TabsContent value="participants">
					<DataTable
						columns={participantsColumns}
						data={participants}
						filterColumn="lastName"
						notVisibleColumns={["dateCreated", "dateModified", "classes"]}
						enablePagination={true}
						defaultPageSize={50}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
