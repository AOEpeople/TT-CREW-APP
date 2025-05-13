
import PlayerGrid from "./components/playerGrid";
import { gameCore } from "@/lib/gameCore";

export default async function Page() {
  const players = await gameCore.getActivePlayers();
  
  return (
        <PlayerGrid players={players} />
  );
}
