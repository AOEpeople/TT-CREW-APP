import type { Player } from "@/types";

interface PlayerSelectionProps {
  isMultiSelection: boolean;
  selectedPlayers: Player[];
}

export const PlayerSelection = ({ isMultiSelection, selectedPlayers }: PlayerSelectionProps) => {
  if (!isMultiSelection) return null;
  
  return (
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
  );
};

export default PlayerSelection; 