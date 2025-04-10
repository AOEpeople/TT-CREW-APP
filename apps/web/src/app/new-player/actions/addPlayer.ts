"use server";

import { formDataToObject } from "@/lib/formDataToObject";
import { redirect } from "next/navigation";
import * as z from "zod";
import { gameCore } from "@/lib/gameCore";

const inputSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  emoji: z.string().emoji({ message: "Emoji is required" }),
});

export default async function addPlayer(formData: FormData) {
  const { name, emoji } = inputSchema.parse(formDataToObject(formData));

  await gameCore.addPlayer({
    name,
    emoji,
    createdBy: 1, // Hardcoded for now, should be replaced with actual user ID
  });

  redirect("/game");
}
