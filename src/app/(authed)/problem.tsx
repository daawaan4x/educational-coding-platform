/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
"use client";

import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import { BanterLoader } from "@/components/banter-load";
import CodeEditor from "@/components/code-editor";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { solutions } from "@/db/schema";
import { SolutionItem, SolutionsItem } from "@/lib/types";
import { format } from "date-fns";
import hljs from "highlight.js";
import {
	CalendarIcon,
	ChevronLeft,
	CodeXml,
	FileTerminal,
	FolderClock,
	NotepadText,
	Play,
	Save,
	SquareCheckBig,
	Terminal,
	Upload,
} from "lucide-react";
import type QuillType from "quill";
import type { Delta, Op } from "quill";
import {
	studentOwnSolutionsColumns,
	studentSolutions,
	studentSolutionsColumns,
	studentsSolutions,
	studentsSolutionsColumns,
} from "./problems/add/solutions-columns";

const role: "student" | "teacher" = "teacher"; // Simulate user role, replace with actual logic

// Extend HTMLDivElement to allow __quill property
declare global {
	interface HTMLDivElement {
		__quill?: unknown;
	}
	interface Window {
		hljs?: typeof hljs;
	}
}

// Updated DescriptionEditor component to fix Quill cleanup
function DescriptionEditor({
	problemId,
	maxScore,
	setMaxScore,
	isFirstRender,
	descriptionReadonly = false,
	isLoading,
	setIsLoading,
}: {
	problemId: string;
	maxScore: number;
	setMaxScore: (score: number) => void;
	isFirstRender: React.MutableRefObject<boolean>;
	descriptionReadonly?: boolean;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const quillInstanceRef = useRef<QuillType | null>(null);
	const initializationAttempted = useRef(false);

	// Form state
	const [title, setTitle] = useState("");
	const [maxAttempts, setMaxAttempts] = useState<number>(1);
	const [deadline, setDeadline] = useState<Date>();
	const [deadlineTime, setDeadlineTime] = useState("23:59");
	const [validationErrors, setValidationErrors] = useState({
		title: false,
		maxAttempts: false,
		maxScore: false,
		deadline: false,
	});

	// Simulate API request for fetching problem data
	const fetchProblemData = async () => {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Simulate API response | Replace with the TRPC call
		const apiDeadline = new Date(2024, 11, 25, 23, 59); // Dec 25, 2024 at 11:59 PM
		return {
			title: "Two Sum Problem",
			maxAttempts: 5,
			maxScore: 100,
			deadline: new Date(apiDeadline.getFullYear(), apiDeadline.getMonth(), apiDeadline.getDate()), // Date only
			deadlineTime: `${apiDeadline.getHours().toString().padStart(2, "0")}:${apiDeadline.getMinutes().toString().padStart(2, "0")}`, // Time only
			content: {
				ops: [
					{ insert: "Given an array of integers " },
					{ insert: "nums", attributes: { code: true } },
					{ insert: " and an integer " },
					{ insert: "target", attributes: { code: true } },
					{
						insert:
							", return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n",
					},
					{ insert: "Example 1:", attributes: { bold: true } },
					{ insert: "\n" },
					{
						insert:
							"Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
						attributes: { code: true },
					},
					{ insert: "\n\n" },
					{ insert: "Example 2:", attributes: { bold: true } },
					{ insert: "\n" },
					{ insert: "Input: nums = [3,2,4], target = 6\nOutput: [1,2]", attributes: { code: true } },
					{ insert: "\n\n" },
					{ insert: "Constraints:", attributes: { bold: true } },
					{
						insert:
							"\n• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.",
					},
				],
			},
		};
	};

	// Function to save content to localStorage
	const saveContentToLocalStorage = () => {
		console.log("Saving content to localStorage...");
		if (quillInstanceRef.current) {
			const content = quillInstanceRef.current.getContents();
			const serializedContent = JSON.stringify(content);
			localStorage.setItem("quill-editor-content", serializedContent);
		}
	};

	// Function to save form data to localStorage
	const saveFormDataToLocalStorage = () => {
		console.log("Saving form data to localStorage...");
		const formData = {
			title,
			maxAttempts,
			maxScore,
			deadline: deadline?.toISOString(),
			deadlineTime,
		};
		localStorage.setItem("quill-editor-form-data", JSON.stringify(formData));
	};

	// Function to load content from localStorage
	const loadContentFromLocalStorage = () => {
		console.log("Loading content from localStorage...");
		const savedContent = localStorage.getItem("quill-editor-content");
		if (savedContent && quillInstanceRef.current) {
			try {
				const parsedContent = JSON.parse(savedContent) as Delta | Op[];
				quillInstanceRef.current.setContents(parsedContent);
			} catch (error) {
				console.warn("Failed to parse saved content:", error);
			}
		}
	};

	// Function to load form data from localStorage
	const loadFormDataToLocalStorage = () => {
		console.log("Loading form data from localStorage...");
		const savedFormData = localStorage.getItem("quill-editor-form-data");
		if (savedFormData) {
			try {
				const parsedData = JSON.parse(savedFormData) as {
					title: string;
					maxAttempts: number;
					maxScore: number;
					deadline?: string; // ISO date string
					deadlineTime?: string; // "HH:mm" format
				};
				setTitle(parsedData.title || "");
				setMaxAttempts(parsedData.maxAttempts || 0);
				setMaxScore(parsedData.maxScore || 0);
				if (parsedData.deadline) {
					setDeadline(new Date(parsedData.deadline));
					setDeadlineTime(parsedData.deadlineTime || "23:59");
				}
			} catch (error) {
				console.warn("Failed to parse saved form data:", error);
			}
		}
	};

	// Placeholder function to save to database
	const saveToDatabase = async (data: {
		title: string;
		maxAttempts: number;
		maxScore: number;
		deadline: Date;
		content: Delta | Op[];
	}) => {
		console.log("Saving to database:", data);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		// Replace with actual TRPC call to save to database
	};

	// Handle save functionality
	const handleSave = async () => {
		console.log("handleSave called");
		const errors = {
			title: !title.trim(),
			maxAttempts: maxAttempts <= 0,
			maxScore: maxScore <= 0,
			deadline: !deadline || !deadlineTime.trim(),
		};

		setValidationErrors(errors);

		// If no errors, proceed with save
		if (!Object.values(errors).some(Boolean)) {
			const content = quillInstanceRef.current?.getContents();

			// Check if content exists before saving
			if (!content) {
				console.warn("No content to save");
				return;
			}

			// Combine date and time for database save
			const [hours, minutes] = deadlineTime.split(":").map(Number);
			const combinedDeadline = new Date(deadline!);
			combinedDeadline.setHours(hours, minutes, 0, 0);

			const saveData = {
				title,
				maxAttempts,
				maxScore,
				deadline: combinedDeadline,
				content,
			};

			saveContentToLocalStorage();
			saveFormDataToLocalStorage();

			// Save to both database and localStorage
			await saveToDatabase(saveData);

			console.log("Content saved successfully");
		}
	};

	// Expose save function to parent component
	useEffect(() => {
		// Store the save function on the container for external access
		if (containerRef.current) {
			(containerRef.current as HTMLDivElement & { saveContent?: () => void }).saveContent = () => {
				void handleSave();
			};
		}

		// Also store it on the editor bounds element for the save button
		const editorBounds = document.getElementById("editor-bounds");
		if (editorBounds) {
			(editorBounds as HTMLElement & { saveContent?: () => void }).saveContent = () => {
				void handleSave();
			};
		}
	}, [title, maxAttempts, maxScore, deadline, deadlineTime]);

	useEffect(() => {
		if (!containerRef.current || initializationAttempted.current) return;

		// Reset to loading state when starting initialization
		setIsLoading(true);
		initializationAttempted.current = true;

		const initializeEditor = async () => {
			console.log("Initializing Quill editor...");

			try {
				// Clean up previous instance if it exists
				if (quillInstanceRef.current) {
					quillInstanceRef.current = null;
				}

				// Clear the container completely (this removes both toolbar and editor)
				if (containerRef.current) {
					containerRef.current.innerHTML = "";

					// Create a new editor div inside the container
					const editorDiv = document.createElement("div");
					editorDiv.id = "editor";
					editorDiv.className = "my-2 max-h-full overflow-y-auto flex-1";
					containerRef.current.appendChild(editorDiv);

					window.hljs = hljs;

					// Double-check that the editorDiv still exists and is connected
					if (!editorDiv || !editorDiv.parentNode || !containerRef.current?.contains(editorDiv)) {
						console.warn("Editor div was removed before Quill could initialize");
						return;
					}

					const QuillModule = await import("quill");
					const Quill = QuillModule.default;

					// Final check before creating Quill instance
					if (
						editorDiv &&
						editorDiv.parentNode &&
						!quillInstanceRef.current &&
						containerRef.current?.contains(editorDiv)
					) {
						console.log("Creating new Quill instance...");
						quillInstanceRef.current = new Quill(editorDiv, {
							readOnly: false,
							modules: {
								syntax: true,
								toolbar: [
									["bold", "italic", "underline", "strike", "code", { script: "sub" }, { script: "super" }],
									["blockquote", "code-block"],
									[{ header: 1 }, { header: 2 }, { header: 3 }],
									[{ color: [] }, { background: [] }],
									[{ list: "ordered" }, { list: "bullet" }],
									[{ align: [] }, { indent: "-1" }, { indent: "+1" }],
									["link", "image", "video", "formula"],
								],
							},
							placeholder: "Start typing here...",
							theme: "snow",
							bounds: "#editor-bounds",
						});

						// Store reference on the DOM element for the save button
						editorDiv.__quill = quillInstanceRef.current as QuillType;

						if (isFirstRender.current) {
							// First render: fetch from API
							console.log("First render: fetching from API");
							const problemData = await fetchProblemData();

							// Set content and form data from API
							if (quillInstanceRef.current) {
								quillInstanceRef.current.setContents(problemData.content.ops);
							}
							setTitle(problemData.title);
							setMaxAttempts(problemData.maxAttempts);
							setMaxScore(problemData.maxScore);
							setDeadline(problemData.deadline);
							setDeadlineTime(problemData.deadlineTime);

							// Save initial data to localStorage for future use
							saveFormDataToLocalStorage();
							saveContentToLocalStorage();

							isFirstRender.current = false;
						} else {
							// Subsequent renders: load from localStorage only
							console.log("Subsequent render: loading from localStorage");
							loadFormDataToLocalStorage();
							loadContentFromLocalStorage();
						}

						console.log("Quill instance created successfully");
					} else {
						console.warn("Failed to create Quill instance - editorDiv not available or already initialized");
					}
				}
			} catch (error) {
				console.error("Failed to initialize editor:", error);
			} finally {
				setIsLoading(false);
			}
		};

		initializeEditor();

		const container = containerRef.current;

		return () => {
			// Clean up by clearing the container and nullifying the reference
			if (container) {
				container.innerHTML = "";
			}
			quillInstanceRef.current = null;
			initializationAttempted.current = false;
		};
	}, []); // Remove all dependencies to prevent re-initialization

	return (
		<div className="relative flex h-full max-h-full max-w-full flex-col gap-2 overflow-y-auto">
			{/* Title Section */}
			{isLoading ? (
				""
			) : !descriptionReadonly ? (
				<>
					<Input
						id="title"
						placeholder="Title..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className={cn(
							"placeholder:text-muted-foreground mb-2 h-auto scroll-mt-20 border-none bg-transparent px-0 py-0 text-[2.5rem] leading-[3rem] font-extrabold tracking-[-0.025em] shadow-none placeholder:text-[2.5rem] focus-visible:ring-0 focus-visible:ring-offset-0",
							{ "border-red-500": validationErrors.title },
						)}
						style={{ fontSize: "2.5rem" }}
						required
					/>
					{validationErrors.title && <p className="mb-4 text-sm text-red-500">Title is required</p>}
				</>
			) : (
				<h1 className="mb-2 h-auto scroll-mt-20 border-none bg-transparent px-3 py-0 text-[2.5rem] leading-[3rem] font-extrabold tracking-[-0.025em]">
					{title || <span className="text-muted-foreground">Loading title...</span>}
				</h1>
			)}

			{/* Quill Editor */}
			<div
				ref={containerRef}
				className={cn("invisible flex max-h-full max-w-full flex-col gap-2 overflow-y-auto", {
					visible: !isLoading,
				})}
			/>

			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<BanterLoader />
				</div>
			)}

			{/* Form Fields Section */}
			{isLoading ? (
				""
			) : !descriptionReadonly ? (
				<>
					<Separator className="my-4" />
					<div className="bg-muted/30 mt-auto space-y-4 rounded-lg border p-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="maxAttempts">Max Attempts *</Label>
								<Input
									id="maxAttempts"
									type="number"
									min="1"
									placeholder="e.g. 5"
									value={maxAttempts || ""}
									onChange={(e) => setMaxAttempts(Number(e.target.value) || 0)}
									className={cn({ "border-red-500": validationErrors.maxAttempts })}
									required
								/>
								{validationErrors.maxAttempts && <p className="text-sm text-red-500">Max attempts is required</p>}
							</div>
							<div className="space-y-2">
								<Label htmlFor="maxScore">Max Score *</Label>
								<Input
									id="maxScore"
									type="number"
									min="1"
									placeholder="e.g. 100"
									value={maxScore || ""}
									onChange={(e) => setMaxScore(Number(e.target.value) || 0)}
									className={cn({ "border-red-500": validationErrors.maxScore })}
									required
								/>
								{validationErrors.maxScore && <p className="text-sm text-red-500">Max score is required</p>}
							</div>
						</div>
						<div className="space-y-2">
							<Label>Deadline *</Label>
							<div className="flex gap-2">
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												"w-auto justify-start text-left font-normal",
												!deadline && "text-muted-foreground",
												{ "border-red-500": validationErrors.deadline },
											)}>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{deadline ? format(deadline, "PPP") : "Pick a date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
									</PopoverContent>
								</Popover>
								<input
									type="time"
									value={deadlineTime}
									onChange={(e) => setDeadlineTime(e.target.value)}
									className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-fit w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
									required
								/>
							</div>
							{validationErrors.deadline && <p className="text-sm text-red-500">Date and time are required</p>}
						</div>
					</div>
				</>
			) : (
				<>
					<Separator className="mt-4 mb-1" />
					<div className="mt-auto space-y-1">
						<div className="flex items-center justify-between py-2">
							<span className="text-muted-foreground text-sm font-medium">Max Attempts</span>
							<span className="text-sm font-semibold">{maxAttempts || "5"}</span>
						</div>
						<Separator />
						<div className="flex items-center justify-between py-2">
							<span className="text-muted-foreground text-sm font-medium">Max Score</span>
							<span className="text-sm font-semibold">{maxScore || "100"}</span>
						</div>
						<Separator />
						<div className="flex items-center justify-between py-2">
							<span className="text-muted-foreground text-sm font-medium">Deadline</span>
							<span className="text-sm font-semibold">
								{deadline && deadlineTime
									? `${format(deadline, "PPP")} at ${deadlineTime}`
									: "Dec 25, 2024 at 11:59 PM"}
							</span>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

interface ProblemProps {
	descriptionReadonly?: boolean;
	showSubmissions?: boolean;
	showCodeEditor?: boolean;
	canSubmitCode?: boolean;
}

export default function Problem({
	descriptionReadonly = false,
	showSubmissions = false,
	showCodeEditor = true,
	canSubmitCode = true,
}: ProblemProps) {
	const { state, isMobile } = useSidebar();
	const [tabValue, setTabValue] = useState("description");
	const [outputTabValue, setOutputTabValue] = useState("output");
	const [codeOutput, setCodeOutput] = useState(null);
	const [studentSolutionsView, setStudentSolutionsView] = useState(false);
	const [selectedStudentID, setSelectedStudentID] = useState<string | null>(null);
	const [selectedStudentInfo, setSelectedStudentInfo] = useState<{
		firstName: string;
		lastName: string;
		score: number;
	} | null>(null);

	// Code editor state management
	const [editorCode, setEditorCode] = useState("");
	const [editorLanguage, setEditorLanguage] = useState("javascript");

	// Description editor loading state
	const [isDescriptionLoading, setIsDescriptionLoading] = useState(true);

	// Loading states and data for submissions
	const [studentsSolutionsData, setStudentsSolutionsData] = useState<SolutionsItem[]>([]);
	const [studentSolutionsData, setStudentSolutionsData] = useState<SolutionItem[]>([]);
	const [isLoadingStudentsSolutions, setIsLoadingStudentsSolutions] = useState(false);
	const [isLoadingStudentSolutions, setIsLoadingStudentSolutions] = useState(false);

	// Manage maxScore state in parent
	const [maxScore, setMaxScore] = useState<number>(0);

	const isFirstRender = useRef(true);

	// Functions to dynamically control code editor
	const setCodeEditorContent = (code: string, language?: string) => {
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
		setCodeEditorContent(`// Write your code here\nconsole.log("Hello, Mighty!");`, "javascript");
	}, []);

	// Simulate fetching students solutions overview
	const fetchStudentsSolutions = async () => {
		setIsLoadingStudentsSolutions(true);
		try {
			// Simulate API delay | Replace with the TRPC call
			await new Promise((resolve) => setTimeout(resolve, 1200));
			setStudentsSolutionsData(studentsSolutions);
		} catch (error) {
			console.error("Failed to fetch students solutions:", error);
		} finally {
			setIsLoadingStudentsSolutions(false);
		}
	};

	// Simulate fetching individual student solutions
	const fetchStudentSolutions = async (studentId: string) => {
		setIsLoadingStudentSolutions(true);
		try {
			// Simulate API delay | Replace with the TRPC call
			await new Promise((resolve) => setTimeout(resolve, 800));
			setStudentSolutionsData(studentSolutions);
		} catch (error) {
			console.error("Failed to fetch student solutions:", error);
		} finally {
			setIsLoadingStudentSolutions(false);
		}
	};

	// Fetch students solutions when submissions tab is accessed
	useEffect(() => {
		if (
			tabValue === "submissions" &&
			showSubmissions &&
			role === "teacher" &&
			!studentSolutionsView &&
			studentsSolutionsData.length === 0
		) {
			fetchStudentsSolutions();
		}
		if (tabValue === "submissions" && showSubmissions && role === "student" && studentSolutionsData.length === 0) {
			fetchStudentSolutions("current-student-id"); // Replace with actual current student ID
		}
	}, [tabValue, showSubmissions, studentSolutionsView, studentsSolutionsData.length]);

	// Fetch individual student solutions when viewing specific student
	useEffect(() => {
		if (studentSolutionsView && selectedStudentID && studentSolutionsData.length === 0) {
			fetchStudentSolutions(selectedStudentID);
		}
	}, [studentSolutionsView, selectedStudentID, studentSolutionsData.length]);

	const handleSave = (data: {
		title: string;
		maxAttempts: number;
		maxScore: number;
		deadline: Date;
		content: Delta;
	}) => {
		console.log("Saving problem data:", data);
		// Here you would typically make an API call to save the data
	};

	const handleStudentRowClick = (row: SolutionsItem) => {
		setStudentSolutionsView(true);
		setSelectedStudentID(row.authorId);
		setSelectedStudentInfo({
			firstName: row.authorFirstName,
			lastName: row.authorLastName,
			score: row.score,
		});
		// Reset student solutions data to trigger fresh fetch
		setStudentSolutionsData([]);
	};

	const handleBackToStudentsList = () => {
		setStudentSolutionsView(false);
		setSelectedStudentID(null);
		setSelectedStudentInfo(null);
		// Reset student solutions data
		setStudentSolutionsData([]);
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
						// Save content before switching tabs
						if (tabValue === "description") {
							const containerElement = document.querySelector("#editor-bounds") as
								| (HTMLDivElement & { saveContent?: () => void })
								| null;
							if (containerElement && containerElement.saveContent) {
								containerElement.saveContent();
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
							problemId="123"
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
							<>
								{studentSolutionsView ? (
									<div className="flex h-full w-full flex-col gap-2">
										{/* Back Button */}
										<div className="flex flex-row items-center justify-between">
											<Tooltip>
												<TooltipTrigger asChild>
													<Button variant="secondary" className="w-fit" onClick={handleBackToStudentsList}>
														<ChevronLeft />
														<span className="sr-only">Go back to student list</span>
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Go back</p>
												</TooltipContent>
											</Tooltip>
										</div>

										{/* Individual Student Solutions */}
										{isLoadingStudentSolutions ? (
											<div className="flex h-9/10 w-full items-center justify-center">
												<BanterLoader />
											</div>
										) : (
											<>
												<div className="mb-1 text-center">
													<h2 className="text-lg font-semibold">
														{selectedStudentInfo?.firstName} {selectedStudentInfo?.lastName}&apos;s Solutions
													</h2>
												</div>

												{/* Score Update Section */}
												<div className="mb-4 space-y-2">
													<Label htmlFor="studentScore">Score</Label>
													<div className="flex gap-2">
														<Input
															id="studentScore"
															type="number"
															min="0"
															max="100"
															placeholder="Enter score"
															value={selectedStudentInfo?.score?.toString() || ""}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
																const value = Number(e.target.value);
																const constrainedValue = Math.min(Math.max(value, 0), maxScore);
																setSelectedStudentInfo((prev) => (prev ? { ...prev, score: constrainedValue } : null));
															}}
														/>
														<Button
															variant="secondary"
															onClick={() => {
																// Handle score update
																// TODO: Implement actual score update logic
																console.log("Updating score");
																if (selectedStudentInfo?.score) {
																	setMaxScore(selectedStudentInfo.score);
																}
															}}>
															Update
														</Button>
													</div>
												</div>

												{/* Student Solutions Table */}
												<DataTable
													columns={studentSolutionsColumns}
													data={studentSolutionsData}
													enablePagination={false}
													showColumnViewControl={false}
													onRowClick={(row) => {
														setCodeEditorContent(row.code);
													}}
												/>
											</>
										)}
									</div>
								) : (
									// Students List View
									<>
										{isLoadingStudentsSolutions ? (
											<div className="flex h-full w-full items-center justify-center">
												<BanterLoader />
											</div>
										) : (
											<DataTable
												columns={studentsSolutionsColumns}
												data={studentsSolutionsData}
												enablePagination={false}
												onRowClick={handleStudentRowClick}
											/>
										)}
									</>
								)}
							</>
						)}

						{/* Student View */}
						{showSubmissions && role == "student" && (
							<>
								{isLoadingStudentSolutions ? (
									<div className="flex h-full w-full items-center justify-center">
										<BanterLoader />
									</div>
								) : (
									<DataTable
										columns={studentOwnSolutionsColumns}
										data={studentSolutionsData}
										enablePagination={false}
										showColumnViewControl={true}
										notVisibleColumns={["dateCreated"]}
										onRowClick={(row) => {
											setCodeEditorContent(row.code);
										}}
									/>
								)}
							</>
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
							{canSubmitCode && (
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
