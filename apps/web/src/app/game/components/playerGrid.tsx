"use client";

import addMatch from "../actions/addMatch";
import { useEffect, useState } from "react";

import PlayerTile from "./playerTile";
import { ConfirmationModal } from "./confirmationModal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export interface Player {
  id: number;
  name: string;
  emoji: string | null;
  priority: number;
}

interface PlayerGridProps {
  players?: Player[];
}

export default function PlayerGrid(props: Readonly<PlayerGridProps>) {
  "use client";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiSelection, setIsMultiSelection] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const [filter, setFilter] = useState("");

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

  const handleConfirm = () => {
    sendWinnerToDB(selectedPlayers[0], selectedPlayers[1]);
    setSelectedPlayers([]);
    setIsModalOpen(false);
  };

  const currentOfflinePlayerMatches: OfflinePlayerMatch[] =
    localStorage && JSON.parse(localStorage.getItem("playerMatches") || "[]");

  return (
    <div className="flex justify-center flex-col gap-3 p-3 ">
      <div className="flex gap-3 justify-end items-center">
        <span className="text-white font-medium">Losers Cup</span>
        <Switch
          onClick={() => {
            setIsMultiSelection((isMultiSelection) => !isMultiSelection);
            setSelectedPlayers([]);
          }}
        />
      </div>
      {isMultiSelection && (
        <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
          <p className="text-white font-medium mb-1">Wähle zwei Spieler aus, die gewonnen haben</p>
          <p className="text-slate-300 text-sm mb-2">
            {selectedPlayers.length === 0 
              ? "Noch keine Spieler ausgewählt" 
              : selectedPlayers.length === 1 
                ? "Noch ein Spieler auswählen" 
                : "Beide Spieler ausgewählt"}
          </p>
          <div className="flex items-center gap-2 min-h-[32px]">
            {selectedPlayers.length > 0 ? (
              <>
                <span className="text-slate-300 text-sm">Ausgewählte Spieler:</span>
                <div className="flex gap-2">
                  {selectedPlayers.map((player, index) => (
                    <div 
                      key={player.id} 
                      className={`px-2 py-1 rounded text-sm ${
                        index === 0 
                          ? "bg-yellow-600/70 text-white font-medium" 
                          : "bg-slate-700/70 text-slate-300"
                      }`}
                    >
                      {player.name} {player.emoji}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <span className="text-slate-400 text-sm italic">Keine Spieler ausgewählt</span>
            )}
          </div>
        </div>
      )}
      <Input
        type="text"
        name="filter"
        placeholder="Spieler suchen..."
        required
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500"
      />

      <div className="flex flex-wrap gap-10 justify-center">
        {players
          .filter((player) =>
            player.name.toLowerCase().includes(filter.toLowerCase()),
          )
          .toSorted((a, b) => a.priority - b.priority)
          .map((player) => (
            <PlayerTile
              key={player.id}
              name={player.name}
              selected={selectedPlayers.includes(player)}
              selectionIndex={selectedPlayers.findIndex(p => p.id === player.id)}
              emoji={player.emoji || "👾"}
              onClick={() => handlePlayerClick(player)}
            />
          ))}
      </div>
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
      {currentOfflinePlayerMatches.length > 0 && (
        <div>
          <h3>Offline gespeicherte Siege:</h3>
          <ul>
            {currentOfflinePlayerMatches.map((playerMatch) => (
              <li key={playerMatch.timestamp}>
                {playerMatch.displayName} - {playerMatch.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function getOfflinePlayers(): Player[] | undefined {
  try {
    const offlinePlayerJSON = localStorage.getItem("playerBackup");
    if (!offlinePlayerJSON) return undefined;
    return JSON.parse(offlinePlayerJSON) as Player[];
  } catch (e) {
    console.error("Error while reading offline players", e);
    return undefined;
  }
}

function writeOfflinePlayers(players: Player[]) {
  localStorage.setItem("playerBackup", JSON.stringify(players));
}

function getConfirmationMessage(selectedPlayers: Player[]) {
  if (selectedPlayers.length === 1) {
    return `Hat ${selectedPlayers[0].name} gewonnen?`;
  } else if (selectedPlayers.length === 2) {
    return `Haben ${selectedPlayers[0].name} und ${selectedPlayers[1].name} gewonnen?`;
  }
  return "Hier ist irgendwas schiefgelaufen";
}

function sendWinnerToDB(winner1: Player, winner2?: Player) {
  const formData = new FormData();
  formData.append("winnerId1", winner1.id.toString());
  if (winner2) {
    formData.append("winnerId2", winner2.id.toString());
  }
  console.log(
    "sending Formdata:",
    formData.keys().next().value,
    formData.entries().next().value,
  );
  const addPlayerAndToast = (i = 1) => {
    if (i === 4) {
      toast.error(
        "Der Server scheint nicht zu funktionieren, der Punkt wird erstmal offline gespeichert.",
        { dismissible: true },
      );
      writePlayerMatchToLocalStorage(winner1);
      if (winner2) {
        writePlayerMatchToLocalStorage(winner2);
      }
    } else {
      const addMatchPromise = addMatch(formData);
      toast.promise(addMatchPromise, {
        closeButton: true,
        loading:
          i == 1
            ? `Versuche Sieg einzutragen...`
            : `Dann probieren wir es noch ein ${i}tes Mal, den Sieg einzutragen...`,
        success: `Glückwunsch! Cola und Fortnite für ${winner1.name}${winner1.emoji} ${winner2 ? " und " + winner2.name + winner2.emoji : ""}`,
        error: () => {
          addPlayerAndToast(i + 1);
          return `Fehler beim ${i}ten Versuch, ${winner1.name}${winner1.emoji} einzutragen...`;
        },
      });
    }
  };
  addPlayerAndToast();
}

const writePlayerMatchToLocalStorage = (player: Player) => {
  const playerMatch = {
    player: player.id,
    displayName: player.name + player.emoji,

    timestamp: new Date().toISOString(),
  };
  const playerMatches: OfflinePlayerMatch[] = JSON.parse(
    localStorage.getItem("playerMatches") ?? "[]",
  );
  playerMatches.push(playerMatch);
  localStorage.setItem("playerMatches", JSON.stringify(playerMatches));
  toast.success(`Sieg von ${player.name}${player.emoji} offline gespeichert`, {
    dismissible: true,
  });
};

type OfflinePlayerMatch = {
  player: number;
  displayName: string;
  timestamp: string;
};
