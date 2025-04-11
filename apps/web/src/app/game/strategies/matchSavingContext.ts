import type { Player } from "@/types";
import { MatchSavingStrategy } from "./savingStrategy";
import { OnlineSavingStrategy } from "./onlineSavingStrategy";
import { OfflineSavingStrategy } from "./offlineSavingStrategy";

/**
 * Context class that manages different saving strategies
 */
export class MatchSavingContext {
  private strategy: MatchSavingStrategy;
  // Making these public so they can be accessed by the hook
  public readonly onlineStrategy: OnlineSavingStrategy;
  public readonly offlineStrategy: OfflineSavingStrategy;
  private isAutoFallbackEnabled: boolean = true;

  /**
   * Create a new MatchSavingContext
   * @param addMatchToQueue Function from the reducer to add matches to offline queue
   */
  constructor(addMatchToQueue: (player: Player) => void) {
    this.onlineStrategy = new OnlineSavingStrategy();
    this.offlineStrategy = new OfflineSavingStrategy(addMatchToQueue);
    
    // Default to online strategy initially, but will auto-detect based on availability
    this.strategy = this.onlineStrategy;
  }

  /**
   * Get the current strategy
   */
  public getCurrentStrategy(): MatchSavingStrategy {
    return this.strategy;
  }

  /**
   * Set the current strategy
   * @param strategy The strategy to use
   */
  public setStrategy(strategy: MatchSavingStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Set whether to automatically fallback to offline when online is unavailable
   * @param enabled Whether automatic fallback is enabled
   */
  public setAutoFallback(enabled: boolean): void {
    this.isAutoFallbackEnabled = enabled;
  }

  /**
   * Use the online strategy
   */
  public useOnlineStrategy(): void {
    this.strategy = this.onlineStrategy;
  }

  /**
   * Use the offline strategy
   */
  public useOfflineStrategy(): void {
    this.strategy = this.offlineStrategy;
  }

  /**
   * Detect the best available strategy and use it
   */
  public async detectAndSetBestStrategy(): Promise<void> {
    // Check if online strategy is available
    const isOnlineAvailable = await this.onlineStrategy.isAvailable();
    
    if (isOnlineAvailable) {
      this.strategy = this.onlineStrategy;
    } else {
      this.strategy = this.offlineStrategy;
    }
  }

  /**
   * Check if currently using the online strategy
   */
  public isUsingOnlineStrategy(): boolean {
    return this.strategy === this.onlineStrategy;
  }

  /**
   * Save a match using the current strategy
   * @param winner1 First winner
   * @param winner2 Optional second winner
   */
  public async saveMatch(winner1: Player, winner2?: Player): Promise<void> {
    try {
      // Try to use the current strategy
      await this.strategy.saveMatch(winner1, winner2);
    } catch (error) {
      // If auto fallback is enabled and the current strategy failed
      if (this.isAutoFallbackEnabled && this.strategy === this.onlineStrategy) {
        console.warn("Online saving failed, falling back to offline strategy", error);
        // Fall back to offline strategy
        await this.offlineStrategy.saveMatch(winner1, winner2);
      } else {
        // Otherwise, propagate the error
        throw error;
      }
    }
  }
} 