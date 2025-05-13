import { Player } from "./player";

export interface Match {
  id: number;
  createdAt: Date;
  enteredBy: number;
  winners: Player[];
  losers?: Player[];
} 