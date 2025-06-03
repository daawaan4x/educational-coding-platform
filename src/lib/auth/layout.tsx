import { useEffect } from "react";
import { trpc } from "../trpc";
import { useAuthStore } from "./store";

export function AuthedLayout({ children, Loading }: { children: React.ReactNode; Loading: React.ReactNode }) {
	const { user, setUser } = useAuthStore();
	const userQuery = trpc.users.find.useQuery({});

	useEffect(() => {
		if (userQuery.data) setUser(userQuery.data);
	}, [userQuery.data, setUser]);

	if (!user) return <>{Loading}</>;

	return <>{children}</>;
}
