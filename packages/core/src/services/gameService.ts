import { LibSQLDatabase } from "drizzle-orm/libsql";
import { schema } from "../db";
import { Match } from "../models/match";
import { Player } from "../models/player";
import { AddMatchInput, MatchRepository } from "../repositories/matchRepository";
import { MonthResultRepository, MonthResultWithPlayer } from "../repositories/monthResultRepository";
import { AddPlayerInput, PlayerRepository } from "../repositories/playerRepository";
import { UserRepository } from "../repositories/userRepository";

export class GameService {
  private matchRepository: MatchRepository;
  private playerRepository: PlayerRepository;
  private monthResultRepository: MonthResultRepository;
  private userRepository: UserRepository;

  constructor(db: LibSQLDatabase<typeof schema>) {
    this.matchRepository = new MatchRepository(db);
    this.playerRepository = new PlayerRepository(db);
    this.monthResultRepository = new MonthResultRepository(db);
    this.userRepository = new UserRepository(db);
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return this.playerRepository.getAllPlayers();
  }

  async getActivePlayers(): Promise<Player[]> {
    return this.playerRepository.getActivePlayers();
  }

  async getPlayerById(id: number): Promise<Player | null> {
    return this.playerRepository.getPlayerById(id);
  }

  async addPlayer(input: AddPlayerInput): Promise<Player> {
    return this.playerRepository.addPlayer(input);
  }

  // Match methods
  async addMatch(input: AddMatchInput): Promise<Match> {
    return this.matchRepository.addMatch(input);
  }

  async getMatchById(id: number): Promise<Match> {
    return this.matchRepository.getMatchById(id);
  }

  // Month result methods
  async getMonthResult(date: Date): Promise<MonthResultWithPlayer[]> {
    return this.monthResultRepository.getMonthResult(date);
  }

  async publishMonthResult(date: Date): Promise<void> {
    return this.monthResultRepository.publishMonthResult(date);
  }

  // User methods
  async getOrCreateDefaultUser(): Promise<{ id: number; username: string }> {
    return this.userRepository.getOrCreateDefaultUser();
  }
} 