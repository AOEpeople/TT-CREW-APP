import { db } from "@/db";
import * as schema from "@/db/schema";

import { players_2024 } from "../../../../drizzle/seedData/players";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("trying to connect to the database...");

  const user = await db.query.users.findFirst();

  if (!user) {
    console.log("No default user found. Creating one...");
    await db.insert(schema.users).values({ username: "default" });
    console.log("Default user created.");
  }

  const players = await db.query.players.findMany();

  console.log(`Connected to the database. Found ${players.length} players.`);

  if (players.length > 0) {
    return Response.json("Database already seeded.");
  }

  console.log("Seeding the database...");

  await db
    .insert(schema.players)
    .values(
      players_2024.map((player) => ({
        ...player,
        createdAt: new Date(),
        createdBy: 1,
      })),
    )
    .execute();

  console.log("Seeding done.");
  const newPlayers = await db.query.players.findMany();
  console.log(`Found ${newPlayers.length} users after seeding.`);
  return Response.json(
    `Seeding done. Found ${newPlayers.length} users after seeding.`,
  );
}
