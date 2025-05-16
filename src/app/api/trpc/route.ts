import { appRouter } from "@/server/trpc-router";
import { NextResponse } from "next/server";
import { renderTrpcPanel } from "trpc-ui";

export function GET() {
	if (process.env.NODE_ENV != "development") return new NextResponse(undefined, { status: 404 });

	return new NextResponse(
		renderTrpcPanel(appRouter, {
			url: "/api/trpc",
		}),
		{
			headers: {
				"content-type": "text/html",
			},
		},
	);
}
