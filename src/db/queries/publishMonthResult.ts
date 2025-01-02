import * as schema from "@/db/schema";
import { getMonthResult } from "./getMonthResult";
import { db } from "..";

export const publishMonthResult = async (date: Date) => {
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  console.info(
    `Publishing month result for ${lastDayOfMonth.toLocaleDateString("de-DE")}`
  );

  const doesMonthResultExist = await db.query.monthResult.findFirst({
    where: (monthResult, { eq }) => eq(monthResult.createdAt, lastDayOfMonth),
  });
  if (doesMonthResultExist !== undefined) {
    console.log(
      `Month result already exists for ${lastDayOfMonth.toLocaleDateString(
        "de-DE"
      )}`
    );
    throw new Error(
      `Month result already exists for ${lastDayOfMonth.toLocaleDateString(
        "de-DE"
      )}`
    );
  }

  const playerWins = await getMonthResult(lastDayOfMonth);
  try {
    await db.transaction(async (tx) => {
      const res = await tx
        .insert(schema.monthResult)
        .values({
          createdAt: new Date(lastDayOfMonth),
          enteredBy: 1,
        })
        .returning({ id: schema.monthResult.id });
      const monthResultId = res[0].id;
      console.log(`Inserted monthResultId: ${monthResultId}`);
      const dbInsertValues = playerWins.map((playerWin) => ({
        monthResult: monthResultId,
        player: playerWin.id,
        points: playerWin.wins,
      }));

      console.log(`dbInsertValues:`, dbInsertValues);
      await tx.insert(schema.monthResultPlayers).values(dbInsertValues);
    });

    return;
  } catch (error) {
    console.log(`Error: ${error}`);
    return;
  }
};
