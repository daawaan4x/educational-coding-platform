import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserSchema } from "./db/validation";
import { userService } from "./server/routers/users";

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

					const user = await userService.authenticate(email, password);
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
	callbacks: {
		jwt({ token, user }) {
			if (user?.id) {
				token.user_id = user.id;
			}
			return token;
		},
		session({ session, token }) {
			session.user.id = token.user_id;
			return session;
		},
	},
});
