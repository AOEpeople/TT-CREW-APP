import { MatchStatusBadge } from "./MatchStatusBadge";

interface MatchRowProps {
  match: {
    id: string;
    winners: string[];
    losers?: string[];
    timestamp: Date;
    synced: boolean;
  };
}

export function MatchRow({ match }: MatchRowProps) {
  return (
    <tr className="border-b border-slate-700/40 hover:bg-slate-700/20">
      <td className="py-3 px-4 text-white">
        {match.winners.join(" & ")}
        {match.losers && match.losers.length > 0 && (
          <span className="text-slate-400 ml-2">
            vs {match.losers.join(" & ")}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-slate-300">
        {match.timestamp.toLocaleString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </td>
      <td className="py-3 px-4">
        <MatchStatusBadge synced={match.synced} />
      </td>
    </tr>
  );
} 