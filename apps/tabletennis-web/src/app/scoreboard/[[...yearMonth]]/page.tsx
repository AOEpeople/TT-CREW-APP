export const dynamic = "force-dynamic";
import Link from "next/link";
import { z } from "zod";
import { redirect } from "next/navigation";
import MonthSelect from "../components/monthSelect";
import { gameCore } from "@/lib/gameCore";

interface MonthResultWithPlayer {
  id: number;
  name: string;
  emoji: string | null;
  wins: number;
}

const ParamsSchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/)
    .transform(Number), // Year must be a four-digit number
  month: z
    .string()
    .regex(/^(0?[1-9]|1[0-2])$/)
    .transform(Number), // Month must be between 01 and 12
});

// Top player card component to reduce cognitive complexity
function TopPlayerCard({ player, index }: { player: MonthResultWithPlayer; index: number }) {
  const getCardStyles = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.8)] border border-yellow-200/50";
      case 1:
        return "bg-gradient-to-br from-gray-300 via-slate-100 to-gray-400 shadow-[0_0_25px_rgba(203,213,225,0.7)] border border-gray-200/50";
      default:
        return "bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-950 shadow-[0_0_25px_rgba(146,64,14,0.7)] border border-amber-500/50";
    }
  };

  const getTextStyles = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-950";
      case 1:
        return "text-gray-900";
      default:
        return "text-amber-100";
    }
  };

  const getShadowStyles = (index: number) => {
    switch (index) {
      case 0:
        return '0 0 30px rgba(234,179,8,0.8), 0 0 15px rgba(234,179,8,0.4), inset 0 0 15px rgba(255,255,255,0.5)';
      case 1:
        return '0 0 25px rgba(203,213,225,0.7), 0 0 12px rgba(203,213,225,0.4), inset 0 0 12px rgba(255,255,255,0.4)';
      default:
        return '0 0 25px rgba(146,64,14,0.7), 0 0 12px rgba(146,64,14,0.4), inset 0 0 12px rgba(255,255,255,0.3)';
    }
  };

  return (
    <div
      className={`p-8 rounded-md ${getCardStyles(index)} shadow-lg relative hover:scale-105 transition-transform duration-200 backdrop-blur-sm`}
      style={{
        backgroundBlendMode: 'overlay',
        boxShadow: getShadowStyles(index),
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className={`text-xl font-medium ${getTextStyles(index)} drop-shadow-md ${index !== 2 ? 'font-bold' : ''}`}>
          {player.name} {player.emoji}
        </div>
        <div className={`text-3xl font-bold mt-2 ${getTextStyles(index)} drop-shadow-md`}>
          {player.wins}
        </div>
        <div className={`text-sm ${getTextStyles(index)} drop-shadow-md ${index !== 2 ? 'font-medium' : ''}`}>
          {player.wins === 1 ? "Sieg" : "Siege"}
        </div>
      </div>
    </div>
  );
}

// Other player row component
function OtherPlayerRow({ player, index }: { player: MonthResultWithPlayer; index: number }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-slate-600/50 hover:bg-slate-600/70 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-gray-300 font-medium">{index + 4}.</span>
        <span className="text-white">
          {player.name} {player.emoji}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white font-bold">{player.wins}</span>
        <span className="text-gray-300 text-sm">
          {player.wins === 1 ? "Sieg" : "Siege"}
        </span>
      </div>
    </div>
  );
}

export default async function ScoreBoard({
  params,
}: {
  readonly params: Promise<{ yearMonth: string }>;
}) {

  console.log("rendering scoreboard");


  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const yearMonth = await (await params).yearMonth;
  // redirect to current month if no slug is provided in path
  if (!yearMonth) {
    redirect(
      `/scoreboard/${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`,
    );
  }

  // validate slug in path
  const { success, data } = ParamsSchema.safeParse({
    year: yearMonth[0],
    month: yearMonth[1],
  });

  if (
    !success ||
    data.year > currentYear ||
    (data.year == currentYear && data.month > currentMonth)
  ) {
    // redirect to current month if invalid slug is provided in path or future month is requested
    redirect(
      `/scoreboard/${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`,
    );
  }

  try {
    const thisMonthResult = await gameCore.getMonthResult(new Date(data.year, data.month - 1));

    const firstThreePlayers = thisMonthResult.slice(0, 3);
    const restOfPlayers = thisMonthResult.slice(3);

    return (
      <main>
        <div className="h-full w-screen p-6">
          <div className="text-white">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center text-white">Scoreboard</h1>
          <MonthSelect month={data.month} year={data.year} />
          
          {/* Top 3 Players Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative mb-8">
            {firstThreePlayers.map((player, index) => (
              <TopPlayerCard key={player.id} player={player} index={index} />
            ))}
          </div>

          {/* Rest of Players List */}
          {restOfPlayers.length > 0 && (
            <div className="bg-slate-700/70 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-4 text-center">Weitere Platzierungen</h2>
              <div className="space-y-2">
                {restOfPlayers.map((player, index) => (
                  <OtherPlayerRow key={player.id} player={player} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="h-full w-screen p-6">
        <div className="text-white">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center text-white">Scoreboard</h1>
        <p className="text-center text-white">Fehler beim Laden der Daten</p>
      </div>
    );
  }
}
