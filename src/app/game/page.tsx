export const dynamic = "force-dynamic";

import PlayerGrid from "./components/playerGrid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import { db } from "@/db";
import { Suspense } from "react";

type Player = {
  id: number;
  name: string;
  emoji: string | null;
  createdAt: Date;
  createdBy: number;
  rating: number | null;
  priority: number;
};
export default async function Game() {
  let players: Player[] | undefined = undefined;
  try {
    players = await db.query.players.findMany();
  } catch (e) {
    console.error(e);
  }

  return (
    <main className="h-screen w-screen p-4 bg-gray-100 ">
      <div className="w-full">
        <Button variant="link" asChild className="p-0 m-0">
          <Link href="/">
            <ChevronLeft />
            zurück
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Spiel</h1>
      <Suspense fallback={<p>lade...</p>}>
        <PlayerGrid players={players} />
      </Suspense>
    </main>
  );
}
