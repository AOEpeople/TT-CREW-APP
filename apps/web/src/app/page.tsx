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
        <Button 
          asChild 
          size="lg" 
          className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/50 transition-all duration-200 border border-blue-400/50"
        >
          <Link href="/game" className="py-6 text-lg font-semibold">🏓 Spiel eintragen</Link>
        </Button>
        <Button 
          asChild 
          variant="secondary" 
          className="w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-slate-500/50 transition-all duration-200 border border-slate-600/50"
        >
          <Link href="/new-player" className="py-4">Neuen Spieler eintragen</Link>
        </Button>
        <Button 
          asChild 
          variant="secondary" 
          className="w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-slate-500/50 transition-all duration-200 border border-slate-600/50"
        >
          <Link href="/scoreboard" className="py-4">Leaderboard</Link>
        </Button>
      </div>
    </div>
  );
}
