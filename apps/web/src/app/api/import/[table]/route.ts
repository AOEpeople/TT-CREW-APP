import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json(
      { error: "Bulk import functionality is not yet implemented" },
      { status: 501 },
    );
  } catch (error) {
    console.error("Error processing import:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      usage: {
        method: "POST",
        tables: Object.keys(tables),
        description: "Import data into a specific table",
        body: "JSON object matching the table schema",
        example: {
          endpoint: "/api/import/players",
          body: {
            name: "Player Name",
            // ... other fields depending on table schema
          },
        },
      },
    },
    { status: 200 },
  );
}
