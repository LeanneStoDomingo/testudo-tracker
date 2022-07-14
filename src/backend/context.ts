import type { inferAsyncReturnType } from "@trpc/server";
import { prisma } from "@/backend/db/client";

export const createContext = async () => {
  return { prisma };
};

export type Context = inferAsyncReturnType<typeof createContext>;
