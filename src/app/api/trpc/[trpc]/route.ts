import { auth } from "@/auth";
import { UserService } from "@/server/services/users";
import { appRouter } from "@/server/trpc/app";
import { SYSTEM_CONTEXT } from "@/server/trpc/auth";
import { TRPCContext, UserContext } from "@/server/trpc/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

async function createUserContext() {
	const session = await auth();
	const user_id = session?.user?.id;
	if (!user_id) return;

	const user = await UserService.find({ ctx: SYSTEM_CONTEXT, input: { id: user_id } }).catch(() => undefined);
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
