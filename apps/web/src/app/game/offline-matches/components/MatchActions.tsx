import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface MatchActionsProps {
  hasUnsyncedMatches: boolean;
  hasSyncedMatches: boolean;
  isSyncing: boolean;
  onSync: () => void;
  onRemoveSynced: () => void;
}

export function MatchActions({
  hasUnsyncedMatches,
  hasSyncedMatches,
  isSyncing,
  onSync,
  onRemoveSynced,
}: MatchActionsProps) {
  return (
    <div className="flex gap-2">
      {hasUnsyncedMatches && (
        <Button 
          onClick={onSync}
          disabled={isSyncing}
          className="gap-2"
        >
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Synchronisiere...
            </>
          ) : (
            "Alle synchronisieren"
          )}
        </Button>
      )}
      
      {hasSyncedMatches && (
        <Button 
          variant="destructive" 
          onClick={onRemoveSynced}
          className="gap-2 text-white"
        >
          <Trash2 size={16} />
          Synchronisierte löschen
        </Button>
      )}
    </div>
  );
} 