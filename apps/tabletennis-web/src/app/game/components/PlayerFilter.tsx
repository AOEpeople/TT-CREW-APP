import { Input } from "@/components/ui/input";

interface PlayerFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PlayerFilter = ({ value, onChange }: PlayerFilterProps) => (
  <Input
    type="text"
    name="filter"
    placeholder="Spieler suchen..."
    required
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500"
  />
);

export default PlayerFilter; 