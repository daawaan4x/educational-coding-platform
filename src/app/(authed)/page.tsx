"use client";

import { useAuthStore } from "@/lib/auth/store";
import AdminDashboardWrapper from "./dashboard-admin/admin-dashboard-wrapper";
import StudentDashboardWrapper from "./dashboard-student/student-dashboard-wrapper";
import TeacherDashboardWrapper from "./dashboard-teacher/teacher-dashboard-wrapper";

// async function getProblemsForStudent(): Promise<ProblemItem[]> {
// 	// Fetch data from the API here.
// 	return problemsForStudent;
// }

// async function getProblemsForTeacher(): Promise<ProblemItemWithProgress[]> {
// 	// Fetch data from the API here.
// 	return problemsForTeacher;
// }

// async function getAccountsForAdmin(): Promise<AccountItem[]> {
// 	// Fetch data from the API here.
// 	return accounts;
// }

export default function Page() {
	const { user } = useAuthStore();
	const role = user?.role; // "admin", "teacher", "student"

	if (role === "student") {
		return <StudentDashboardWrapper />;
	}
	if (role === "teacher") {
		return <TeacherDashboardWrapper />;
	}

	if (role == "admin") {
		return <AdminDashboardWrapper />;
	}
}
