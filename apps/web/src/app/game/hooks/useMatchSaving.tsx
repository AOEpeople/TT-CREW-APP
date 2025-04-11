"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { MatchSavingContext } from "../strategies/matchSavingContext";
import { useOfflineMatches } from "../context/offlineMatchesContext";
import type { Player } from "@/types";

// Create a React context to provide the saving context to components
const MatchSavingReactContext = createContext<{
  saveMatch: (winner1: Player, winner2?: Player) => Promise<void>;
  isOnlineMode: boolean;
  setOnlineMode: (online: boolean) => void;
} | undefined>(undefined);

/**
 * Provider component for match saving strategies
 */
export function MatchSavingProvider({ children }: { children: ReactNode }) {
  const { addMatchToQueue } = useOfflineMatches();
  const [savingContext] = useState(() => new MatchSavingContext(addMatchToQueue));
  const [isOnlineMode, setIsOnlineMode] = useState(true);

  // Set up auto-detection of the best strategy
  useEffect(() => {
    async function detectBestStrategy() {
      await savingContext.detectAndSetBestStrategy();
      // Update the online mode state based on the detected strategy
      const isOnlineAvailable = await savingContext.onlineStrategy.isAvailable();
      setIsOnlineMode(isOnlineAvailable);
    }

    detectBestStrategy();
    
    // Re-detect on network status changes
    const handleOnline = () => {
      console.log("Network connection restored");
      savingContext.useOnlineStrategy();
      setIsOnlineMode(true);
    };
    
    const handleOffline = () => {
      console.log("Network connection lost");
      savingContext.useOfflineStrategy();
      setIsOnlineMode(false);
    };
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [savingContext]);

  // Update the strategy when online mode changes
  useEffect(() => {
    if (isOnlineMode) {
      savingContext.useOnlineStrategy();
    } else {
      savingContext.useOfflineStrategy();
    }
  }, [isOnlineMode, savingContext]);

  // Function to save match with the current strategy
  const saveMatch = async (winner1: Player, winner2?: Player) => {
    await savingContext.saveMatch(winner1, winner2);
  };

  // Function to change the mode (online/offline)
  const setOnlineMode = (online: boolean) => {
    setIsOnlineMode(online);
  };

  const value = {
    saveMatch,
    isOnlineMode,
    setOnlineMode
  };

  return (
    <MatchSavingReactContext.Provider value={value}>
      {children}
    </MatchSavingReactContext.Provider>
  );
}

/**
 * Hook to use match saving functionality
 * @returns Object with saveMatch function and mode controls
 */
export function useMatchSaving() {
  const context = useContext(MatchSavingReactContext);
  
  if (!context) {
    throw new Error("useMatchSaving must be used within a MatchSavingProvider");
  }
  
  return context;
} 