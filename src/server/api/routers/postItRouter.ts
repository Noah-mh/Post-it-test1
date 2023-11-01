import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { ReactFlowJsonObject } from "reactflow";
const handleError = (error: Error, message: string) => {
    // Log the error for debugging
    console.error(error);

    // Here you can add more complex logic, like sending the error to an error-tracking service

    throw new Error(`${message}: ${error.message}`);
};

const reactflowJson = z.custom<ReactFlowJsonObject>((data) => true);

export const postItRouter = createTRPCRouter({
    postItSelect: publicProcedure.input(
        z.object({
            id: z.string(),
        }),
    ).query(async (opts) => {
        try {
            const { input } = opts;
            const postIt = await db.postIt.findUniqueOrThrow({
                where: {
                    id: input.id,
                }
            });
            return postIt;
        } catch (err) {
            handleError(err as Error, "Failed to find PostIt object");
        }
    }),
    postItUpdate: publicProcedure.input(
        z.object({
            id: z.string(),
            state: reactflowJson,
        }),
    ).mutation(async (opts) => {
        try {
            const { input } = opts;
            const result = await db.postIt.update({
                where: { id: input.id },
                data: {
                    state: input.state as any,
                },
            });
            return result;
        } catch (err) {
            handleError(err as Error, "Failed to update PostIt object");
        }
    })
})