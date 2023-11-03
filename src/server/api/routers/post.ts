import { z } from "zod";
import { User } from "@clerk/nextjs/dist/types/server";
import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.imageUrl,
  };
};

export const postRouter = createTRPCRouter({
  testingToGetAllUser: publicProcedure.query(async ({ input }) => {
    const users = (
      await clerkClient.users.getUserList({
        limit: 100,
      })
    ).map(filterUserForClient);

    return users;
  }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //       },
  //     });
  //   }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });
  // }),
});
