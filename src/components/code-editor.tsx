"use client";

// Mark as client component for Next.js App Router
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
import dynamic from "next/dynamic";
import { useState } from "react";

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
}: {
	language: string;
	placeholder?: string;
	className?: string;
}) {
	const placholder =
		language == "javascript"
			? `// Write JavaScript code here\nconsole.log("Hello, CodeMirror!");`
			: placeholder
				? placeholder
				: `// Write ${language} code here`;
	const [value, setValue] = useState(placholder);
	className = className ? classNameDefault + " " + className : classNameDefault;

	const handleChange = (val: string) => {
		setValue(val);
	};
	if (language == "javascript") {
		return (
			<CodeMirror
				value={value}
				className={className}
				extensions={[basicSetup, javascript({ jsx: true })]}
				onChange={handleChange}
				theme={theme}
				basicSetup={basicSetupOptions}
			/>
		);
	} else if (language == "plain") {
		return (
			<CodeMirror
				value={value}
				className={className}
				extensions={[basicSetup]}
				onChange={handleChange}
				theme={theme}
				basicSetup={basicSetupOptions}
			/>
		);
	} else {
		return <div className="text-red-500">Unsupported language: {language}</div>;
	}
}
