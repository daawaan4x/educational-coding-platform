/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import BanterLoader from "@/components/banter-load";
import CodeEditor from "@/components/code-editor";
// Import modularized components
import { DescriptionEditor } from "@/components/problem/description-editor";
import { StudentSubmissionsView } from "@/components/problem/tabs/student-submissions-view";
import { TeacherSubmissionsView } from "@/components/problem/tabs/teacher-submissions-view";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useAuth } from "@/lib/auth";
import { Language } from "@/lib/languages";
import { SolutionItem, SolutionsItem } from "@/lib/types";
import { CodeXml, FolderClock, NotepadText, Play, Save, Terminal, Upload } from "lucide-react";
import type { Delta } from "quill";
import {
	studentOwnSolutionsColumns,
	studentSolutions,
	studentSolutionsColumns,
	studentsSolutions,
	studentsSolutionsColumns,
} from "./problems/add/solutions-columns";

interface ProblemProps {
	descriptionReadonly?: boolean;
	showSubmissions?: boolean;
	showCodeEditor?: boolean;
	problemId?: string; // Make optional
}

export default function Problem({
	descriptionReadonly = false,
	showSubmissions = false,
	showCodeEditor = true,
	problemId,
}: ProblemProps) {
	const user = useAuth();
	const role = user.role;

	const { state, isMobile } = useSidebar();
	const [tabValue, setTabValue] = useState("description");
	const [outputTabValue, setOutputTabValue] = useState("output");
	const [codeOutput, setCodeOutput] = useState(null);

	// Code editor state management
	const [editorCode, setEditorCode] = useState("");
	const [editorLanguage, setEditorLanguage] = useState<Language>("js");

	// Description editor loading state
	const [isDescriptionLoading, setIsDescriptionLoading] = useState(true);

	// Manage maxScore state in parent
	const [maxScore, setMaxScore] = useState<number>(0);

	const isFirstRender = useRef(true);

	// Use submissions hook
	const submissions = useSubmissions(role === "teacher" || role === "student" ? role : "student");

	// Functions to dynamically control code editor
	const setCodeEditorContent = (code: string, language?: Language) => {
		setEditorCode(code);
		if (language) {
			setEditorLanguage(language);
		}
	};

	const resetCodeEditor = () => {
		setCodeEditorContent("");
	};

	// Initialize with starter code on component mount
	useEffect(() => {
		setCodeEditorContent(`// Write your code here\nconsole.log("Hello, Mighty!");`, "js");
	}, []);

	// Fetch students solutions when submissions tab is accessed
	useEffect(() => {
		if (role === "admin") return; // Admins do not have submissions view

		if (
			tabValue === "submissions" &&
			showSubmissions &&
			role === "teacher" &&
			!submissions.studentSolutionsView &&
			submissions.studentsSolutionsData.length === 0
		) {
			submissions.fetchStudentsSolutions();
		}
		if (
			tabValue === "submissions" &&
			showSubmissions &&
			role === "student" &&
			submissions.studentSolutionsData.length === 0
		) {
			submissions.fetchStudentSolutions("current-student-id"); // Replace with actual current student ID
		}
	}, [tabValue, showSubmissions, submissions.studentSolutionsView, submissions.studentsSolutionsData.length]);

	// Fetch individual student solutions when viewing specific student
	useEffect(() => {
		if (role === "admin") return; // Admins do not have submissions view
		if (
			submissions.studentSolutionsView &&
			submissions.selectedStudentID &&
			submissions.studentSolutionsData.length === 0
		) {
			submissions.fetchStudentSolutions(submissions.selectedStudentID);
		}
	}, [submissions.studentSolutionsView, submissions.selectedStudentID, submissions.studentSolutionsData.length]);

	const handleSave = (data: {
		title: string;
		// maxAttempts: number;
		maxScore: number;
		deadline: Date;
		content: Delta;
	}) => {
		console.log("Saving problem data:", data);
		// Here you would typically make an API call to save the data
	};

	return (
		<div
			className={cn("grid h-auto w-full grid-cols-1 gap-1 p-2 md:gap-2 lg:max-h-[91vh]", {
				"max-w-[calc(100vw-16rem)] lg:h-full lg:max-h-[91vh] lg:grid-cols-2 lg:overflow-y-hidden":
					state == "expanded" && !isMobile,
				"md:h-full md:max-h-[91vh] md:grid-cols-2 md:overflow-y-hidden": state != "expanded" && !isMobile,
			})}>
			{/* Description/Submissions Card */}
			<Card
				className={cn("h-auto min-h-[13rem] w-full overflow-y-hidden px-2 py-[8px]", {
					"md:h-full md:max-h-full": state != "expanded" && !isMobile,
					"lg:h-full lg:max-h-full": state == "expanded" && !isMobile,
				})}>
				<Tabs
					value={tabValue}
					onValueChange={(value) => {
						// Save content to localStorage before switching tabs (not to database)
						if (tabValue === "description") {
							// Try multiple ways to find the save function
							let saveFunction: (() => void) | null = null;

							// Method 1: Try #editor-bounds element
							const editorBounds = document.querySelector("#editor-bounds") as
								| (HTMLDivElement & { saveToLocalStorage?: () => void })
								| null;
							if (editorBounds && editorBounds.saveToLocalStorage) {
								saveFunction = editorBounds.saveToLocalStorage;
							}

							// Method 2: Try to find the DescriptionEditor container
							if (!saveFunction) {
								const descriptionEditor = document.querySelector("[data-description-editor]") as
									| (HTMLDivElement & { saveToLocalStorage?: () => void })
									| null;
								if (descriptionEditor && descriptionEditor.saveToLocalStorage) {
									saveFunction = descriptionEditor.saveToLocalStorage;
								}
							}

							// Method 3: Try any element with the save function attached
							if (!saveFunction) {
								const containerElements = document.querySelectorAll('[data-state="active"]');
								for (const element of containerElements) {
									const el = element as HTMLElement & { saveToLocalStorage?: () => void };
									if (el.saveToLocalStorage) {
										saveFunction = el.saveToLocalStorage;
										break;
									}
								}
							}

							// Call the save function if found
							if (saveFunction) {
								console.log("Saving to localStorage before tab switch...");
								saveFunction();
							} else {
								console.warn("saveToLocalStorage function not found - content may not be saved");
							}
						}
						setTabValue(value);
					}}
					className={cn("h-full w-full lg:max-h-full", {
						"h-full lg:h-full": descriptionReadonly,
						"h-full md:h-full lg:h-full": state != "expanded" && !isMobile && descriptionReadonly,
					})}>
					{/* Tab Header */}
					<div className="flex w-full flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
						<TabsList>
							<TabsTrigger value="description">
								<NotepadText /> Description
							</TabsTrigger>
							{showSubmissions && (
								<TabsTrigger value="submissions" disabled={isDescriptionLoading}>
									<FolderClock />
									Submissions
								</TabsTrigger>
							)}
						</TabsList>

						{/* Save Button for Description Tab */}
						{tabValue === "description" && !descriptionReadonly && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										className="w-fit"
										onClick={() => {
											const containerElement = document.querySelector("#editor-bounds") as
												| (HTMLDivElement & { saveContent?: () => void })
												| null;
											if (containerElement && containerElement.saveContent) {
												containerElement.saveContent();
											}
										}}
										disabled={isDescriptionLoading}>
										<Save />
										<span className="sr-only">Save</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Save</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>

					{/* Description Tab Content */}
					<TabsContent
						value="description"
						className={cn("flex h-auto max-h-full w-full flex-1 flex-col overflow-y-auto", {
							"md:h-full md:max-h-full": state != "expanded" && !isMobile,
							"lg:h-full lg:max-h-full": state == "expanded" && !isMobile,
						})}
						id="editor-bounds">
						<DescriptionEditor
							problemId={problemId}
							maxScore={maxScore}
							setMaxScore={setMaxScore}
							isFirstRender={isFirstRender}
							descriptionReadonly={descriptionReadonly}
							isLoading={isDescriptionLoading}
							setIsLoading={setIsDescriptionLoading}
						/>
					</TabsContent>

					{/* Submissions Tab Content */}
					<TabsContent value="submissions" className="max-h-full w-full overflow-y-auto">
						{/* Teacher View */}
						{showSubmissions && role == "teacher" && (
							<TeacherSubmissionsView
								studentSolutionsView={submissions.studentSolutionsView}
								selectedStudentInfo={submissions.selectedStudentInfo}
								studentSolutionsData={submissions.studentSolutionsData}
								studentsSolutionsData={submissions.studentsSolutionsData}
								isLoadingStudentSolutions={submissions.isLoadingStudentSolutions}
								isLoadingStudentsSolutions={submissions.isLoadingStudentsSolutions}
								onStudentRowClick={submissions.handleStudentRowClick}
								onBackToStudentsList={submissions.handleBackToStudentsList}
								onCodeEditorUpdate={setCodeEditorContent}
								onScoreUpdate={submissions.updateStudentScore}
								maxScore={maxScore}
								studentsSolutionsColumns={studentsSolutionsColumns}
							/>
						)}

						{/* Student View */}
						{showSubmissions && role == "student" && (
							<StudentSubmissionsView
								studentSolutionsData={submissions.studentSolutionsData}
								isLoadingStudentSolutions={submissions.isLoadingStudentSolutions}
								onCodeEditorUpdate={setCodeEditorContent}
							/>
						)}
					</TabsContent>
				</Tabs>
			</Card>

			{/* Code Editor and Output Section */}
			<div className="flex h-full w-full flex-col gap-2">
				{/* Code Editor Card */}
				<Card
					className={cn(
						"flex min-h-[15rem] w-full flex-col gap-2 px-2 py-[8px] lg:max-h-[60vh] lg:min-h-auto lg:flex-auto lg:flex-grow-[5] lg:overflow-hidden",
						{
							"md:max-h-[60vh] md:min-h-auto md:flex-auto md:flex-grow-[5] md:overflow-hidden":
								state != "expanded" && !isMobile,
						},
					)}>
					{/* Code Editor Header */}
					<div className="flex w-full flex-wrap items-center justify-between gap-1 lg:flex-nowrap">
						<span className="inline-flex w-fit flex-row items-center justify-center gap-1 rounded-md border px-2 py-1 text-sm shadow-sm">
							<CodeXml />
							<span>Code</span>
						</span>

						{/* Action Buttons */}
						<div className="flex flex-row items-center gap-1">
							{role === "student" && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="secondary" className="w-fit" onClick={() => {}}>
											<Upload />
											<span className="sr-only">Submit Code</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Submit Code</p>
									</TooltipContent>
								</Tooltip>
							)}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="secondary" className="w-fit" onClick={() => {}}>
										<Play />
										<span className="sr-only">Run Code</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Run Code</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>

					{/* Code Editor */}
					<div className="min-h-0 flex-1 overflow-auto">
						<CodeEditor language={editorLanguage} value={editorCode} onChange={setEditorCode} />
					</div>
				</Card>

				{/* Output Card */}
				<Card
					className={cn(
						"min-h-[15rem] w-full px-2 py-[8px] lg:max-h-[28.4vh] lg:min-h-auto lg:flex-auto lg:flex-grow-[2] lg:overflow-auto",
						{
							"px-2 py-[8px] md:max-h-[28.4vh] md:min-h-auto md:flex-auto md:flex-grow-[2] md:overflow-auto":
								state != "expanded" && !isMobile,
						},
					)}>
					<Tabs value={outputTabValue} onValueChange={setOutputTabValue} className="h-full w-full">
						<TabsList>
							<TabsTrigger value="output">
								<Terminal /> Output
							</TabsTrigger>
						</TabsList>

						<TabsContent value="output">
							{!codeOutput || codeOutput == null ? (
								<div className="flex h-full w-full items-center justify-center">
									<p className="text-muted-foreground">No output yet. Run your code to see the output.</p>
								</div>
							) : (
								<div>Code output</div>
							)}
						</TabsContent>
					</Tabs>
				</Card>
			</div>
		</div>
	);
}
