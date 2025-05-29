import { t } from ".";
import { ClassService } from "../services/classes";
import { ProblemService } from "../services/problems";
import { SolutionService } from "../services/solutions";
import { UserService } from "../services/users";

export const appRouter = t.router({
	ping: t.procedure.query(() => "pong"),

	users: UserService.routers,
	classes: ClassService.routers,
	problems: ProblemService.routers,
	solutions: SolutionService.routers,
});

export type AppRouter = typeof appRouter;
