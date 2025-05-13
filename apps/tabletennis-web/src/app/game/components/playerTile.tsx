export type PlayerTileProps = {
  name: string;
  emoji: string;
  selected?: boolean;
  selectionIndex?: number;
  onClick: () => void;
};

export default function PlayerTile({
  name,
  emoji,
  onClick,
  selected,
  selectionIndex,
}: PlayerTileProps) {
  const getSelectionStyle = () => {
    if (!selected) return "";
    
    if (selectionIndex === 0) {
      return "bg-yellow-600/80 border-2 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
    } else if (selectionIndex === 1) {
      return "bg-slate-500/80 border-2 border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.5)]";
    }
    
    return "bg-slate-500/80";
  };

  return (
    <div
      onClick={onClick}
      className={`w-24 h-24 bg-slate-700/70 hover:bg-slate-600/80 content-between rounded-md p-1 transition-all duration-200 ${getSelectionStyle()}`}
    >
      <div className="text-4xl h-16 flex items-center justify-center">
        {emoji}
      </div>
      <div className="text-xs text-center text-nowrap truncate text-white h-4">
        {name}
      </div>
    </div>
  );
}
