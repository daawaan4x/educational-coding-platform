import { initTRPC } from "@trpc/server";
import { TRPCContext } from "./context";

export const t = initTRPC.context<TRPCContext>().create();
