import { db } from "@/db";
import * as schema from "@/db/schema";
import { createSchemaFactory } from "drizzle-zod";
import { NextResponse } from "next/server";

const tables = {
  matches: schema.matches,
  monthResult: schema.monthResult,
  monthResultPlayers: schema.monthResultPlayers,
  players: schema.players,
  playerMatches: schema.playerMatches,
  ratings: schema.ratings,
  users: schema.users,
} as const;

type ValidTables = keyof typeof tables;

const { createInsertSchema } = createSchemaFactory({
  coerce: {
    date: true,
  },
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ table: string }> },
) {
  try {
    // Validate table parameter
    const table = (await params).table as ValidTables;
    if (!Object.keys(tables).includes(table)) {
      return NextResponse.json(
        { error: "Invalid table specified" },
        { status: 400 },
      );
    }

    // Get the schema for the specified table
    const targetTable = tables[table];
    const insertSchema = createInsertSchema(targetTable);

    // Parse request body
    const body = await request.json();

    // Handle both array and single object cases
    const isArray = Array.isArray(body);
    const dataToInsert = isArray ? body : [body];

    // Validate all items against the schema
    const validated = dataToInsert.map((item) => insertSchema.parse(item));

    // Insert all validated items
    const results = await Promise.all(
      validated.map((item) => db.insert(targetTable).values(item)),
    );

    // Extract all inserted IDs
    const insertedIds = results.map((result) =>
      result.lastInsertRowid?.toString(),
    );

    console.log("Inserted data:", results);

    // Return appropriate response based on input type
    return NextResponse.json(
      {
        success: true,
        insertedId: isArray ? insertedIds : insertedIds[0],
        count: insertedIds.length,
      },
      { status: 201 },
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
