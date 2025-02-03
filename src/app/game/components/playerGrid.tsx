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
        setSelectedPlayers(selectedPlayers.filter(p => p !== player));
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
      <div className="flex gap-3 justify-end">
        Losers Cup
        <Switch onClick={() => { setIsMultiSelection((isMultiSelection) => !isMultiSelection); setSelectedPlayers([]) }} />
      </div>
      {isMultiSelection && <p>Wähle zwei Spieler aus, die gewonnen haben</p>}
      <Input
        type="text"
        name="filter"
        placeholder="Spieler suchen..."
        required
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="flex flex-wrap gap-10 justify-center">
        {players
          .filter((player) => player.name.toLowerCase().includes(filter.toLowerCase()))
          .toSorted((a, b) => a.priority - b.priority)
          .map((player) => (
            <PlayerTile
              key={player.id}
              name={player.name}
              selected={selectedPlayers.includes(player)}
              emoji={player.emoji || "👾"}
              onClick={() => handlePlayerClick(player)}
            />
          ))}
      </div>
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedPlayers([]) }}
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
    formData.entries().next().value
  );
  const addPlayerAndToast = (i = 1) => {
    if (i === 4) {
      toast.error(
        "Der Schissl scheint nicht zu funktionieren, der Punkt wird erstmal offline gespeichert.",
        { dismissible: true }
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
            : `Dann probieren wir es halt noch ein ${i}tes mal den Sieg einzutragen...`,
        success: `Wuhu Cola und Forntnite für ${winner1.name}${winner1.emoji} ${winner2 ? " und " + winner2.name + winner2.emoji : ""}`,
        error: () => {
          addPlayerAndToast(i + 1);
          return `Fehler beim ${i}ten Versuch, ${winner1.name}${winner1.emoji} einzutragen...`;
        },
      },);
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
    localStorage.getItem("playerMatches") ?? "[]"
  );
  playerMatches.push(playerMatch);
  localStorage.setItem("playerMatches", JSON.stringify(playerMatches));
  toast.success(
    `Sieg von ${player.name}${player.emoji} offline gespeichert`,
    { dismissible: true }
  );

};

type OfflinePlayerMatch = {
  player: number;
  displayName: string;
  timestamp: string;
};