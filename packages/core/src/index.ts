import { createDatabase, DatabaseConfig } from "./db";
import { GameService } from "./services/gameService";
import { Player } from "./models/player";
import { Match } from "./models/match";
import { AddMatchInput } from "./repositories/matchRepository";
import { AddPlayerInput } from "./repositories/playerRepository";
import { MonthResultWithPlayer } from "./repositories/monthResultRepository";

export type { Player, Match, AddMatchInput, AddPlayerInput, MonthResultWithPlayer,DatabaseConfig };

export class TTGameCore {
  private readonly gameService: GameService;

  constructor(config: DatabaseConfig) {
    const db = createDatabase(config);
    this.gameService = new GameService(db);
  }

  // Player methods
  async addPlayer(input: AddPlayerInput): Promise<Player> {
    return this.gameService.addPlayer(input);
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.gameService.getAllPlayers();
  }

  async getActivePlayers(): Promise<Player[]> {
    return this.gameService.getActivePlayers();
  }

  async getPlayerById(id: number): Promise<Player | null> {
    return this.gameService.getPlayerById(id);
  }

  // Match methods
  async addMatch(input: AddMatchInput): Promise<Match> {
    return this.gameService.addMatch(input);
  }

  async getMatchById(id: number): Promise<Match> {
    return this.gameService.getMatchById(id);
  }

  // Month result methods
  async getMonthResult(date: Date): Promise<MonthResultWithPlayer[]> {
    return this.gameService.getMonthResult(date);
  }

  async publishMonthResult(date: Date): Promise<void> {
    return this.gameService.publishMonthResult(date);
  }

  // User methods
  async getOrCreateDefaultUser(): Promise<{ id: number; username: string }> {
    return this.gameService.getOrCreateDefaultUser();
  }
} 