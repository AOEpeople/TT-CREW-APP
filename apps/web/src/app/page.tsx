import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 bg-slate-400 h-screen w-screen flex flex-col justify-around">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-200">
        TT Crew
      </h1>

      <div className="flex flex-col items-center space-y-4">
        <Button asChild size="lg" className="w-full">
          <Link href="/game">🏓 Spiel eintragen</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/new-player">Neuen Spieler eintragen</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/scoreboard">Leaderboard</Link>
        </Button>
      </div>
    </div>
  );
}
