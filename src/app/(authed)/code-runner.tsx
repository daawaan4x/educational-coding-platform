/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import BanterLoad from "@/components/banter-load";
import CodeEditor from "@/components/code-editor";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStateProp } from "@/hooks/use-state-prop";
import { Language, languageLabels, languages, languageTemplates } from "@/lib/languages";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { CodeXml, Play, Terminal, TextCursorInput, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CodeRunner({
	language: languageProp = "js",
	onLanguageChange,
	code: codeProp = "",
	onCodeChange,
	enableSubmit = false,
	onSubmitCode,
}: {
	language?: Language;
	onLanguageChange?: (language: Language) => void;
	code?: string;
	onCodeChange?: (code: string) => void;
	enableSubmit?: boolean;
	onSubmitCode?: () => void;
}) {
	const { state, isMobile } = useSidebar();

	const [code, setCode] = useStateProp(codeProp, onCodeChange);
	const [language, setLanguage] = useStateProp(languageProp, onLanguageChange);

	const [isFresh, setIsFresh] = useState(true);
	const initialCodeRef = useRef(code);

	// When language changes, reset code only if fresh
	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_JUDGE0) return;
		const template = languageTemplates[language];
		if (isFresh) {
			setCode(template);
			initialCodeRef.current = template;
		}
	}, [language]);

	// When user types, check if code is no longer fresh
	useEffect(() => {
		setIsFresh(code === "" || code === initialCodeRef.current);
	}, [code]);

	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");

	const [IOTabValue, setIOTabValue] = useState("input");

	const evalRunner = () => {
		let output = "";

		const log = console.log;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		console.log = (...data: any[]) => {
			output += data.map(String).join(" ");
		};

		try {
			const fncode = `(function() { ${code} return typeof main === 'function' ? main : null; })()`;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const fn = eval(fncode);
			if (typeof fn !== "function") throw new Error("No 'main' function found in provided code.");
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
			const result = fn(input);
			if (result != undefined) output += JSON.stringify(result);
		} catch (error) {
			if (error instanceof Error) output += `${error.name}: ${error.message} - ${error.stack}`;
			else output += String(error);
		}

		console.log = log;
		setOutput(output);
	};

	const codeRunnerMutation = trpc.codeRunner.run.useMutation({
		onSuccess(data) {
			if (data.type == "success") setOutput(data.stdout ?? data.compile_output ?? data.stderr ?? data.message ?? "");
			else if (data.type == "error") setOutput(data.error);
			else setOutput(data.value);
		},
	});
	const codeRunner = () => {
		codeRunnerMutation.mutate({
			language: language,
			source_code: code,
			stdin: input,
		});
	};

	const onRunCode = () => {
		if (process.env.NEXT_PUBLIC_JUDGE0) codeRunner();
		else evalRunner();
	};

	return (
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
						{process.env.NEXT_PUBLIC_JUDGE0 && (
							<Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{languages.map((language) => (
										<SelectItem key={language} value={language}>
											{languageLabels[language]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
						{onSubmitCode && (
							<Tooltip>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<TooltipTrigger asChild>
											<Button variant="secondary" className="w-fit" disabled={!enableSubmit}>
												<Upload />
												<span className="sr-only">Submit Code</span>
											</Button>
										</TooltipTrigger>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Submit Solution</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to submit your solution? This will be recorded as an official submission.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={() => onSubmitCode?.()} disabled={!enableSubmit}>
												Submit
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								<TooltipContent>
									<p>Submit Code</p>
								</TooltipContent>
							</Tooltip>
						)}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="secondary"
									className="w-fit"
									onClick={() => {
										setIOTabValue("output");
										onRunCode();
									}}>
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
				<CodeEditor language={language} value={code} onChange={setCode} className="h-full min-h-0" />
			</Card>

			{/* Input / Output Card */}
			<Card
				className={cn(
					"min-h-[15rem] w-full px-2 py-[8px] lg:max-h-[28.4vh] lg:min-h-auto lg:flex-auto lg:flex-grow-[2]",
					{
						"px-2 py-[8px] md:max-h-[28.4vh] md:min-h-auto md:flex-auto md:flex-grow-[2]":
							state != "expanded" && !isMobile,
					},
				)}>
				<Tabs value={IOTabValue} onValueChange={setIOTabValue} className="flex h-full w-full">
					<TabsList>
						<TabsTrigger value="input">
							<TextCursorInput /> Input
						</TabsTrigger>
						<TabsTrigger value="output">
							<Terminal /> Output
						</TabsTrigger>
					</TabsList>

					<TabsContent value="input" className="overflow-auto">
						<CodeEditor language="plain" value={input} onChange={setInput} className="h-full min-h-0" />
					</TabsContent>
					<TabsContent value="output" className="overflow-auto">
						{codeRunnerMutation.isPending ? (
							<div className="flex h-full w-full items-center justify-center rounded-sm border">
								<BanterLoad />
							</div>
						) : !output ? (
							<div className="flex h-full w-full items-center justify-center">
								<p className="text-muted-foreground">No output yet. Run your code to see the output.</p>
							</div>
						) : (
							<div className="h-full overflow-auto rounded-sm border p-2 text-xs">
								<pre>{output}</pre>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}
