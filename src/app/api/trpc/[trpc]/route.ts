import { TRPCContext } from "@/server/context";
import { UserContext } from "@/server/context/user";
import { appRouter } from "@/server/trpc-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		createContext: (opts) => {
			return {
				// TODO: Replace with real implementation
				user: new UserContext({
					id: "",
					date_created: new Date(),
					date_modified: new Date(),
					email: "",
					first_name: "",
					last_name: "",
					role: null,
					is_deleted: false,
				}),
			} as TRPCContext;
		},
	});

export { handler as GET, handler as POST };
