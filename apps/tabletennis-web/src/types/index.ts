// This file contains types that can be safely imported by client components
export interface Player {
  id: number;
  name: string;
  emoji: string | null;
  priority: number;
  status?: "ACTIVE" | "INACTIVE" | "HALL_OF_FAME";
  rating?: number;
}

export interface Match {
  id: number;
  createdAt: Date;
  enteredBy: number;
  winners: Player[];
  losers?: Player[];
} 