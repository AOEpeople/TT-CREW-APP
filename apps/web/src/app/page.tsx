import { Button } from "@/components/ui/button";
import Link from "next/link";
import tableTennisBg from "./assets/tabletennis-table-background.png";
import PingPongBalls from "@/components/PingPongBalls";

export default function Home() {
  return (
    <div 
      className="p-8 h-screen w-screen flex flex-col justify-around relative"
      style={{
        backgroundImage: `url(${tableTennisBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <PingPongBalls />
      
      <h1 className="text-4xl font-bold mb-6 text-center text-white drop-shadow-lg relative z-10 bg-black/50 px-6 py-3 rounded-lg inline-block mx-auto">
        AOE Tischtennis Crew App
      </h1>

      <div className="flex flex-col items-center space-y-4 relative z-10">
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
