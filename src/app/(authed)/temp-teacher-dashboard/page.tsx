import { ProblemItemWithProgress } from "@/lib/types";
import { problems } from "./problems-columns";
import TeacherDashboardWrapper from "./teacher-dashboard-wrapper";

async function getProblems(): Promise<ProblemItemWithProgress[]> {
	// Fetch data from the API here.
	return problems;
}

export default async function Page() {
	const problems = await getProblems();

	return <TeacherDashboardWrapper problems={problems} />;
}
