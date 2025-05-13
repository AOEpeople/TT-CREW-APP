import { eq } from "drizzle-orm";
import { schema, type TTGameDatabase } from "../db";
import { Match } from "../models/match";
import { Player } from "../models/player";

export interface AddMatchInput {
  winnerIds: number[];
  loserIds?: number[];
  enteredBy: number;
  timestamp?: Date;
}

export class MatchRepository {
  constructor(private db: TTGameDatabase) {}

  async addMatch(input: AddMatchInput): Promise<Match> {
    // Insert the match and the playerMatches as a transaction to ensure consistency
    const result = await this.db.transaction(async (tx) => {
      const matchResult = await tx
        .insert(schema.matches)
        .values({
          createdAt: input.timestamp || new Date(),
          enteredBy: input.enteredBy,
        })
        .returning({ id: schema.matches.id });
      
      const matchId = matchResult[0].id;
      
      // Add all winners
      for (const winnerId of input.winnerIds) {
        await tx
          .insert(schema.playerMatches)
          .values({
            type: "WON",
            match: matchId,
            player: winnerId,
          });
      }
      
      // Add all losers if provided
      if (input.loserIds) {
        for (const loserId of input.loserIds) {
          await tx
            .insert(schema.playerMatches)
            .values({
              type: "LOST",
              match: matchId,
              player: loserId,
            });
        }
      }
      
      return matchId;
    });
    
    // Return the created match
    return this.getMatchById(result);
  }

  async getMatchById(id: number): Promise<Match> {
    const match = await this.db
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.id, id))
      .get();
    
    if (!match) {
      throw new Error(`Match with id ${id} not found`);
    }
    
    const playerMatches = await this.db
      .select()
      .from(schema.playerMatches)
      .where(eq(schema.playerMatches.match, id));
    
    const winners: Player[] = [];
    const losers: Player[] = [];
    
    for (const playerMatch of playerMatches) {
      const player = await this.db
        .select()
        .from(schema.players)
        .where(eq(schema.players.id, playerMatch.player))
        .get();
      
      if (player) {
        const mappedPlayer: Player = {
          id: player.id,
          name: player.name,
          emoji: player.emoji,
          priority: player.priority,
          status: player.status as "ACTIVE" | "INACTIVE" | "HALL_OF_FAME" | undefined,
          rating: player.rating ?? undefined,
        };
        
        if (playerMatch.type === "WON") {
          winners.push(mappedPlayer);
        } else {
          losers.push(mappedPlayer);
        }
      }
    }
    
    return {
      id: match.id,
      createdAt: new Date(match.createdAt),
      enteredBy: match.enteredBy,
      winners,
      losers: losers.length > 0 ? losers : undefined,
    };
  }
} 