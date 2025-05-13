import type { Player } from "@/types";
import PlayerTile from "./playerTile";

interface PlayerListProps {
  players: Player[];
  filterText: string;
  selectedPlayers: Player[];
  onPlayerClick: (player: Player) => void;
}

export const PlayerList = ({ players, filterText, selectedPlayers, onPlayerClick }: PlayerListProps) => (
  <div className="flex flex-wrap gap-10 justify-center">
    {players
      .filter((player) =>
        player.name.toLowerCase().includes(filterText.toLowerCase()),
      )
      .toSorted((a, b) => a.priority - b.priority)
      .map((player) => (
        <PlayerTile
          key={player.id}
          name={player.name}
          selected={selectedPlayers.includes(player)}
          selectionIndex={selectedPlayers.findIndex(p => p.id === player.id)}
          emoji={player.emoji || "👾"}
          onClick={() => onPlayerClick(player)}
        />
      ))}
  </div>
);

export default PlayerList; 