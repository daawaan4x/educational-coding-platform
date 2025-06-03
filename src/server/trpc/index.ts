import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { TRPCContext } from "./context";

export const t = initTRPC.context<TRPCContext>().create({
	transformer: superjson,
});
