/* eslint-disable @typescript-eslint/require-await */
import { AccountItem, ProblemItem, ProblemItemWithProgress } from "@/lib/types";
import { accounts } from "./dashboard-admin/accounts-columns";
import AdminDashboardWrapper from "./dashboard-admin/admin-dashboard-wrapper";
import { problemsForStudent } from "./dashboard-student/problems-columns";
import StudentDashboardWrapper from "./dashboard-student/student-dashboard-wrapper";
import { problemsForTeacher } from "./dashboard-teacher/problems-columns";
import TeacherDashboardWrapper from "./dashboard-teacher/teacher-dashboard-wrapper";

const role: "student" | "teacher" | "admin" = "student"; // TODO: Replace with actual role logic from authentication/user context

async function getProblemsForStudent(): Promise<ProblemItem[]> {
	// Fetch data from the API here.
	return problemsForStudent;
}

async function getProblemsForTeacher(): Promise<ProblemItemWithProgress[]> {
	// Fetch data from the API here.
	return problemsForTeacher;
}

async function getAccountsForAdmin(): Promise<AccountItem[]> {
	// Fetch data from the API here.
	return accounts;
}

export default async function Page() {
	if (role === "student") {
		const problems = await getProblemsForStudent();
		return <StudentDashboardWrapper problems={problems} />;
	}

	if (role === "teacher") {
		const problems = await getProblemsForTeacher();
		return <TeacherDashboardWrapper problems={problems} />;
	}

	if (role == "admin") {
		const accounts = await getAccountsForAdmin();

		return <AdminDashboardWrapper accounts={accounts} />;
	}
}
