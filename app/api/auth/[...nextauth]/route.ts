import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../../../../lib/db";

const handler = NextAuth({
  adapter: PrismaAdapter(db) as any,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "github_placeholder_id",
      clientSecret: process.env.GITHUB_SECRET || "github_placeholder_secret",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google_placeholder_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google_placeholder_secret",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
