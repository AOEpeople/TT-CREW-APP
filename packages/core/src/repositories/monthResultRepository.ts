import { and, count, desc, eq, gt, lt } from "drizzle-orm";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { schema } from "../db";

export interface MonthResultWithPlayer {
  id: number;
  name: string;
  emoji: string | null;
  wins: number;
}

export class MonthResultRepository {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async getMonthResult(date: Date): Promise<MonthResultWithPlayer[]> {
    try {
      const firstDayOfThisMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
      );
      const lastDayOfThisMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
      );
      const firstDayOfLastMonth = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1,
      );
      const lastMonthResultOrdered = await this.db
        .select({
          playerId: schema.monthResultPlayers.player,
          name: schema.players.name,
          points: schema.monthResultPlayers.points,
          createdAt: schema.monthResult.createdAt,
          resultId: schema.monthResult.id,
        })
        .from(schema.monthResult)
        .where(
          and(
            gt(schema.monthResult.createdAt, firstDayOfLastMonth),
            lt(schema.monthResult.createdAt, firstDayOfThisMonth),
          ),
        )
        .leftJoin(
          schema.monthResultPlayers,
          eq(schema.monthResult.id, schema.monthResultPlayers.monthResult),
        )
        .leftJoin(
          schema.players,
          eq(schema.players.id, schema.monthResultPlayers.player),
        )
        .orderBy(desc(schema.monthResultPlayers.points));

      const pointsMultiplicationRules = [
        -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0, 0, 0, 0,
      ] as const;
      const offsetPoints = lastMonthResultOrdered.map(
        ({ playerId, points }, index) => {
          const multiplier = pointsMultiplicationRules[index] ?? 1;
          const offset = points ? Math.round(points * multiplier) : 0;
          return { playerId, offset };
        },
      );

      const thisMonthPlayerWins = await this.db
        .select({
          id: schema.players.id,
          name: schema.players.name,
          emoji: schema.players.emoji,
          wins: count(schema.playerMatches.id),
        })
        .from(schema.players)
        .leftJoin(
          schema.playerMatches,
          eq(schema.players.id, schema.playerMatches.player),
        )
        .leftJoin(
          schema.matches,
          eq(schema.playerMatches.match, schema.matches.id),
        )
        .where(
          and(
            eq(schema.playerMatches.type, "WON"),
            gt(schema.matches.createdAt, firstDayOfThisMonth),
            lt(schema.matches.createdAt, lastDayOfThisMonth),
          ),
        )
        .groupBy(schema.players.id)
        .orderBy(desc(count(schema.playerMatches.id)));

      const thisMonthResult = thisMonthPlayerWins
        .map((player) => {
          const offset =
            offsetPoints.find(({ playerId }) => playerId === player.id)?.offset ??
            0;
          return {
            ...player,
            wins: player.wins + offset,
          };
        })
        .sort((a, b) => b.wins - a.wins);

      return thisMonthResult;
    } catch (e) {
      console.error(e);
      throw new Error("Could not get month result");
    }
  }

  async publishMonthResult(date: Date): Promise<void> {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.info(
      `Publishing month result for ${lastDayOfMonth.toLocaleDateString("de-DE")}`,
    );

    const doesMonthResultExist = await this.db.query.monthResult.findFirst({
      where: (monthResult, { eq }) => eq(monthResult.createdAt, lastDayOfMonth),
    });
    if (doesMonthResultExist !== undefined) {
      throw new Error(
        `Month result already exists for ${lastDayOfMonth.toLocaleDateString(
          "de-DE",
        )}`,
      );
    }

    const playerWins = await this.getMonthResult(lastDayOfMonth);
    try {
      await this.db.transaction(async (tx) => {
        const res = await tx
          .insert(schema.monthResult)
          .values({
            createdAt: new Date(lastDayOfMonth),
            enteredBy: 1,
          })
          .returning({ id: schema.monthResult.id });
        const monthResultId = res[0].id;
        
        const dbInsertValues = playerWins.map((playerWin) => ({
          monthResult: monthResultId,
          player: playerWin.id,
          points: playerWin.wins,
        }));

        await tx.insert(schema.monthResultPlayers).values(dbInsertValues);
      });
    } catch (error) {
      console.error(`Error publishing month result: ${error}`);
      throw error;
    }
  }
} 