import { publishMonthResult } from "@/db/queries/publishMonthResult";
import { type NextRequest } from "next/server";
import * as z from "zod";

// Define a Zod schema for the query parameters
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

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paramsResult = ParamsSchema.safeParse({
      year: searchParams.get("year"),
      month: searchParams.get("month"),
    });

    if (!paramsResult.success) {
      throw new Error(`Invalid input parameters, ${paramsResult.error}`);
    }

    const { year, month } = paramsResult.data;

    // Find the last day of the month
    const lastDayOfMonth = new Date(year, month, 0);

    // Check if the input date is in the future
    if (new Date() < lastDayOfMonth) {
      throw new Error(
        `Input ${lastDayOfMonth.toLocaleString("de-DE")} is in the future`,
      );
    }

    console.log(
      "Calling publish month result with",
      lastDayOfMonth.toLocaleDateString("de-DE"),
    );
    await publishMonthResult(lastDayOfMonth);

    return new Response(`Hello ${lastDayOfMonth}!`);
  } catch (e) {
    return new Response(`Error: ${e}`);
  }
}
