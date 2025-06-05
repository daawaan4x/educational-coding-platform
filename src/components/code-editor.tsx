/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { Language } from "@/lib/languages";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
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

const languageExtensions = {
	c: [cpp()],
	cpp: [cpp()],
	java: [java()],
	php: [php()],
	py: [python()],
	js: [javascript()],
	ts: [javascript({ typescript: true })],
	plain: [],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<Language | "plain", any>;

export default function CodeEditor({
	language = "plain",
	className,
	value,
	onChange,
	readOnly = false,
}: {
	language: Language | "plain";
	placeholder?: string;
	className?: string;
	value?: string;
	onChange?: (value: string) => void;
	readOnly?: boolean;
}) {
	const [internalCode, setInternalCode] = useState(value);

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

	const extensions = [basicSetup, indentUnit.of("    "), ...(languageExtensions[language] ?? [])];
	return (
		<CodeMirror
			value={currentValue}
			className={className}
			extensions={extensions}
			onChange={handleChange}
			theme={theme}
			basicSetup={basicSetupOptions}
			readOnly={readOnly}
		/>
	);
}
