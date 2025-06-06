import hljs from "highlight.js";
import type QuillType from "quill";
import type { Delta, Op } from "quill";
import { RefObject, useRef, useState } from "react";

declare global {
	interface HTMLDivElement {
		__quill?: unknown;
	}
	interface Window {
		hljs?: typeof hljs;
	}
}

export function useQuillEditor(containerRef: RefObject<HTMLDivElement | null>) {
	const quillInstanceRef = useRef<QuillType | null>(null);
	const initializationAttempted = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

	const saveContentToLocalStorage = () => {
		console.log("Saving content to localStorage...");
		if (quillInstanceRef.current) {
			const content = quillInstanceRef.current.getContents();
			const serializedContent = JSON.stringify(content);
			localStorage.setItem("quill-editor-content", serializedContent);
		}
	};

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

	const setContent = (content: { ops: Op[] }) => {
		if (quillInstanceRef.current) {
			quillInstanceRef.current.setContents(content.ops);
		}
	};

	const getContent = (): Delta | Op[] | null => {
		return quillInstanceRef.current?.getContents() ?? null;
	};

	const initializeEditor = async (descriptionReadonly: boolean) => {
		if (!containerRef.current || initializationAttempted.current) return;

		setIsLoading(true);
		initializationAttempted.current = true;

		try {
			// Clean up previous instance if it exists
			if (quillInstanceRef.current) {
				quillInstanceRef.current = null;
			}

			// Clear the container completely
			if (containerRef.current) {
				containerRef.current.innerHTML = "";

				// Create a new editor div inside the container
				const editorDiv = document.createElement("div");
				editorDiv.id = "editor";
				editorDiv.className = "my-2 max-h-full overflow-y-auto flex-1";
				containerRef.current.appendChild(editorDiv);

				window.hljs = hljs;

				// Double-check that the editorDiv still exists and is connected
				if (!editorDiv?.parentNode || !containerRef.current?.contains(editorDiv)) {
					console.warn("Editor div was removed before Quill could initialize");
					return;
				}

				const QuillModule = await import("quill");
				const Quill = QuillModule.default;

				// Final check before creating Quill instance
				if (editorDiv?.parentNode && !quillInstanceRef.current && containerRef.current?.contains(editorDiv)) {
					console.log("Creating new Quill instance...");
					quillInstanceRef.current = new Quill(editorDiv, {
						readOnly: descriptionReadonly,
						modules: {
							syntax: true,
							toolbar: !descriptionReadonly
								? [
										["bold", "italic", "underline", "strike", "code", { script: "sub" }, { script: "super" }],
										["blockquote", "code-block"],
										[{ header: 1 }, { header: 2 }, { header: 3 }],
										[{ color: [] }, { background: [] }],
										[{ list: "ordered" }, { list: "bullet" }],
										[{ align: [] }, { indent: "-1" }, { indent: "+1" }],
										["link", "image", "video", "formula"],
									]
								: false,
						},
						placeholder: "Start typing here...",
						theme: "snow",
						bounds: "#editor-bounds",
					});

					// Store reference on the DOM element for the save button
					editorDiv.__quill = quillInstanceRef.current;
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

	const cleanup = () => {
		if (containerRef.current) {
			containerRef.current.innerHTML = "";
		}
		quillInstanceRef.current = null;
		initializationAttempted.current = false;
	};

	return {
		quillInstanceRef,
		isLoading,
		setIsLoading,
		saveContentToLocalStorage,
		loadContentFromLocalStorage,
		setContent,
		getContent,
		initializeEditor,
		cleanup,
	};
}
