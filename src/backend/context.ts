import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@/backend/db/client";

export const createContext = async (opts?: CreateNextContextOptions) => {
  return {
    ...opts,
    db: prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
