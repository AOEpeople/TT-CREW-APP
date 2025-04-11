import type { Player } from "@/types";
import { addMatch } from "../actions/addMatch";
import { toast } from "sonner";
import { MatchSavingStrategy } from "./savingStrategy";

/**
 * Strategy for saving matches using server actions
 */
export class OnlineSavingStrategy implements MatchSavingStrategy {
  /**
   * Number of retries before considering the server unavailable
   */
  private readonly maxRetries = 3;
  
  /**
   * Check if online saving is available by attempting a network request
   */
  async isAvailable(): Promise<boolean> {
    try {
      // A simple connectivity check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn("Online strategy unavailable:", error);
      return false;
    }
  }
  
  /**
   * Save match using server actions
   */
  async saveMatch(winner1: Player, winner2?: Player): Promise<void> {
    const formData = new FormData();
    formData.append("winnerId1", winner1.id.toString());
    if (winner2) {
      formData.append("winnerId2", winner2.id.toString());
    }

    // Try adding the match with retries
    let lastError: unknown;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const loadingMessage = attempt === 1
          ? `Versuche Sieg einzutragen...`
          : `Dann probieren wir es noch ein ${attempt}tes Mal, den Sieg einzutragen...`;
        
        // Display a loading toast that will be updated with the result
        const toastPromise = addMatch(formData);
        
        const successMessage = winner2 
          ? `Glückwunsch! Cola und Fortnite für ${winner1.name}${winner1.emoji} und ${winner2.name}${winner2.emoji}`
          : `Glückwunsch! Cola und Fortnite für ${winner1.name}${winner1.emoji}`;
        
        await toast.promise(toastPromise, {
          loading: loadingMessage,
          success: successMessage,
          error: `Fehler beim ${attempt}ten Versuch, ${winner1.name}${winner1.emoji} einzutragen...`,
          closeButton: true,
        });
        
        // If we reach here, the match was saved successfully
        return;
      } catch (error) {
        console.error(`Failed to save match (attempt ${attempt}/${this.maxRetries}):`, error);
        lastError = error;
        
        // If not the last attempt, wait a bit before retrying
        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // If we get here, all attempts failed
    throw lastError || new Error("Failed to save match after multiple attempts");
  }
} 