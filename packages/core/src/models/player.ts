export interface Player {
  id: number;
  name: string;
  emoji: string | null;
  priority: number;
  status?: "ACTIVE" | "INACTIVE" | "HALL_OF_FAME";
  rating?: number;
} 