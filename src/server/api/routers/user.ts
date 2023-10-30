import { z, ZodType } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

type User = {
  id: string;
  name: string;
  email: string;
};

const UserSchema: ZodType<User> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        user: UserSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.create({
        data: {
          id: input.user.id,
          name: input.user.name,
          email: input.user.email,
        },
      });
      return result;
    }),

  getUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });
      return result;
    }),
});
