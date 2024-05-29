import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

const isAuth = t.middleware(async ({ next }) => {
  const user = await getKindeServerSession()?.getUser();

  if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      user,
      userId: user.id,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuth);
