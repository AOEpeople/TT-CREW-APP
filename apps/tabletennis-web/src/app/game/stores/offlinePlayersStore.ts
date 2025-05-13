import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player } from '@/types';

interface OfflinePlayersState {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  clearPlayers: () => void;
}

export const useOfflinePlayersStore = create<OfflinePlayersState>()(
  persist(
    (set) => ({
      players: [],
      setPlayers: (players) => set({ players }),
      clearPlayers: () => set({ players: [] }),
    }),
    {
      name: 'offline-players-storage',
    }
  )
); 