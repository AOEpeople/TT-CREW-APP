"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import type { Player } from "@/types";
import { addMatch } from "../actions/addMatch";

// Storage key for offline matches
const OFFLINE_MATCHES_KEY = "playerMatches";

// Types
export type OfflineMatch = {
  id: string;                // Unique identifier for the match
  playerId: number;          // Player ID
  displayName: string;       // Player name with emoji
  timestamp: string;         // ISO timestamp
  synced: boolean;           // Whether this has been synced to the server
  groupId: string | null;    // Matches with the same groupId belong together (e.g. in Losers Cup)
  isSecondaryWinner: boolean; // Whether this is a secondary winner in a group
};

// Action types
type Action = 
  | { type: "ADD_MATCH"; payload: { 
      player: Player; 
      options?: { 
        groupId?: string; 
        isSecondaryWinner?: boolean; 
      }
    }}
  | { type: "MARK_SYNCED"; payload: { matchIds: string[] } }
  | { type: "REMOVE_MATCHES"; payload: { matchIds: string[] } }
  | { type: "CLEAR_ALL" }
  | { type: "LOAD_MATCHES"; payload: { matches: OfflineMatch[] } };

// State type
type State = {
  matches: OfflineMatch[];
  loading: boolean;
};

// Initial state
const initialState: State = {
  matches: [],
  loading: true
};

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOAD_MATCHES":
      return {
        ...state,
        matches: action.payload.matches,
        loading: false
      };
      
    case "ADD_MATCH": {
      const { player, options = {} } = action.payload;
      const { groupId = null, isSecondaryWinner = false } = options;
      
      const newMatch: OfflineMatch = {
        id: crypto.randomUUID(),
        playerId: player.id,
        displayName: player.name + (player.emoji || ""),
        timestamp: new Date().toISOString(),
        synced: false,
        groupId,
        isSecondaryWinner
      };
      
      return {
        ...state,
        matches: [...state.matches, newMatch]
      };
    }
      
    case "MARK_SYNCED": {
      const { matchIds } = action.payload;
      const updatedMatches = state.matches.map(match => 
        matchIds.includes(match.id) ? { ...match, synced: true } : match
      );
      
      return {
        ...state,
        matches: updatedMatches
      };
    }
      
    case "REMOVE_MATCHES": {
      const { matchIds } = action.payload;
      return {
        ...state,
        matches: state.matches.filter(match => !matchIds.includes(match.id))
      };
    }
      
    case "CLEAR_ALL":
      return {
        ...state,
        matches: []
      };
      
    default:
      return state;
  }
};

// Context
type ContextValue = {
  state: State;
  addMatchToQueue: (player: Player, options?: { groupId?: string; isSecondaryWinner?: boolean; }) => void;
  markMatchesAsSynced: (matchIds: string[]) => void;
  removeMatchesFromQueue: (matchIds: string[]) => void;
  clearAllMatches: () => void;
  syncMatches: (players: Player[]) => Promise<string[]>;
};

const OfflineMatchesContext = createContext<ContextValue | undefined>(undefined);

// Provider component
interface ProviderProps {
  children: ReactNode;
}

export const OfflineMatchesProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Load matches from localStorage on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storedMatches = JSON.parse(
        localStorage.getItem(OFFLINE_MATCHES_KEY) || "[]"
      );
      dispatch({ 
        type: "LOAD_MATCHES", 
        payload: { matches: storedMatches } 
      });
    } catch (e) {
      console.error("Error loading offline matches:", e);
      dispatch({ 
        type: "LOAD_MATCHES", 
        payload: { matches: [] } 
      });
    }
  }, []);
  
  // Save matches to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined' || state.loading) return;
    localStorage.setItem(OFFLINE_MATCHES_KEY, JSON.stringify(state.matches));
  }, [state.matches, state.loading]);
  
  // Actions
  const addMatchToQueue = (
    player: Player, 
    options?: { 
      groupId?: string; 
      isSecondaryWinner?: boolean; 
    }
  ) => {
    dispatch({ 
      type: "ADD_MATCH", 
      payload: { player, options } 
    });
    
    // Only show toast for primary winners or single winners
    if (!options?.isSecondaryWinner) {
      toast.success(`Sieg von ${player.name}${player.emoji || ""} offline gespeichert`, {
        duration: 2000,
      });
    }
  };
  
  const markMatchesAsSynced = (matchIds: string[]) => {
    dispatch({ type: "MARK_SYNCED", payload: { matchIds } });
  };
  
  const removeMatchesFromQueue = (matchIds: string[]) => {
    dispatch({ type: "REMOVE_MATCHES", payload: { matchIds } });
  };
  
  const clearAllMatches = () => {
    dispatch({ type: "CLEAR_ALL" });
  };
  
  // Helper functions for syncing
  const syncGroupedMatch = async (
    primaryMatch: OfflineMatch, 
    secondaryMatch: OfflineMatch, 
    players: Player[]
  ): Promise<string[]> => {
    // Find both players
    const player1 = players.find(p => p.id === primaryMatch.playerId);
    const player2 = players.find(p => p.id === secondaryMatch.playerId);
    
    if (!player1 || !player2) {
      console.error(`Could not find players for matches: ${primaryMatch.id}, ${secondaryMatch.id}`);
      return [];
    }
    
    // Create form data with both winners
    const formData = new FormData();
    formData.append("winnerId1", player1.id.toString());
    formData.append("winnerId2", player2.id.toString());
    
    // Send to server
    await addMatch(formData);
    
    // Return the IDs of synced matches
    return [primaryMatch.id, secondaryMatch.id];
  };

  const syncSingleMatch = async (
    match: OfflineMatch, 
    players: Player[]
  ): Promise<string[]> => {
    const player = players.find(p => p.id === match.playerId);
    
    if (!player) {
      console.error(`Player with ID ${match.playerId} not found`);
      return [];
    }
    
    // Create form data and send to server
    const formData = new FormData();
    formData.append("winnerId1", player.id.toString());
    
    await addMatch(formData);
    
    // Return the ID of the synced match
    return [match.id];
  };

  const syncMatches = async (players: Player[]): Promise<string[]> => {
    const unsyncedMatches = state.matches.filter(match => !match.synced);
    const syncedIds: string[] = [];
    
    // Group matches by their groupId for proper syncing
    const matchGroups = new Map<string | null, OfflineMatch[]>();
    
    // Group matches with the same groupId together
    for (const match of unsyncedMatches) {
      const key = match.groupId || match.id; // Use match ID as key for non-grouped matches
      if (!matchGroups.has(key)) {
        matchGroups.set(key, []);
      }
      matchGroups.get(key)!.push(match);
    }
    
    // Process each group
    for (const [groupId, groupMatches] of matchGroups.entries()) {
      try {
        let newSyncedIds: string[] = [];
        
        if (groupMatches.length === 2 && groupId !== null) {
          // This is a paired match, find primary and secondary winners
          const primaryMatch = groupMatches.find(m => !m.isSecondaryWinner);
          const secondaryMatch = groupMatches.find(m => m.isSecondaryWinner);
          
          if (primaryMatch && secondaryMatch) {
            newSyncedIds = await syncGroupedMatch(primaryMatch, secondaryMatch, players);
          }
        } else {
          // Single match, handle normally
          newSyncedIds = await syncSingleMatch(groupMatches[0], players);
        }
        
        // Add newly synced IDs to the list
        syncedIds.push(...newSyncedIds);
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to sync match group ${groupId}:`, error);
      }
    }
    
    if (syncedIds.length > 0) {
      markMatchesAsSynced(syncedIds);
      toast.success(`${syncedIds.length} Siege erfolgreich synchronisiert`);
    }
    
    return syncedIds;
  };
  
  const value = {
    state,
    addMatchToQueue,
    markMatchesAsSynced,
    removeMatchesFromQueue,
    clearAllMatches,
    syncMatches
  };
  
  return (
    <OfflineMatchesContext.Provider value={value}>
      {children}
    </OfflineMatchesContext.Provider>
  );
};

// Custom hook for using the context
export const useOfflineMatches = () => {
  const context = useContext(OfflineMatchesContext);
  if (context === undefined) {
    throw new Error('useOfflineMatches must be used within an OfflineMatchesProvider');
  }
  return context;
};

// Helper functions for direct access to state data
export const getUnsyncedMatches = (matches: OfflineMatch[]): OfflineMatch[] => {
  return matches.filter(match => !match.synced);
}; 