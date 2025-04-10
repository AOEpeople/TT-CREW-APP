"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import * as z from "zod";
import { redirect } from "next/navigation";
import { formDataToObject } from "@/lib/formDataToObject";

const inputSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  emoji: z.string().emoji({ message: "Emoji is required" }),
});

export default async function addPlayer(formData: FormData) {
  const { name, emoji } = inputSchema.parse(formDataToObject(formData));

  const players = await db.query.players.findMany();

  if (players.some((player) => player.name === name && player.emoji === emoji)) {
    console.log("hier geht er net rein");
  }

  await db
    .insert(schema.players)
    .values({
      name: name,
      emoji: emoji,
      createdAt: new Date(),
      createdBy: 1,
    })
    .execute();

  redirect("/game");
}
