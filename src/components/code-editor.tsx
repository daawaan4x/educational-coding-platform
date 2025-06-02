/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

// Mark as client component for Next.js App Router
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import CodeMirror to avoid SSR
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
	ssr: false,
});

const classNameDefault = "overflow-auto rounded border";
const theme = "light"; // You can change this to 'dark' if needed
const basicSetupOptions = {
	lineNumbers: true,
	foldGutter: true,
	dropCursor: false,
	allowMultipleSelections: false,
	indentOnInput: true,
	bracketMatching: true,
	closeBrackets: true,
	autocompletion: true,
	highlightSelectionMatches: false,
	searchKeymap: true,
};

export default function CodeEditor({
	language = "plain",
	placeholder,
	className,
	value,
	onChange,
	readOnly = false,
}: {
	language: string;
	placeholder?: string;
	className?: string;
	value?: string;
	onChange?: (value: string) => void;
	readOnly?: boolean;
}) {
	const defaultPlaceholder =
		language == "javascript"
			? `// Write JavaScript code here\nconsole.log("Hello, Mighty!");`
			: placeholder
				? placeholder
				: `// Write ${language} code here`;

	const [internalCode, setInternalCode] = useState(value || defaultPlaceholder);

	// Use controlled value if provided, otherwise use internal state
	const currentValue = value !== undefined ? value : internalCode;

	// Update internal state when value prop changes
	useEffect(() => {
		if (value !== undefined) {
			setInternalCode(value);
		}
	}, [value]);

	className = className ? classNameDefault + " " + className : classNameDefault;

	const handleChange = (val: string) => {
		if (!readOnly) {
			// Update internal state if not controlled
			if (value === undefined) {
				setInternalCode(val);
			}
			// Always call onChange if provided
			onChange?.(val);
		}
	};

	if (language == "javascript") {
		return (
			<CodeMirror
				value={currentValue}
				className={className}
				extensions={[basicSetup, javascript({ jsx: true })]}
				onChange={handleChange}
				theme={theme}
				basicSetup={basicSetupOptions}
				readOnly={readOnly}
			/>
		);
	} else if (language == "plain") {
		return (
			<CodeMirror
				value={currentValue}
				className={className}
				extensions={[basicSetup]}
				onChange={handleChange}
				theme={theme}
				basicSetup={basicSetupOptions}
				readOnly={readOnly}
			/>
		);
	} else {
		return <div className="text-red-500">Unsupported language: {language}</div>;
	}
}
