import { Login } from "@/components/login";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
	description: "Login to your account",
};

export default function Page() {
	return (
		<div className="flex h-screen items-center justify-center">
			<Login />
		</div>
	);
}
