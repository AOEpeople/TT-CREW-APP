import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex  items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <p className="text-lg font-medium text-white text-text-muted-foreground">Lade Spieler...</p>
      </div>
    </div>
  );
}