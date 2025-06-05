/* eslint-disable react-hooks/exhaustive-deps */
import BanterLoader from "@/components/banter-load";
import { Input } from "@/components/ui/input";
import { useProblemData } from "@/hooks/useProblemData";
import { useProblemEditor } from "@/hooks/useProblemEditor";
import { useQuillEditor } from "@/hooks/useQuillEditor";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import type { Delta, Op } from "quill";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ProblemFormFields } from "./form-fields/problem-form-fields";

interface DescriptionEditorProps {
	problemId?: string; // Make optional to support clean state
	maxScore: number;
	setMaxScore: (score: number) => void;
	maxAttempts: number;
	setMaxAttempts: (attempts: number) => void;
	isFirstRender: React.MutableRefObject<boolean>;
	descriptionReadonly?: boolean;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
}

export function DescriptionEditor({
	problemId,
	maxScore,
	setMaxScore,
	maxAttempts,
	setMaxAttempts,
	isFirstRender,
	descriptionReadonly = false,
	isLoading,
	setIsLoading,
}: DescriptionEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const problemForm = useProblemEditor();
	const quillEditor = useQuillEditor(containerRef);

	// Add class selection state
	const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
	const [selectedClassName, setSelectedClassName] = useState<string | undefined>();

	// Add touched state for form validation
	const [touchedState, setTouchedState] = useState({
		title: false,
		maxAttempts: false,
		maxScore: false,
		deadline: false,
		classId: false,
	});

	// Fetch problem data if problemId is provided
	const { problemData, isLoading: isProblemLoading, error, hasProblemId } = useProblemData(problemId);

	console.log("problemData:", problemData);

	// Add TRPC mutation for creating problems
	const createProblemMutation = trpc.problems.create.useMutation();
	// Add TRPC mutation for updating problems
	const updateProblemMutation = trpc.problems.update.useMutation();
	const utils = trpc.useUtils();

	// Save form data to localStorage
	const saveFormDataToLocalStorage = () => {
		console.log("Saving form data to localStorage...");
		const formData = {
			title: problemForm.title,
			maxScore,
			maxAttempts,
			deadline: problemForm.deadline?.toISOString(),
			deadlineTime: problemForm.deadlineTime,
			selectedClassId,
			selectedClassName,
		};
		localStorage.setItem("quill-editor-form-data", JSON.stringify(formData));
	};

	// Load form data from localStorage
	const loadFormDataFromLocalStorage = () => {
		console.log("Loading form data from localStorage...");
		const savedFormData = localStorage.getItem("quill-editor-form-data");
		if (savedFormData) {
			try {
				const parsedData = JSON.parse(savedFormData) as {
					title: string;
					maxScore: number;
					maxAttempts: number;
					deadline?: string;
					deadlineTime?: string;
					selectedClassId?: string;
					selectedClassName?: string;
				};
				problemForm.setTitle(parsedData.title || "");
				setMaxScore(parsedData.maxScore || 0);
				setMaxAttempts(parsedData.maxAttempts || 0);
				setSelectedClassId(parsedData.selectedClassId);
				setSelectedClassName(parsedData.selectedClassName);
				if (parsedData.deadline) {
					problemForm.setDeadline(new Date(parsedData.deadline));
					problemForm.setDeadlineTime(parsedData.deadlineTime ?? "23:59");
				}
			} catch (error) {
				console.warn("Failed to parse saved form data:", error);
			}
		}
	};

	// Load problem data to inputs from API
	const loadProblemData = () => {
		if (!problemData) return;

		console.log("Loading problem data:", problemData);

		// Set form fields
		problemForm.setTitle(problemData.name || "");
		setMaxScore(problemData.max_score || 0);
		setMaxAttempts(problemData.max_attempt || 0);

		if (problemData.deadline) {
			const deadline = new Date(problemData.deadline);
			problemForm.setDeadline(deadline);
			// Extract time from deadline
			const hours = deadline.getHours().toString().padStart(2, "0");
			const minutes = deadline.getMinutes().toString().padStart(2, "0");
			problemForm.setDeadlineTime(`${hours}:${minutes}`);
		}

		// Set class information
		if (problemData.class) {
			setSelectedClassId(problemData.class.id);
			setSelectedClassName(problemData.class.name);
		}

		// Load description content into Quill editor
		if (problemData.description) {
			try {
				const content = JSON.parse(problemData.description) as unknown;
				// Validate that the parsed content has the expected structure
				if (
					content &&
					typeof content === "object" &&
					"ops" in content &&
					Array.isArray((content as { ops: unknown }).ops)
				) {
					quillEditor.setContent(content as { ops: Op[] });
				} else {
					// If structure is invalid, treat as plain text
					quillEditor.setContent({ ops: [{ insert: problemData.description }] });
				}
			} catch (error) {
				console.warn("Failed to parse problem description as JSON, treating as plain text:", error);
				quillEditor.setContent({ ops: [{ insert: problemData.description }] });
			}
		}
	};

	// Handle class selection
	const handleClassSelect = (classId: string, className: string) => {
		setSelectedClassId(classId);
		setSelectedClassName(className);
	};

	// Updated save to database function with actual TRPC call
	const saveToDatabase = async (data: {
		title: string;
		maxScore: number;
		maxAttempts: number;
		deadline: Date;
		content: Delta | Op[];
		classId: string;
	}) => {
		console.log("Saving to database:", data);

		try {
			// Convert Quill Delta to JSON string for storage
			const descriptionContent = JSON.stringify(data.content);

			let result;
			if (problemId) {
				// Update existing problem
				result = await updateProblemMutation.mutateAsync({
					id: problemId,
					data: {
						name: data.title,
						description: descriptionContent,
						max_score: data.maxScore,
						max_attempts: data.maxAttempts,
						deadline: data.deadline,
					},
				});
				toast.success("Problem updated successfully!");
			} else {
				// Create new problem
				result = await createProblemMutation.mutateAsync({
					data: {
						name: data.title,
						description: descriptionContent,
						max_score: data.maxScore,
						max_attempts: data.maxAttempts,
						deadline: data.deadline,
						class_id: data.classId,
					},
				});
				toast.success("Problem saved successfully!");
			}

			console.log("Problem saved:", result);

			// Invalidate problems list to refresh any cached data
			await utils.problems.list.invalidate();

			// Redirect to home page after successful save
			window.location.href = "/";

			return result;
		} catch (error) {
			console.error("Failed to save problem:", error);
			toast.error("Failed to save problem. Please try again.");
			throw error;
		}
	};

	// Handle save functionality with improved validation
	const handleSave = async () => {
		console.log("handleSave called");
		console.log("Selected class ID:", selectedClassId);
		console.log("Selected class name:", selectedClassName);

		// // Validate form data including class selection
		// if (!problemForm.validateForm(maxScore, maxAttempts, selectedClassId, problemForm.deadline?.toISOString())) {
		// 	toast.error("Please fill in all required fields");
		// 	return;
		// }

		const content = quillEditor.getContent();

		// Check if content exists before saving
		if (!content) {
			toast.error("Problem description cannot be empty");
			return;
		}

		// Additional validation for required fields
		if (!problemForm.title.trim()) {
			toast.error("Problem title is required");
			return;
		}

		if (!selectedClassId || selectedClassId.trim() === "") {
			toast.error("Please select a class for this problem");
			return;
		}

		// Validate UUID format
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(selectedClassId)) {
			console.error("Invalid class ID format:", selectedClassId);
			toast.error("Invalid class selected. Please select a valid class.");
			return;
		}

		if (maxScore <= 0) {
			toast.error("Max score must be greater than 0");
			return;
		}

		if (maxAttempts <= 0) {
			toast.error("Max attempts must be greater than 0");
			return;
		}

		if (!problemForm.deadline) {
			toast.error("Deadline is required");
			return;
		}

		try {
			// Show loading toast
			toast.loading("Saving problem...", { id: "save-problem" });

			// Combine date and time for database save
			const [hours, minutes] = problemForm.deadlineTime.split(":").map(Number);
			const combinedDeadline = new Date(problemForm.deadline);
			combinedDeadline.setHours(hours, minutes, 0, 0);

			// Validate that deadline is in the future
			if (combinedDeadline <= new Date()) {
				toast.error("Deadline must be in the future", { id: "save-problem" });
				return;
			}

			const saveData = {
				title: problemForm.title,
				maxScore,
				maxAttempts,
				deadline: combinedDeadline,
				content,
				classId: selectedClassId,
			};

			console.log("Save data being sent:", saveData);

			// Save to localStorage first for backup
			saveToLocalStorage();

			// Save to database
			await saveToDatabase(saveData);

			// Clear localStorage after successful save
			localStorage.removeItem("quill-editor-content");
			localStorage.removeItem("quill-editor-form-data");

			toast.success("Problem saved successfully!", { id: "save-problem" });
			console.log("Content saved successfully");
		} catch (error) {
			console.error("Error saving problem:", error);
			// Keep localStorage data if save fails
			toast.error("Failed to save problem", { id: "save-problem" });
		}
	};

	// Save to localStorage only (for tab switching and drafts)
	const saveToLocalStorage = () => {
		console.log("Saving to localStorage...");
		quillEditor.saveContentToLocalStorage();
		saveFormDataToLocalStorage();
	};

	// Expose save functions to parent component
	useEffect(() => {
		// Store the save function on the container for external access
		if (containerRef.current) {
			(
				containerRef.current as HTMLDivElement & {
					saveContent?: () => void;
					saveToLocalStorage?: () => void;
				}
			).saveContent = () => {
				void handleSave();
			};
			(
				containerRef.current as HTMLDivElement & {
					saveContent?: () => void;
					saveToLocalStorage?: () => void;
				}
			).saveToLocalStorage = () => {
				saveToLocalStorage();
			};
		}

		// Also store it on the editor bounds element for the save button and tab switching
		const editorBounds = document.getElementById("editor-bounds");
		if (editorBounds) {
			(
				editorBounds as HTMLElement & {
					saveContent?: () => void;
					saveToLocalStorage?: () => void;
				}
			).saveContent = () => {
				void handleSave();
			};
			(
				editorBounds as HTMLElement & {
					saveContent?: () => void;
					saveToLocalStorage?: () => void;
				}
			).saveToLocalStorage = () => {
				saveToLocalStorage();
			};
		}

		// Also store it on any element with the class for broader access
		const editorContainer = containerRef.current;
		if (editorContainer) {
			// Find the parent TabsContent element and attach the functions there too
			const tabsContent = editorContainer.closest('[data-state="active"]');
			if (tabsContent) {
				(
					tabsContent as HTMLElement & {
						saveContent?: () => void;
						saveToLocalStorage?: () => void;
					}
				).saveContent = () => {
					void handleSave();
				};
				(
					tabsContent as HTMLElement & {
						saveContent?: () => void;
						saveToLocalStorage?: () => void;
					}
				).saveToLocalStorage = () => {
					saveToLocalStorage();
				};
			}
		}
	}, [problemForm.title, maxScore, maxAttempts, problemForm.deadline, problemForm.deadlineTime, selectedClassId]);

	// Initialize editor with data based on scenario
	const initializeEditorData = async () => {
		await quillEditor.initializeEditor();

		if (isFirstRender.current) {
			// Only clear localStorage on the very first render
			console.log("First render: clearing localStorage for fresh start");
			localStorage.removeItem("quill-editor-content");
			localStorage.removeItem("quill-editor-form-data");

			if (hasProblemId && problemData) {
				// Scenario 1: problemId provided and data is available - load from API
				console.log("Loading problem data from API for problemId:", problemId);
				loadProblemData();
				isFirstRender.current = false;
			} else if (!hasProblemId) {
				// Scenario 2: no problemId - start with clean state
				console.log("No problemId provided - starting with clean state");
				problemForm.resetForm();
				setMaxScore(0);
				setMaxAttempts(0);
				setSelectedClassId(undefined);
				setSelectedClassName(undefined);
				isFirstRender.current = false;
			}
			// If problemId provided but data not loaded yet, we wait for the effect below
		} else {
			// Subsequent renders: load from localStorage only (don't clear it)
			console.log("Subsequent render: loading from localStorage without clearing");
			loadFormDataFromLocalStorage();
			quillEditor.loadContentFromLocalStorage();
		}
	};

	// Effect to initialize editor
	useEffect(() => {
		void initializeEditorData();

		return () => {
			quillEditor.cleanup();
		};
	}, []);

	// Effect to load problem data when it becomes available
	useEffect(() => {
		if (isFirstRender.current && hasProblemId && problemData && !isProblemLoading) {
			console.log("Problem data loaded, initializing editor with API data");
			loadProblemData();
			isFirstRender.current = false;
		}
	}, [problemData, isProblemLoading, hasProblemId]);

	// Sync loading state (combine quill loading and problem data loading)
	useEffect(() => {
		const totalLoading = quillEditor.isLoading || (hasProblemId && isProblemLoading);
		setIsLoading(totalLoading);
	}, [quillEditor.isLoading, isProblemLoading, hasProblemId, setIsLoading]);

	// Handle API errors
	useEffect(() => {
		if (error) {
			console.error("Failed to load problem data:", error);
			// Optionally show error toast or handle error state
		}
	}, [error]);

	return (
		<div className="relative flex h-full max-h-full max-w-full flex-col gap-2 overflow-y-auto" data-description-editor>
			{/* Title Section */}
			{isLoading ? (
				""
			) : !descriptionReadonly ? (
				<>
					<Input
						id="title"
						placeholder="Title..."
						value={problemForm.title}
						onChange={(e) => problemForm.setTitle(e.target.value)}
						className={cn(
							"placeholder:text-muted-foreground mb-2 h-auto scroll-mt-20 border-none bg-transparent px-0 py-0 text-[2.5rem] leading-[3rem] font-extrabold tracking-[-0.025em] shadow-none placeholder:text-[2.5rem] focus-visible:ring-0 focus-visible:ring-offset-0",
							{ "border-red-500": problemForm.validationErrors.title },
						)}
						style={{ fontSize: "2.5rem" }}
						required
					/>
					{problemForm.validationErrors.title && <p className="mb-4 text-sm text-red-500">Title is required</p>}
				</>
			) : (
				<h1 className="mb-2 h-auto scroll-mt-20 border-none bg-transparent px-3 py-0 text-[2.5rem] leading-[3rem] font-extrabold tracking-[-0.025em]">
					{problemForm.title || <span className="text-muted-foreground">Loading title...</span>}
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
			{!isLoading && (
				<ProblemFormFields
					maxScore={maxScore}
					setMaxScore={setMaxScore}
					maxAttempts={maxAttempts}
					setMaxAttempts={setMaxAttempts}
					deadline={problemForm.deadline}
					setDeadline={problemForm.setDeadline}
					deadlineTime={problemForm.deadlineTime}
					setDeadlineTime={problemForm.setDeadlineTime}
					selectedClassId={selectedClassId}
					selectedClassName={selectedClassName}
					onClassSelect={handleClassSelect}
					validationErrors={{
						...problemForm.validationErrors,
						classId: !selectedClassId,
						maxAttempts: maxAttempts <= 0,
					}}
					readonly={descriptionReadonly}
					touchedState={touchedState}
				/>
			)}
		</div>
	);
}
