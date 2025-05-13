interface MatchStatsProps {
  totalMatches: number;
  unsyncedMatches: number;
}

export function MatchStats({ totalMatches, unsyncedMatches }: MatchStatsProps) {
  return (
    <div>
      <p className="text-lg font-medium text-white mb-1">
        {totalMatches} gespeicherte Siege
      </p>
      <p className="text-sm text-slate-400">
        {unsyncedMatches} nicht synchronisiert
      </p>
    </div>
  );
} 