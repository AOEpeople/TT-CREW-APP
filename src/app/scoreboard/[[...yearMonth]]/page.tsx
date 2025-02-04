export const dynamic = "force-dynamic";
import Link from "next/link";
import { getMonthResult } from "@/db/queries/getMonthResult";
import { z } from "zod";
import { redirect } from "next/navigation";
import MonthSelect from "../components/monthSelect";

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

export default async function ScoreBoard({
  params,
}: {
  readonly params: Promise<{ yearMonth: string }>;
}) {
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
    const thisMonthResult = await getMonthResult(
      new Date(data.year, data.month - 1),
    );

    const firstThreePlayers = thisMonthResult.slice(0, 3);
    const restOfPlayers = thisMonthResult.slice(3);

    return (
      <main>
        <div className="h-full w-screen p-6 bg-gray-100">
          <div className=" ">
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
          <h1 className="text-3xl font-bold mb-4 text-center">Scoreboard</h1>
          <MonthSelect month={data.month} year={data.year} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
            {firstThreePlayers.map((player, index) => (
              <div
                key={player.id}
                className={`p-8 rounded-md ${
                  index === 0
                    ? "bg-gold"
                    : index === 1
                      ? "bg-silver"
                      : index === 2
                        ? "bg-bronze"
                        : "bg-gray-200"
                } ${index <= 3 ? `shadow-lg` : `shadow`} relative`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="  text-xl font-medium">
                    {player.name} {player.emoji}
                  </div>
                  <div className="  text-m font-light">{player.wins}</div>
                </div>
                <div className="absolute inset-2 flex items-center justify-start">
                  <p className="text-8xl font-bold opacity-50 z-10 ">
                    {index === 0
                      ? "🥇"
                      : index === 1
                        ? "🥈"
                        : index === 2
                          ? "🥉"
                          : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 h-full overflow-y-auto">
            {restOfPlayers.map((player, index) => (
              <div key={player.id} className="p-4 bg-white rounded-md">
                <p className="text-xl font-bold">{index + 4}.</p>
                <div className="flex justify-between">
                  <div className="mt-2">
                    {player.name} {player.emoji}
                  </div>
                  <div className="mt-2">{player.wins}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  } catch (e) {
    console.error(e);
  }
}
