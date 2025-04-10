import { NextResponse } from "next/server";
import { players_2024 } from "drizzle/seedData/players";
import { gameCore } from "@/lib/gameCore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const players = await gameCore.getAllPlayers();
    return NextResponse.json(players);
  } catch (error) {
    console.error("Error getting players:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
