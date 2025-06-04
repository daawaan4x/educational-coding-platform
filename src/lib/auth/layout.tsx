"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { trpc } from "../trpc";
import { useAuthStore } from "./store";

function AuthedLayoutInner({ children, Loading }: { children: React.ReactNode; Loading: React.ReactNode }) {
	const { data: session, status } = useSession();
	const { user, setUser } = useAuthStore();

	// Only query user data if we have a session
	const userQuery = trpc.users.find.useQuery(
		{},
		{
			enabled: !!session?.user?.id,
		},
	);

	// Set user in store when userQuery succeeds
	useEffect(() => {
		if (userQuery.data) {
			setUser(userQuery.data);
		}
	}, [userQuery.data, setUser]);

	// Redirect to login if not authenticated
	useEffect(() => {
		if (status === "unauthenticated") {
			window.location.href = "/auth/login";
		}
	}, [status]);

	// Show loading while session is loading or user data is loading
	if (status === "loading" || (session && !user && userQuery.isLoading)) {
		return <>{Loading}</>;
	}

	// Redirect if no session
	if (!session) {
		return <>{Loading}</>;
	}

	// Show loading if we have session but no user data yet
	if (!user) {
		return <>{Loading}</>;
	}

	return <>{children}</>;
}

export function AuthedLayout({ children, Loading }: { children: React.ReactNode; Loading: React.ReactNode }) {
	return (
		<SessionProvider>
			<AuthedLayoutInner Loading={Loading}>{children}</AuthedLayoutInner>
		</SessionProvider>
	);
}
