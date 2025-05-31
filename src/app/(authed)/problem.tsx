"use client";

import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hljs from "highlight.js";
import { Save } from "lucide-react";
import type QuillType from "quill";

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
		editorDiv.className = "my-2";
		containerRef.current.appendChild(editorDiv);

		window.hljs = hljs;

		// Add a small delay to ensure DOM is ready
		setTimeout(() => {
			import("quill").then((QuillModule) => {
				const Quill = QuillModule.default;
				if (editorDiv && editorDiv.parentNode && !quillInstanceRef.current) {
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
					console.log("Quill instance created successfully");
				} else {
					console.warn("Failed to create Quill instance - editorDiv not available");
				}
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

	return <div ref={containerRef} className="max-w-full overflow-y-auto" />;
}

export default function Problem({ descriptionReadonly = false, showSubmissions = false }: ProblemProps) {
	const { state, isMobile } = useSidebar();
	const [tabValue, setTabValue] = useState("description");

	return (
		<div
			className={cn("grid h-auto grid-cols-1 gap-2 p-2 lg:h-full lg:max-h-full lg:grid-cols-2 lg:overflow-y-hidden", {
				"max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
				"md:h-full md:max-h-full md:grid-cols-2 md:overflow-y-hidden": state != "expanded" && !isMobile,
			})}>
			<Card className="h-auto min-h-[13rem] overflow-y-hidden px-2 py-[8px] lg:h-full lg:max-h-full">
				<Tabs
					value={tabValue}
					onValueChange={setTabValue}
					className={cn("h-auto w-full lg:h-[calc(100%-3rem)] lg:max-h-full", {
						"h-full lg:h-full": descriptionReadonly,
						"h-full md:h-full lg:h-full": state != "expanded" && !isMobile && descriptionReadonly,
					})}>
					<div className="flex w-full flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
						<TabsList>
							<TabsTrigger value="description">Description</TabsTrigger>
							{showSubmissions && <TabsTrigger value="submissions">Submissions</TabsTrigger>}
						</TabsList>
						{tabValue === "description" && (
							<Button
								variant="secondary"
								className="w-fit"
								onClick={() => {
									const editor = document.getElementById("editor") as HTMLDivElement | null;
									if (editor && editor.__quill) {
										const quill = editor.__quill as QuillType;
										const content = quill.getContents();
										console.log("Content to save:", content);
									}
								}}>
								<Save />
								<span className="sr-only">Save</span>
							</Button>
						)}
					</div>
					<TabsContent value="description" className="h-auto w-full lg:h-full lg:max-h-full" id="editor-bounds">
						<DescriptionEditor descriptionReadonly={descriptionReadonly} />
					</TabsContent>
					{showSubmissions && <TabsContent value="submissions" className="w-full"></TabsContent>}
				</Tabs>
			</Card>
			<div className="grid grid-cols-1 gap-2">
				<Card className="">code editor</Card>
				<Card className="">compiler output</Card>
			</div>
		</div>
	);
}
