"use client";

import Problem from "@/app/(authed)/problem";
import { useAuthStore } from "@/lib/auth/store";
import { useParams } from "next/navigation";

// Remove static import of Quill to avoid SSR issues

export default function Page() {
	const { user } = useAuthStore();
	const params = useParams();
	const problemId = params.problemId as string;

	console.log("Problem ID:", problemId);

	return (
		<Problem
			showSubmissions={true}
			descriptionReadonly={!user ? true : user.role === "teacher" ? false : true}
			problemId={problemId}
		/>
	);
}
