import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure, protectedProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();

    const user = await getUser();

    if (!user?.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    return await db.file.findMany({
      where: {
        userId,
        fileStatus: "LIVE",
      },
    });
  }),
  getUserFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      const userId = ctx.userId;
      const fileId = input.id;
      if (!user?.id || !user.email)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),
  getFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),
  recycleFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const fileId = input.id;

      await db.file.update({
        where: {
          id: fileId,
          userId,
        },
        data: {
          fileStatus: "RECYCLED",
        },
      });

      return { success: true };
    }),
  deleteUserFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const fileId = input.id;

      await db.file.delete({
        where: {
          id: fileId,
          userId,
        },
      });

      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
