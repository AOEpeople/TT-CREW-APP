import type { Player } from "@/types";

export const getOfflinePlayers = (): Player[] | undefined => {
  if (typeof window === "undefined") return undefined;  
  try {
    const offlinePlayerJSON = localStorage.getItem("playerBackup");
    if (!offlinePlayerJSON) return undefined;
    return JSON.parse(offlinePlayerJSON) as Player[];
  } catch (e) {
    console.error("Error while reading offline players", e);
    return undefined;
  }
};

export const writeOfflinePlayers = (players: Player[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("playerBackup", JSON.stringify(players));
  }
}; 