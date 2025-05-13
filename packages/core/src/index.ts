import { createDatabase, DatabaseConfig } from "./db";
import { GameService } from "./services/gameService";
import { Player } from "./models/player";
import { Match } from "./models/match";
import { AddMatchInput } from "./repositories/matchRepository";
import { AddPlayerInput } from "./repositories/playerRepository";
import { MonthResultWithPlayer } from "./repositories/monthResultRepository";

export type { Player, Match, AddMatchInput, AddPlayerInput, MonthResultWithPlayer, DatabaseConfig };

class TTGameError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'TTGameError';
  }
}

export class TTGameCore {
  private readonly gameService: GameService;

  constructor(config: DatabaseConfig) {
    try {
      const db = createDatabase(config);
      this.gameService = new GameService(db);
    } catch (error) {
      throw new TTGameError('Failed to initialize TTGameCore: Database connection failed', error);
    }
  }

  // Player methods
  async addPlayer(input: AddPlayerInput): Promise<Player> {
    try {
      return await this.gameService.addPlayer(input);
    } catch (error) {
      throw new TTGameError(`Failed to add player with name ${input.name}`, error);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    try {
      return await this.gameService.getAllPlayers();
    } catch (error) {
      throw new TTGameError('Failed to retrieve all players', error);
    }
  }

  async getActivePlayers(): Promise<Player[]> {
    try {
      return await this.gameService.getActivePlayers();
    } catch (error) {
      throw new TTGameError('Failed to retrieve active players', error);
    }
  }

  async getPlayerById(id: number): Promise<Player | null> {
    try {
      return await this.gameService.getPlayerById(id);
    } catch (error) {
      throw new TTGameError(`Failed to retrieve player with ID ${id}`, error);
    }
  }

  // Match methods
  async addMatch(input: AddMatchInput): Promise<Match> {
    try {
      return await this.gameService.addMatch(input);
    } catch (error) {
      throw new TTGameError(`Failed to add match with winners: [${input.winnerIds.join(', ')}]${input.loserIds ? ` and losers: [${input.loserIds.join(', ')}]` : ''}`, error);
    }
  }

  async getMatchById(id: number): Promise<Match> {
    try {
      return await this.gameService.getMatchById(id);
    } catch (error) {
      throw new TTGameError(`Failed to retrieve match with ID ${id}`, error);
    }
  }

  // Month result methods
  async getMonthResult(date: Date): Promise<MonthResultWithPlayer[]> {
    try {
      return await this.gameService.getMonthResult(date);
    } catch (error) {
      throw new TTGameError(`Failed to retrieve month results for ${date.toISOString().slice(0, 7)}`, error);
    }
  }

  async publishMonthResult(date: Date): Promise<void> {
    try {
      return await this.gameService.publishMonthResult(date);
    } catch (error) {
      throw new TTGameError(`Failed to publish month results for ${date.toISOString().slice(0, 7)}`, error);
    }
  }

  // User methods
  async getOrCreateDefaultUser(): Promise<{ id: number; username: string }> {
    try {
      return await this.gameService.getOrCreateDefaultUser();
    } catch (error) {
      throw new TTGameError('Failed to get or create default user', error);
    }
  }
} 