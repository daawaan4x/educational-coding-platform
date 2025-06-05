"use client";

import Problem from "@/app/(authed)/problem";
import { useParams } from "next/navigation";

// Remove static import of Quill to avoid SSR issues

export default function Page() {
	const params = useParams();
	const problemId = params["problems-id"] as string;

	console.log("Problem ID:", problemId);

	return <Problem showSubmissions={true} descriptionReadonly={false} problemId={problemId} />;
}
