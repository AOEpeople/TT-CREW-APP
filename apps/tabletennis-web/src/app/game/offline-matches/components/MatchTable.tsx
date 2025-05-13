import { MatchRow } from "./MatchRow";

interface MatchTableProps {
  matches: {
    id: string;
    winners: string[];
    losers?: string[];
    timestamp: Date;
    synced: boolean;
  }[];
}

export function MatchTable({ matches }: MatchTableProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        Keine gespeicherten Siege vorhanden
      </div>
    );
  }

  return (
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
          {matches.map(match => (
            <MatchRow key={match.id} match={match} />
          ))}
        </tbody>
      </table>
    </div>
  );
} 