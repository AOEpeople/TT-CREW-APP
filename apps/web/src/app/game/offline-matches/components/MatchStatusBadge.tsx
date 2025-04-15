interface MatchStatusBadgeProps {
  synced: boolean;
}

export function MatchStatusBadge({ synced }: MatchStatusBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-md text-xs ${
      synced ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
    }`}>
      {synced ? 'Synchronisiert' : 'Nicht synchronisiert'}
    </span>
  );
} 