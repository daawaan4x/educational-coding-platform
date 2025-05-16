import { procedure, router } from "./trpc";

export const appRouter = router({
	ping: procedure.query(() => "pong"),
});

export type AppRouter = typeof appRouter;
