export type UserRoleString = "admin" | "teacher" | "student";

export interface AccountItem {
	firstName: string;
	lastName: string;
	email: string;
	dateCreated: Date;
	dateModified: Date;
	roles: UserRoleString[];
	classes?: string[];
}

export interface ProblemItem {
	dateCreated: Date;
	dateModified: Date;
	deadline: Date;
	title: string;
	class: string;
}

export interface ProblemItemStudent {
	dateCreated: Date;
	dateModified: Date;
	deadline: Date;
	title: string;
	score: number;
	maxScore: number;
	submitted: boolean;
	attempts: number;
	maxAttempts: number;
}

export interface ProblemItemWithProgress extends ProblemItem {
	studentsCompleted: number;
	totalStudents: number;
}

export type ProblemItemVariable = ProblemItemWithProgress | ProblemItemStudent;

export interface ClassItem {
	name: string;
	dateCreated: Date;
	dateModified: Date;
}

export interface ParticipantItem {
	firstName: string;
	lastName: string;
	email: string;
	roles: UserRoleString[];
}
