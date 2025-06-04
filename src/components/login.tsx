/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginProps {
	heading?: string;
	subheading?: string;
	logo?: {
		url: string;
		src: string;
		alt: string;
	};
	loginText?: string;
	googleText?: string;
}

const Login = ({ heading = "Login", subheading = "Welcome back", loginText = "Log in", logo }: LoginProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		void (async () => {
			try {
				const result = await signIn("credentials", {
					email,
					password,
					redirect: false,
				});

				if (result?.error) {
					setError("Invalid email or password");
				} else {
					router.push("/");
				}
			} catch (error) {
				setError("An error occurred during login");
			} finally {
				setIsLoading(false);
			}
		})();
	};

	return (
		<section className="container flex flex-col gap-4">
			<div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
				<div className="mb-6 flex flex-col items-center">
					{logo ? (
						<a href={logo.url} className="mb-6 flex items-center gap-2">
							<Image src={logo.src} className="max-h-8" alt={logo.alt} />
						</a>
					) : (
						""
					)}
					<h1 className="mb-2 text-2xl font-bold">{heading}</h1>
					<p className="text-muted-foreground">{subheading}</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4">
						{error && <div className="text-center text-sm text-red-500">{error}</div>}
						<Input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<div>
							<Input
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required={process.env.NODE_ENV != "development" && process.env.SKIP_AUTH}
							/>
						</div>
						<Button type="submit" className="mt-2 w-full" disabled={isLoading}>
							{isLoading ? "Logging in..." : loginText}
						</Button>
					</div>
				</form>
			</div>
		</section>
	);
};

export { Login };
