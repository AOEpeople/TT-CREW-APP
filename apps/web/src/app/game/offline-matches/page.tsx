"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Wifi, WifiOff } from "lucide-react";
import { useOfflineMatches, getUnsyncedMatches, OfflineMatch } from "../context/offlineMatchesContext";
import { getOfflinePlayers } from "../utils/playerStorage";
import { useMatchSaving } from "../hooks/useMatchSaving";
import { toast } from "sonner";

// Type for organized matches
interface OrganizedMatch {
  id: string;
  primaryId: string;
  secondaryId: string | null;
  isGroup: boolean;
  primaryPlayer: string;
  secondaryPlayer: string | null;
  timestamp: string;
  synced: boolean;
}

// Function to organize matches for display, grouping related players
function organizeMatchesForDisplay(matches: OfflineMatch[]): OrganizedMatch[] {
  const result: OrganizedMatch[] = [];
  const processedIds = new Set<string>();
  
  for (const match of matches) {
    // Skip already processed matches
    if (processedIds.has(match.id)) continue;
    
    // If this match is part of a group, find its partner
    if (match.groupId && !match.isSecondaryWinner) {
      const secondaryMatch = matches.find(
        m => m.groupId === match.groupId && m.isSecondaryWinner
      );
      
      if (secondaryMatch) {
        // Add both matches as a group
        result.push({
          id: match.id,
          primaryId: match.id,
          secondaryId: secondaryMatch.id,
          isGroup: true,
          primaryPlayer: match.displayName,
          secondaryPlayer: secondaryMatch.displayName,
          timestamp: match.timestamp,
          synced: match.synced && secondaryMatch.synced
        });
        
        // Mark both as processed
        processedIds.add(match.id);
        processedIds.add(secondaryMatch.id);
        continue;
      }
    }
    
    // Skip secondary winners without their primary partner
    if (match.isSecondaryWinner) {
      processedIds.add(match.id);
      continue;
    }
    
    // Add single match
    result.push({
      id: match.id,
      primaryId: match.id,
      secondaryId: null,
      isGroup: false,
      primaryPlayer: match.displayName,
      secondaryPlayer: null,
      timestamp: match.timestamp,
      synced: match.synced
    });
    
    processedIds.add(match.id);
  }
  
  return result;
}

export default function OfflineMatchesPage() {
  const router = useRouter();
  const { state, syncMatches, clearAllMatches, removeMatchesFromQueue } = useOfflineMatches();
  const { isOnlineMode, setOnlineMode } = useMatchSaving();
  const [isSyncing, setIsSyncing] = useState(false);
  const [players, setPlayers] = useState(getOfflinePlayers() || []);
  
  const unsyncedMatches = getUnsyncedMatches(state.matches);

  // Process matches for display
  const organizedMatches = useMemo(() => {
    return organizeMatchesForDisplay(state.matches);
  }, [state.matches]);

  useEffect(() => {
    // Update players from localStorage if needed
    setPlayers(getOfflinePlayers() || []);
  }, []);

  const handleSync = async () => {
    if (unsyncedMatches.length === 0 || !players) return;
    
    setIsSyncing(true);
    try {
      const syncedIds = await syncMatches(players);
      
      // Count individual matches and groups
      const syncedMatches = state.matches.filter(m => syncedIds.includes(m.id));
      const groupedMatches = syncedMatches.filter(m => m.groupId !== null);
      const groupCount = new Set(groupedMatches.map(m => m.groupId)).size;
      const singleCount = syncedMatches.length - groupedMatches.length;
      
      // Show more detailed toast
      if (syncedIds.length > 0) {
        let message = `${syncedIds.length} Siege synchronisiert`;
        if (groupCount > 0) {
          message += ` (${groupCount} Doppelfinale, ${singleCount} Einzelsiege)`;
        }
        toast.success(message);
      }
    } catch (error) {
      console.error("Error syncing matches:", error);
      toast.error("Fehler beim Synchronisieren");
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleRemoveSynced = () => {
    const syncedIds = state.matches
      .filter(match => match.synced)
      .map(match => match.id);
    
    if (syncedIds.length > 0) {
      removeMatchesFromQueue(syncedIds);
    }
  };

  if (state.loading) {
    return <div className="p-6 text-center text-white">Lade Offline-Matches...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-white"
          onClick={() => router.push("/game")}
        >
          <ArrowLeft size={16} />
          Zurück zum Spiel
        </Button>
        
        <h1 className="text-xl font-bold text-center text-white">Offline gespeicherte Siege</h1>
        
        <Button 
          variant="ghost" 
          size="sm"
          className={`gap-2 ${isOnlineMode ? 'text-green-400' : 'text-yellow-400'}`}
          onClick={() => setOnlineMode(!isOnlineMode)}
        >
          {isOnlineMode ? (
            <>
              <Wifi size={16} />
              Online Modus
            </>
          ) : (
            <>
              <WifiOff size={16} />
              Offline Modus
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-medium text-white mb-1">
              {state.matches.length} gespeicherte Siege
            </p>
            <p className="text-sm text-slate-400">
              {unsyncedMatches.length} nicht synchronisiert
            </p>
          </div>
          
          <div className="flex gap-2">
            {unsyncedMatches.length > 0 && (
              <Button 
                onClick={handleSync}
                disabled={isSyncing || !isOnlineMode}
                className="gap-2"
              >
                {isSyncing ? "Synchronisiere..." : "Alle synchronisieren"}
              </Button>
            )}
            
            {state.matches.some(m => m.synced) && (
              <Button 
                variant="destructive" 
                onClick={handleRemoveSynced}
                className="gap-2 text-white"
              >
                <Trash2 size={16} />
                Synchronisierte löschen
              </Button>
            )}
          </div>
        </div>
        
        {state.matches.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Keine gespeicherten Siege vorhanden
          </div>
        ) : (
          <div className="overflow-auto max-h-[60vh]">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Spieler</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Datum</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {organizedMatches.map(match => (
                  <tr key={match.id} className="border-b border-slate-700/40 hover:bg-slate-700/20">
                    <td className="py-3 px-4 text-white">
                      {match.primaryPlayer}
                      {match.isGroup && (
                        <span className="text-yellow-400 ml-2">
                          + {match.secondaryPlayer}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {new Date(match.timestamp).toLocaleString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        match.synced 
                          ? "bg-green-900/30 text-green-400 border border-green-700" 
                          : "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
                      }`}>
                        {match.synced ? "Synchronisiert" : "Nicht synchronisiert"}
                      </span>
                      {match.isGroup && (
                        <span className="ml-2 px-2 py-1 rounded-md text-xs bg-blue-900/30 text-blue-400 border border-blue-700">
                          Doppelfinale
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {state.matches.length > 0 && (
        <div className="flex justify-center">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={clearAllMatches}
            className="gap-2 text-white"
          >
            <Trash2 size={16} />
            Alle Einträge löschen
          </Button>
        </div>
      )}
    </div>
  );
} 