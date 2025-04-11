"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Database, Wifi, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Player } from "@/types";

// Import components
import PlayerFilter from "./PlayerFilter";
import PlayerSelection from "./PlayerSelection";
import PlayerList from "./PlayerList";
import { ConfirmationModal } from "./confirmationModal";

// Import utilities
import { getOfflinePlayers, writeOfflinePlayers } from "../utils/playerStorage";
import { getConfirmationMessage } from "../utils/gameUtils";
import { useMatchSaving } from "../hooks/useMatchSaving";
import { useOfflineMatches, getUnsyncedMatches } from "../context/offlineMatchesContext";

interface PlayerGridProps {
  players?: Player[];
}

export default function PlayerGrid(props: Readonly<PlayerGridProps>) {
  const router = useRouter();
  const { saveMatch, isOnlineMode, setOnlineMode } = useMatchSaving();
  const { state } = useOfflineMatches();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiSelection, setIsMultiSelection] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState("");

  const unsyncedMatches = getUnsyncedMatches(state.matches);

  const handlePlayerClick = (player: Player) => {
    if (isMultiSelection) {
      if (selectedPlayers.includes(player)) {
        setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
      } else {
        setSelectedPlayers([...selectedPlayers, player]);
        if (selectedPlayers.length === 1) {
          setIsModalOpen(true);
        }
      }
    } else {
      setSelectedPlayers([player]);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (!props.players) {
      toast.error("Lol DB mal wieder kaputt, nehme offline Backup", {
        dismissible: true,
      });
    }
  }, [props.players]);

  if (props.players) writeOfflinePlayers(props.players);
  const players = props.players || getOfflinePlayers();

  if (!players) {
    return <p>Keine Spieler gefunden, sowohl online, als auch offline</p>;
  }

  const handleConfirm = async () => {
    try {
      // Use the strategy context to save the match
      await saveMatch(selectedPlayers[0], selectedPlayers[1]);
      setSelectedPlayers([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save match:", error);
      toast.error("Fehler beim Speichern des Sieges. Bitte später erneut versuchen.");
    }
  };

  return (
    <div className="flex justify-center flex-col gap-3 p-3 ">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-300"
          onClick={() => router.push("/game/offline-matches")}
          notification={unsyncedMatches.length > 0}
        >
          <Database size={16} />
          Offline Siege
        </Button>

        <div className="flex gap-3 items-center">
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
          
          <span className="text-white font-medium">Losers Cup</span>
          <Switch
            onClick={() => {
              setIsMultiSelection((isMultiSelection) => !isMultiSelection);
              setSelectedPlayers([]);
            }}
          />
        </div>
      </div>

      <PlayerSelection 
        isMultiSelection={isMultiSelection}
        selectedPlayers={selectedPlayers}
      />
      
      <PlayerFilter
        value={filter}
        onChange={setFilter}
      />

      <PlayerList
        players={players}
        filterText={filter}
        selectedPlayers={selectedPlayers}
        onPlayerClick={handlePlayerClick}
      />

      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlayers([]);
          }}
          onConfirm={handleConfirm}
          message={getConfirmationMessage(selectedPlayers)}
        />
      )}
    </div>
  );
}
