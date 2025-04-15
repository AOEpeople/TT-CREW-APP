"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useOfflineMatchesStore, type OfflineMatch } from "../stores/offlineMatchesStore";
import { useOfflinePlayersStore } from "../stores/offlinePlayersStore";
import { useSyncMatches } from "../hooks/useSyncMatches";
import { useNotification } from "@/lib/hooks/useNotification";
import type { Player } from "@/types";
import { MatchTable } from "./components/MatchTable";
import { MatchStats } from "./components/MatchStats";
import { MatchActions } from "./components/MatchActions";

interface DisplayMatch {
  id: string;
  winners: string[];
  losers?: string[];
  timestamp: Date;
  synced: boolean;
}

function organizeMatchesForDisplay(matches: OfflineMatch[], players: Player[] | undefined): DisplayMatch[] {
  if (!matches) return [];
  
  return matches
    .filter((match): match is OfflineMatch => 
      match !== null && 
      match !== undefined && 
      Array.isArray(match.winnerIds) && 
      match.winnerIds.length > 0
    )
    .map(match => {
      const winners = match.winnerIds.map((id: number) => 
        players?.find(p => p.id === id)?.name || `Player ${id}`
      );
      const losers = match.loserIds?.map((id: number) => 
        players?.find(p => p.id === id)?.name || `Player ${id}`
      );

      return {
        id: match.id,
        winners,
        losers,
        timestamp: match.timestamp || new Date(match.id), // Fallback to ID as timestamp if not provided
        synced: match.synced
      };
    });
}

export default function OfflineMatchesPage() {
  const { matches, removeMatches } = useOfflineMatchesStore();
  const { players } = useOfflinePlayersStore();
  const { syncMatches, isSyncing } = useSyncMatches();
  const { show } = useNotification();
  const [isLoading, setIsLoading] = useState(true);

  const unsyncedMatches = matches.filter(match => !match.synced);

  // Process matches for display
  const organizedMatches = useMemo(() => {
    return organizeMatchesForDisplay(matches, players);
  }, [matches, players]);

  useEffect(() => {
    // Set loading to false after initial render
    setIsLoading(false);
  }, []);

  const handleSync = async () => {
    await syncMatches();
  };
  
  const handleRemoveSynced = () => {
    const syncedIds = matches
      .filter(match => match.synced)
      .map(match => match.id);
    
    if (syncedIds.length > 0) {
      removeMatches(syncedIds);
      show("success", `${syncedIds.length} synchronisierte Siege gelöscht`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/game">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-white"
          >
            <ArrowLeft size={16} />
            Zurück zum Spiel
          </Button>
        </Link>
        
        <h1 className="text-xl font-bold text-center text-white">Offline gespeicherte Siege</h1>
      </div>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <MatchStats 
            totalMatches={matches.length}
            unsyncedMatches={unsyncedMatches.length}
          />
          
          <MatchActions
            hasUnsyncedMatches={unsyncedMatches.length > 0}
            hasSyncedMatches={matches.some(m => m.synced)}
            isSyncing={isSyncing}
            onSync={handleSync}
            onRemoveSynced={handleRemoveSynced}
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">
            Lade gespeicherte Siege...
          </div>
        ) : (
          <MatchTable matches={organizedMatches} />
        )}
      </div>
    </div>
  );
} 