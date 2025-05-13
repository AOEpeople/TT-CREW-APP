import { useOfflineMatchesStore } from '../stores/offlineMatchesStore';
import { useOfflinePlayersStore } from '../stores/offlinePlayersStore';
import { addMatch } from '../actions/addMatch';
import { useNotification } from '@/lib/hooks/useNotification';
import { useState } from 'react';

export function useSyncMatches() {
  const { matches, markMatchesAsSynced } = useOfflineMatchesStore();
  const { players } = useOfflinePlayersStore();
  const { show } = useNotification();
  const [isSyncing, setIsSyncing] = useState(false);

  const syncMatches = async () => {
    const unsyncedMatches = matches.filter(match => !match.synced);
    if (unsyncedMatches.length === 0 || !players) return [];

    setIsSyncing(true);
    const syncedIds: string[] = [];

    try {
      for (const match of unsyncedMatches) {
        try {
          const formData = new FormData();
          
          // Add all winners
          match.winnerIds.forEach((winnerId, index) => {
            formData.append(`winnerId${index + 1}`, winnerId.toString());
          });
          
          // Add all losers if provided
          if (match.loserIds) {
            match.loserIds.forEach((loserId, index) => {
              formData.append(`loserId${index + 1}`, loserId.toString());
            });
          }
          
          // Add timestamp if provided
          if (match.timestamp) {
            formData.append("timestamp", match.timestamp.toISOString());
          }

          await addMatch(formData);
          syncedIds.push(match.id);
        } catch (error) {
          console.error('Failed to sync match:', error);
        }
      }

      if (syncedIds.length > 0) {
        markMatchesAsSynced(syncedIds);
        show("success", `${syncedIds.length} Siege synchronisiert`);
      } else {
        show("error", "Fehler beim Synchronisieren. Bitte später erneut versuchen.");
      }
    } finally {
      setIsSyncing(false);
    }

    return syncedIds;
  };

  return { syncMatches, isSyncing };
} 