"use client";

import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import CodeEditor from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import hljs from "highlight.js";
import { CalendarIcon, CodeXml, FolderClock, NotepadText, Play, Save } from "lucide-react";
import type QuillType from "quill";
import type { Delta, Op } from "quill";

// Extend HTMLDivElement to allow __quill property
declare global {
	interface HTMLDivElement {
		// @ts-ignore
		__quill?: unknown;
	}
	interface Window {
		hljs?: typeof hljs;
	}
}

interface ProblemProps {
	descriptionReadonly?: boolean;
	showSubmissions?: boolean;
}

// Updated DescriptionEditor component to fix Quill cleanup
function DescriptionEditor({ descriptionReadonly }: { descriptionReadonly: boolean }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const quillInstanceRef = useRef<QuillType | null>(null);
	const [isVisible, setIsVisible] = useState(true);

	// Function to save content to localStorage
	const saveContentToLocalStorage = () => {
		if (quillInstanceRef.current) {
			const content = quillInstanceRef.current.getContents();
			const serializedContent = JSON.stringify(content);
			localStorage.setItem("quill-editor-content", serializedContent);
		}
	};

	// Function to load content from localStorage
	const loadContentFromLocalStorage = () => {
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

	// Expose save function to parent component
	useEffect(() => {
		// Store the save function on the container for external access
		if (containerRef.current) {
			(containerRef.current as HTMLDivElement & { saveContent?: () => void }).saveContent = saveContentToLocalStorage;
		}
	}, []);

	useEffect(() => {
		// Force re-render when component becomes visible
		setIsVisible(true);
	}, []);

	useEffect(() => {
		if (!containerRef.current || !isVisible) return;

		console.log("Initializing Quill editor...");

		// Clean up previous instance if it exists
		if (quillInstanceRef.current) {
			quillInstanceRef.current = null;
		}

		// Clear the container completely (this removes both toolbar and editor)
		containerRef.current.innerHTML = "";

		// Create a new editor div inside the container
		const editorDiv = document.createElement("div");
		editorDiv.id = "editor";
		editorDiv.className = "my-2 max-h-full overflow-y-auto flex-1";
		containerRef.current.appendChild(editorDiv);

		window.hljs = hljs;

		// Add a small delay to ensure DOM is ready
		setTimeout(() => {
			// Double-check that the editorDiv still exists and is connected
			if (!editorDiv || !editorDiv.parentNode || !containerRef.current?.contains(editorDiv)) {
				console.warn("Editor div was removed before Quill could initialize");
				return;
			}

			import("quill")
				.then((QuillModule) => {
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
							debug: "info",
							readOnly: descriptionReadonly,
							modules: {
								syntax: true,
								toolbar: descriptionReadonly
									? false
									: [
											["bold", "italic", "underline", "strike", "code", { script: "sub" }, { script: "super" }],
											["blockquote", "code-block"],
											[{ header: 1 }, { header: 2 }, { header: 3 }],
											[{ color: [] }, { background: [] }],
											[{ list: "ordered" }, { list: "bullet" }],
											[{ align: [] }, { indent: "-1" }, { indent: "+1" }],
											["link", "image", "video", "formula"],
										],
							},
							placeholder: descriptionReadonly ? "Loading description..." : "Start typing here...",
							theme: "snow",
							bounds: "#editor-bounds",
						});

						// Store reference on the DOM element for the save button
						editorDiv.__quill = quillInstanceRef.current as QuillType;

						// Load saved content after initialization
						setTimeout(() => {
							loadContentFromLocalStorage();
						}, 50);

						console.log("Quill instance created successfully");
					} else {
						console.warn("Failed to create Quill instance - editorDiv not available or already initialized");
					}
				})
				.catch((error) => {
					console.error("Failed to load Quill module:", error);
				});
		}, 10);

		const container = containerRef.current;
		return () => {
			// Clean up by clearing the container and nullifying the reference
			if (container) {
				container.innerHTML = "";
			}
			quillInstanceRef.current = null;
		};
	}, [descriptionReadonly, isVisible]);

	return <div ref={containerRef} className="flex max-h-full max-w-full flex-col gap-2 overflow-y-auto" />;
}

export default function Problem({ descriptionReadonly = false, showSubmissions = false }: ProblemProps) {
	const { state, isMobile } = useSidebar();
	const [tabValue, setTabValue] = useState("description");
	const [title, setTitle] = useState("");
	const [maxAttempts, setMaxAttempts] = useState("");
	const [maxScore, setMaxScore] = useState("");
	const [deadline, setDeadline] = useState<Date>();
	const [deadlineTime, setDeadlineTime] = useState("23:59");
	const [validationErrors, setValidationErrors] = useState({
		title: false,
		maxAttempts: false,
		maxScore: false,
		deadline: false,
	});

	const handleSave = () => {
		const errors = {
			title: !title.trim(),
			maxAttempts: !maxAttempts.trim(),
			maxScore: !maxScore.trim(),
			deadline: !deadline,
		};

		setValidationErrors(errors);

		// If no errors, proceed with save
		if (!Object.values(errors).some(Boolean)) {
			const editor = document.getElementById("editor") as HTMLDivElement | null;
			if (editor && editor.__quill) {
				const quill = editor.__quill as QuillType;
				const content = quill.getContents();
				console.log("Content to save:", content);
			}
		}
	};

	return (
		<div
			className={cn(
				"grid h-auto grid-cols-1 gap-1 p-2 md:gap-2 lg:h-full lg:max-h-[91vh] lg:max-h-full lg:grid-cols-2 lg:overflow-y-hidden",
				{
					"max-w-[calc(100vw-16rem)] lg:max-h-[91vh]": state == "expanded" && !isMobile,
					"md:h-full md:max-h-[91vh] md:max-h-full md:grid-cols-2 md:overflow-y-hidden":
						state != "expanded" && !isMobile,
				},
			)}>
			<Card className="h-auto min-h-[13rem] overflow-y-hidden px-2 py-[8px] lg:h-full lg:max-h-full">
				<Tabs
					value={tabValue}
					onValueChange={(value) => {
						// Save content to localStorage before switching tabs
						if (tabValue === "description") {
							const containerElement = document.querySelector("#editor-bounds .max-w-full") as
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
					<div className="flex w-full flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
						{/* {showSubmissions == false ? (
							<button className="data-[state=active]:bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 rounded-lg w-auto h-auto flex-initial"><NotepadText /> Description</button>
						): ( */}
						<TabsList>
							<TabsTrigger value="description">
								<NotepadText /> Description
							</TabsTrigger>
							{showSubmissions && (
								<TabsTrigger value="submissions">
									<FolderClock />
									Submissions
								</TabsTrigger>
							)}
						</TabsList>
						{/* )} */}

						{tabValue === "description" && (
							<Button variant="secondary" className="w-fit" onClick={handleSave}>
								<Save />
								<span className="sr-only">Save</span>
							</Button>
						)}
					</div>
					<TabsContent
						value="description"
						className="flex h-auto max-h-full w-full flex-1 flex-col overflow-y-auto lg:h-full lg:max-h-full"
						id="editor-bounds">
						{!descriptionReadonly && (
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
						)}
						<div className="flex-1">
							<DescriptionEditor descriptionReadonly={descriptionReadonly} />
						</div>
						<Separator className="my-4" />
						{!descriptionReadonly && (
							<div className="bg-muted/30 mt-auto space-y-4 rounded-lg border p-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="maxAttempts">Max Attempts *</Label>
										<Input
											id="maxAttempts"
											type="number"
											min="1"
											placeholder="e.g. 5"
											value={maxAttempts}
											onChange={(e) => setMaxAttempts(e.target.value)}
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
											value={maxScore}
											onChange={(e) => setMaxScore(e.target.value)}
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
									{validationErrors.deadline && <p className="text-sm text-red-500">Deadline is required</p>}
								</div>
							</div>
						)}
					</TabsContent>
					{showSubmissions && <TabsContent value="submissions" className="w-full"></TabsContent>}
				</Tabs>
			</Card>
			<div className="flex h-full flex-col gap-2">
				<Card
					className={cn(
						"flex flex-col gap-2 px-2 py-[8px] lg:max-h-[60vh] lg:flex-auto lg:flex-grow-[5] lg:overflow-hidden",
						{
							"md:max-h-[60vh] md:flex-auto md:flex-grow-[5] md:overflow-hidden": state != "expanded" && !isMobile,
						},
					)}>
					<div className="flex w-full flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
						<span className="inline-flex w-fit flex-row items-center justify-center gap-1 rounded-md border px-2 py-1 text-sm shadow-sm">
							<CodeXml />
							<span>Code</span>
						</span>
						<Button variant="secondary" className="w-fit" onClick={() => {}}>
							<Play />
							<span className="sr-only">Save</span>
						</Button>
					</div>
					<div className="min-h-0 flex-1 overflow-auto">
						<CodeEditor />
					</div>
				</Card>
				<Card
					className={cn("px-2 py-[8px] lg:max-h-[28.4vh] lg:flex-auto lg:flex-grow-[2] lg:overflow-auto", {
						"px-2 py-[8px] md:max-h-[28.4vh] md:flex-auto md:flex-grow-[2] md:overflow-auto":
							state != "expanded" && !isMobile,
					})}>
					compiler output
				</Card>
			</div>
		</div>
	);
}
