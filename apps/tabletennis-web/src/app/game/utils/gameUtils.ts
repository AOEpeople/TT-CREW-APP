import type { Player } from "@/types";

/**
 * Get a confirmation message based on selected players
 */
export const getConfirmationMessage = (selectedPlayers: Player[]) => {
  if (selectedPlayers.length === 1) {
    return `Hat ${selectedPlayers[0].name} gewonnen?`;
  } else if (selectedPlayers.length === 2) {
    return `Haben ${selectedPlayers[0].name} und ${selectedPlayers[1].name} gewonnen?`;
  }
  return "Hier ist irgendwas schiefgelaufen";
}; 