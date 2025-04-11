import type { Player } from "@/types";
import { MatchSavingStrategy } from "./savingStrategy";
import { toast } from "sonner";

/**
 * Strategy for saving matches to local storage using reducer
 */
export class OfflineSavingStrategy implements MatchSavingStrategy {
  /**
   * Reference to the addMatchToQueue function from our reducer context
   */
  private addMatchToQueue: (player: Player, options?: {
    groupId?: string;
    isSecondaryWinner?: boolean;
  }) => void;

  /**
   * Constructor that accepts the addMatchToQueue function from our context
   */
  constructor(addMatchToQueue: (player: Player, options?: {
    groupId?: string;
    isSecondaryWinner?: boolean;
  }) => void) {
    this.addMatchToQueue = addMatchToQueue;
  }

  /**
   * Offline strategy is always available
   */
  async isAvailable(): Promise<boolean> {
    return true;
  }

  /**
   * Save match using the reducer-based state management
   */
  async saveMatch(winner1: Player, winner2?: Player): Promise<void> {
    toast.error(
      "Der Server ist nicht erreichbar, der Punkt wird offline gespeichert.",
      { dismissible: true }
    );

    if (winner2) {
      // If there are two winners, create a group
      const groupId = crypto.randomUUID();
      
      // Add the primary winner
      this.addMatchToQueue(winner1, { groupId, isSecondaryWinner: false });
      
      // Add the secondary winner with the same groupId
      this.addMatchToQueue(winner2, { groupId, isSecondaryWinner: true });
      
      toast.success(
        `Gruppenpartie zwischen ${winner1.name}${winner1.emoji || ""} und ${winner2.name}${winner2.emoji || ""} offline gespeichert`, 
        { duration: 2000 }
      );
    } else {
      // Just a single winner, add normally
      this.addMatchToQueue(winner1);
    }
  }
} 