import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Role } from "@prisma/client";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      // ...other properties
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    // ...other properties
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),
    // only allow users currently in the db to sign in
    signIn: async ({ user }) => {
      if (!user.email) return false;

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          _count: { select: { accounts: true } },
        },
      });

      if (!dbUser) return false;

      if (dbUser._count.accounts === 0) {
        const createAccount = prisma.account.create({
          data: {
            user: { connect: { id: dbUser.id } },
            provider: "google",
            providerAccountId: user.id,
            type: "oauth",
          },
        });

        const updateUser = prisma.user.update({
          where: { id: dbUser.id },
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        });

        await Promise.allSettled([createAccount, updateUser]);
      }

      return true;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
