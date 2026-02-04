// Gonna use NextAuth which I know is outdated and a bad choice too but I'm following a tutorial for the sake of learning NextJS, not authentication in-depth.

import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/User";
import env from "./env";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					if (!credentials?.email || !credentials?.password) throw new Error("Missing email or password");

					const user = await User.findOne({ email: credentials.email });

					if (!user) throw new Error("User doesn't exist");

					const isValid = bcrypt.compare(credentials.password, user.password);

					if (!isValid) {
						throw new Error("Invalid password");
					}

					return {
						id: user._id.toString(),
						email: user.email,
					};
				} catch (error) {
					console.error("Auth error:", error);
					throw error;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	session: {
		strategy: "jwt",
		maxAge: env.TOKEN_MAX_AGE,
	},
	secret: env.NEXTAUTH_SECRET,
};

// I hate this.
