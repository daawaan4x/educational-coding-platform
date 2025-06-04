import { CalendarClock, CalendarMinus, CheckCircle, Circle, Timer } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";

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
	{ value: "student", label: "Student", icon: <PiStudentBold /> },
	{ value: "teacher", label: "Teacher", icon: <FaChalkboardTeacher /> },
	{ value: "admin", label: "Admin", icon: <RiAdminLine /> },
];
