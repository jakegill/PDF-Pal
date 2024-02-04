import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export const authOptions: AuthOptions = {
	pages: {
		signIn: "/auth/signin",
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: {
						email: credentials?.username as string,
					},
				});
				if (!user) throw new Error("User not found.");

				const isValidPassword = await bcrypt.compare(credentials?.password as string, user.password)
				if (!isValidPassword) throw new Error("Invalid credentials.");

				const { password, ...userWithoutPassword } = user;
				return userWithoutPassword;
			},
		}),
	],
	callbacks: {
		async session({token, session}) { 
			session.user = token.user as User;
			return session;
		},
		async jwt({token, user}) {
			if (user) token.user = user as User;
			return token;
		},
	},
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60,
	}
};