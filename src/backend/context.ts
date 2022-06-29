import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "@/backend/db/client";

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  return {
    ...opts,
    db: prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
