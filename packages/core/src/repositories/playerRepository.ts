import { eq } from "drizzle-orm";
import { schema, type TTGameDatabase } from "../db";
import { Player } from "../models/player";

export interface AddPlayerInput {
  name: string;
  emoji: string;
  createdBy: number;
}

export class PlayerRepository {
  constructor(private db: TTGameDatabase) {}

  async getAllPlayers(): Promise<Player[]> {
    const players = await this.db.select().from(schema.players);
    return players.map(this.mapToPlayer);
  }

  async getPlayerById(id: number): Promise<Player | null> {
    const player = await this.db
      .select()
      .from(schema.players)
      .where(eq(schema.players.id, id))
      .get();
    
    return player ? this.mapToPlayer(player) : null;
  }

  async getActivePlayers(): Promise<Player[]> {
    const players = await this.db
      .select()
      .from(schema.players)
      .where(eq(schema.players.status, "ACTIVE"));
    
    return players.map(this.mapToPlayer);
  }

  async addPlayer(input: AddPlayerInput): Promise<Player> {
    const result = await this.db
      .insert(schema.players)
      .values({
        name: input.name,
        emoji: input.emoji,
        createdAt: new Date(),
        createdBy: input.createdBy,
        status: "ACTIVE" as const,
        priority: 9999, // Default priority for new players
      })
      .returning({ id: schema.players.id });

    const player = await this.getPlayerById(result[0].id);
    if (!player) {
      throw new Error("Failed to create player");
    }

    return player;
  }

  private mapToPlayer(dbPlayer: typeof schema.players.$inferSelect): Player {
    return {
      id: dbPlayer.id,
      name: dbPlayer.name,
      emoji: dbPlayer.emoji ?? null,
      priority: dbPlayer.priority,
      status: dbPlayer.status ?? undefined,
      rating: dbPlayer.rating ?? undefined,
    };
  }
} 