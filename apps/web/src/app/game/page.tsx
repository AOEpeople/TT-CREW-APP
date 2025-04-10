import { Button } from "@/components/ui/button";
import PlayerGrid from "./components/playerGrid";
import { gameCore } from "@/lib/gameCore";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";

export default async function Page() {

  const players = await gameCore.getActivePlayers();

  return (
    <main className="h-screen w-screen p-4">
      <div className="w-full">
        <Button variant="link" asChild className="p-0 m-0 text-white">
          <Link href="/">
            <ChevronLeft />
            zurück
          </Link>
        </Button>
    </div>
      <h1 className="text-3xl font-bold mb-4 text-center text-white">Spiel</h1>
      <Suspense fallback={<p className="text-white">lade...</p>}>
        <PlayerGrid players={players} />
      </Suspense>
    </main>
  );
}
