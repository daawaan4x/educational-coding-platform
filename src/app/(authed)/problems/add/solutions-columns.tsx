"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountItem, SolutionItem } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type solutionStatus = "accepted" | "wrong-answer";

export const solutions: SolutionItem[] = [
	{
		id: "b1d2a7c1-45ea-4b8d-9b3c-8f3e3a2b1c01",
		problemId: "f3c1a8d9-5a2e-47c8-93b1-2c62e8d5e872",
		authorId: "a9b2e7f5-c8e3-4ad0-8890-5f7c9e3e71d3",
		dateCreated: new Date("2025-01-10T09:30:00Z"),
		score: 85,
		attempt: 1,
		code: "function sum(a, b) { return a + b; }",
		feedback: "Good use of function syntax. Consider edge cases.",
		status: "accepted",
	},
	{
		id: "3a924fa5-bdd1-4d13-945f-0c1e2e7b9aa2",
		problemId: "d2b84f13-832f-42fa-912d-3b5096c4b7df",
		authorId: "b42efbf0-2b70-4f93-bc8f-8d2d92f30b99",
		dateCreated: new Date("2025-01-11T13:45:00Z"),
		score: 72,
		attempt: 2,
		code: "let result = arr.filter(x => x > 10);",
		feedback: "Efficient filtering, but clarify variable types.",
		status: "wrong-answer",
	},
	{
		id: "77e2c3b1-dbb1-4317-8a02-228e1d26319e",
		problemId: "8f4a10e7-5b4c-4c70-a145-3d328f92811e",
		authorId: "ef7a4a25-684f-4de9-89f1-90b2a2a61719",
		dateCreated: new Date("2025-01-12T08:00:00Z"),
		score: 93,
		attempt: 1,
		code: "const max = Math.max(...numbers);",
		feedback: "Well optimized for performance.",
		status: "accepted",
	},
	{
		id: "157efc29-5cd0-45cc-a5e3-e1dc3ea0df02",
		problemId: "ab1c9fa6-3c44-46d7-a0dc-e90b1d46ff5e",
		authorId: "4ccf720f-1c2d-4a0b-bb92-f64f135e5a02",
		dateCreated: new Date("2025-01-12T17:20:00Z"),
		score: 60,
		attempt: 3,
		code: "for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }",
		feedback: "Try using array methods like forEach.",
		status: "wrong-answer",
	},
	{
		id: "9c6f7d27-1f4c-4a6e-b711-7a3c6717a302",
		problemId: "c03f3b13-8ef5-456d-a8ae-fd1a5b6a2ac7",
		authorId: "d7217b18-3275-4b91-841a-b0df0c214109",
		dateCreated: new Date("2025-01-13T11:10:00Z"),
		score: 100,
		attempt: 1,
		code: "return input === input.split('').reverse().join('');",
		feedback: "Excellent one-liner for palindrome check.",
		status: "accepted",
	},
];

export const solutionsColumns: ColumnDef<SolutionItem>[] = [
	{
		accessorKey: "attempt",
		header: "",
	},
];
