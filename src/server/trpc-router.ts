import { classesRouter } from "./routers/classes";
import { problemsRouter } from "./routers/problems";
import { solutionsRouter } from "./routers/solutions";
import { usersRouter } from "./routers/users";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
	ping: publicProcedure.query(() => "pong"),

	users: usersRouter,
	classes: classesRouter,
	problems: problemsRouter,
	solutions: solutionsRouter,
});

export type AppRouter = typeof appRouter;
