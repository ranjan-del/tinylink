import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "database",
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Include user.id in session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
