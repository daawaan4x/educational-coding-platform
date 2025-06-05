"use client";

import Problem from "@/app/(authed)/problem";

export default function Page() {
	// No problemId provided - start with clean state
	return <Problem showSubmissions={false} descriptionReadonly={false} />;
}
