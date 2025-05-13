import { useOfflineMatchesStore } from "../stores/offlineMatchesStore";
import { useNotification } from "@/lib/hooks/useNotification";
import type { Player } from "@/types";
import { addMatch } from "../actions/addMatch";
import { useState } from "react";

export function useSaveMatch() {
  const { addMatch: addOfflineMatch } = useOfflineMatchesStore();
  const { show } = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const saveMatch = async (winners: Player[], losers?: Player[], timestamp?: Date) => {
    setIsSaving(true);
    try {
      // Try server action first
      const formData = new FormData();
      
      // Add all winners
      winners.forEach((winner, index) => {
        formData.append(`winnerId${index + 1}`, winner.id.toString());
      });
      
      // Add all losers if provided
      if (losers) {
        losers.forEach((loser, index) => {
          formData.append(`loserId${index + 1}`, loser.id.toString());
        });
      }
      
      // Add timestamp if provided
      if (timestamp) {
        formData.append("timestamp", timestamp.toISOString());
      }

      await addMatch(formData);
      show("success", `Sieg von ${winners.map(w => w.name + (w.emoji || "")).join(" & ")} gespeichert`);
    } catch (error: unknown) {
      console.error("Failed to save match online:", error);
      
      // Fallback to offline storage
      addOfflineMatch({
        winnerIds: winners.map(w => w.id),
        loserIds: losers?.map(l => l.id),
        enteredBy: 1, // Hardcoded for now, should be replaced with actual user ID
        timestamp,
      });

      show("success", `Sieg von ${winners.map(w => w.name + (w.emoji || "")).join(" & ")} offline gespeichert`);
    } finally {
      setIsSaving(false);
    }
  };

  return { saveMatch, isSaving };
} 