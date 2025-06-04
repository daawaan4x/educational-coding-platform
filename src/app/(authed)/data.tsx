import { CalendarClock, CalendarMinus, CheckCircle, Circle, GraduationCap, Shield, Timer, User } from "lucide-react";

export const deadlineStatuses = [
	{
		value: "due-soon",
		label: "Due Soon",
		icon: CalendarClock,
	},
	{
		value: "overdue",
		label: "Overdue",
		icon: CalendarMinus,
	},
] as const;

export const completionStatuses = [
	{
		value: "Not Started",
		label: "Not Started",
		icon: Circle,
	},
	{
		value: "Partially Completed",
		label: "Partially Completed",
		icon: Timer,
	},
	{
		value: "All Completed",
		label: "All Completed",
		icon: CheckCircle,
	},
];

export const rolesInfo = [
	{
		value: "student",
		label: "Student",
		icon: User,
	},
	{
		value: "teacher",
		label: "Teacher",
		icon: GraduationCap,
	},
	{
		value: "admin",
		label: "Admin",
		icon: Shield,
	},
] as const;
