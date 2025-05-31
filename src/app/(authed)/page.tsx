import { ProblemItem } from "@/lib/types";
import { problems } from "./problems-columns";
import StudentDashboardWrapper from "./student-dashboard-wrapper";

async function getProblems(): Promise<ProblemItem[]> {
	// Fetch data from the API here.
	return problems;
}

export default async function Page() {
	const problems = await getProblems();

	return <StudentDashboardWrapper problems={problems} />;
}
