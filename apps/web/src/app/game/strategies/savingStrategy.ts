import type { Player } from "@/types";

/**
 * Interface for match saving strategies
 */
export interface MatchSavingStrategy {
  /**
   * Save a match with one or two winners
   * @param winner1 First winner
   * @param winner2 Optional second winner
   * @returns Promise resolved when saving is complete
   */
  saveMatch(winner1: Player, winner2?: Player): Promise<void>;
  
  /**
   * Check if this strategy is available (e.g., online connectivity)
   * @returns Promise resolving to boolean indicating availability
   */
  isAvailable(): Promise<boolean>;
} 