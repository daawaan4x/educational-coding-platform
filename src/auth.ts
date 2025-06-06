import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserSchema } from "./db/validation";
import { UserService } from "./server/services/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {
					type: "email",
					label: "Email",
					placeholder: "example@mail.com",
				},
				password: {
					type: "password",
					label: "Password",
					placeholder: "******",
				},
			},
			async authorize(credentials) {
				try {
					const email = UserSchema.Insert.shape.email.parse(credentials.email);
					const password = UserSchema.Insert.shape.password.parse(credentials.password);

					const user = await UserService.authenticate(email, password);
					return {
						id: user.id,
					};
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (_) {
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
	},
	callbacks: {
		jwt({ token, user }) {
			if (user?.id) {
				token.user_id = user.id;
			}
			return token;
		},
		session({ session, token }) {
			if (token.user_id) {
				session.user.id = token.user_id;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
});

// Make sure to export getServerAuthSession for server components
export const getServerAuthSession = () => auth();
