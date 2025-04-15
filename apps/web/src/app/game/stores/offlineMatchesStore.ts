import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OfflineMatch = {
  winnerIds: number[];
  loserIds?: number[];
  enteredBy: number;
  timestamp?: Date;
  synced: boolean;
  id: string;
};

interface OfflineMatchesState {
  matches: OfflineMatch[];
  addMatch: (match: Omit<OfflineMatch, 'synced' | 'id'>) => void;
  markMatchesAsSynced: (matchIds: string[]) => void;
  removeMatches: (matchIds: string[]) => void;
  clearAll: () => void;
}

export const useOfflineMatchesStore = create<OfflineMatchesState>()(
  persist(
    (set) => ({
      matches: [],
      
      addMatch: (match) => {
        const newMatch: OfflineMatch = {
          ...match,
          synced: false,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          matches: [...state.matches, newMatch]
        }));
      },
      
      markMatchesAsSynced: (matchIds) => {
        set((state) => ({
          matches: state.matches.map((match) =>
            matchIds.includes(match.id) ? { ...match, synced: true } : match
          )
        }));
      },
      
      removeMatches: (matchIds) => {
        set((state) => ({
          matches: state.matches.filter((match) => !matchIds.includes(match.id))
        }));
      },
      
      clearAll: () => {
        set({ matches: [] });
      },
    }),
    {
      name: 'offline-matches-storage'
    }
  )
); 