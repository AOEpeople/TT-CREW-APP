import { NextResponse } from "next/server";
import { gameCore } from "@/lib/gameCore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 },
    );
  }

  const date = new Date(dateParam);

  if (isNaN(date.getTime())) {
    return NextResponse.json(
      { error: "Invalid date parameter" },
      { status: 400 },
    );
  }

  const result = await gameCore.getMonthResult(date);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 },
    );
  }

  const date = new Date(dateParam);

  if (isNaN(date.getTime())) {
    return NextResponse.json(
      { error: "Invalid date parameter" },
      { status: 400 },
    );
  }

  await gameCore.publishMonthResult(date);
  return NextResponse.json({ success: true });
} 