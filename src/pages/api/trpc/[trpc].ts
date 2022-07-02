import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@/backend/router";
import { createContext } from "@/backend/context";

export default createNextApiHandler({
  router: appRouter,
  createContext,
});
