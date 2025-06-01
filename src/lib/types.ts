export type UserRoleString = "admin" | "teacher" | "student";

export interface AccountItem {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	dateCreated: Date;
	dateModified: Date;
	roles: UserRoleString[];
	classes?: string[];
}

export interface ProblemItem {
	id: string;
	dateCreated: Date;
	dateModified: Date;
	deadline: Date;
	title: string;
	class: string;
}

export interface ProblemItemStudent {
	id: string;
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
	id: string;
	studentsCompleted: number;
	totalStudents: number;
}

export type ProblemItemVariable = ProblemItemWithProgress | ProblemItemStudent;

export interface ClassItem {
	id: string;
	name: string;
	dateCreated: Date;
	dateModified: Date;
}

export interface ParticipantItem {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	roles: UserRoleString[];
}

export interface SolutionItem {
	id: string;
}
