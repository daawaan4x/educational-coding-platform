import { auth } from "@/auth";
import { TRPCContext } from "@/server/context";
import { UserContext } from "@/server/context/user";
import { userService } from "@/server/routers/users";
import { SYSTEM_CONTEXT } from "@/server/trpc";
import { appRouter } from "@/server/trpc-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

async function createUserContext() {
	const session = await auth();
	const user_id = session?.user?.id;
	if (!user_id) return;

	const user = await userService.find({ ctx: SYSTEM_CONTEXT, input: { id: user_id } }).catch(() => undefined);
	if (!user) return;

	return new UserContext(user);
}

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,

		async createContext(): Promise<TRPCContext> {
			return {
				user: await createUserContext(),
			};
		},
	});

export { handler as GET, handler as POST };
