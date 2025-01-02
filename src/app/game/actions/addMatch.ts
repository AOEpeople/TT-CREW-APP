"use server";
import * as Sentry from "@sentry/nextjs";
import * as schema from "@/db/schema";
import * as z from "zod";

import { formDataToObject } from "@/lib/formDataToObject";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";

const inputSchema = z.object({
  winnerId1: z.coerce.number({ required_error: "winnerId is required" }),
  winnerId2: z.coerce
    .number({ required_error: "winnerId is required" })
    .optional(),
});

export default async function addMatch(formData: FormData) {
  return await Sentry.withServerActionInstrumentation(
    "new-player/actions/addPlayer", // The name you want to associate this Server Action with in Sentry
    {
      formData, // Optionally pass in the form data
      headers: headers(), // Optionally pass in headers
      recordResponse: true, // Optionally record the server action response
    },
    async () => {
      try {
        const { winnerId1, winnerId2 } = inputSchema.parse(
          formDataToObject(formData)
        );


        // Insert the match and the playerMatches as a transaction to ensure consistency
        await db.transaction(async (tx) => {
          const results = await tx
            .insert(schema.matches)
            .values({
              createdAt: new Date(),
              enteredBy: 1,
            })
            .returning({ id: schema.matches.id });
          console.log("inserted new match:", results);
          const matchId = results[0].id;
          const playermatchResult = await tx
            .insert(schema.playerMatches)
            .values({
              type: "WON",
              match: matchId,
              player: winnerId1,
            })
            .execute();
          console.log("inserted new playermatch:", playermatchResult);
          if (winnerId2) {
            const playermatchResult2 = await tx
              .insert(schema.playerMatches)
              .values({
                type: "WON",
                match: matchId,
                player: winnerId2,
              })
              .execute();
            console.log("inserted new playermatch:", playermatchResult2);
          }
        });

        revalidatePath("/game");
      } catch (error) {
        console.error(error);
        throw new Error("Could not add match");
      }
    }
  );
}
