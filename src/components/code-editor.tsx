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

export default function CodeEditor() {
	const [value, setValue] = useState('// Write JavaScript code here\nconsole.log("Hello, CodeMirror!");');

	const handleChange = (val: string) => {
		setValue(val);
	};

	return (
		<CodeMirror
			value={value}
			className="overflow-auto rounded border"
			extensions={[basicSetup, javascript({ jsx: true })]}
			onChange={handleChange}
			theme="light"
			basicSetup={{
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
			}}
		/>
	);
}
