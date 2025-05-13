"use server";
import { formDataToObject } from "@/lib/formDataToObject";
import { gameCore } from "@/lib/gameCore";
import { revalidatePath } from "next/cache";

export async function addMatch(formData: FormData) {
  
  try {
    const data = formDataToObject(formData);
    
    // Parse winner IDs from form data
    const winnerIds = [];
    let i = 1;
    while (data[`winnerId${i}`]) {
      winnerIds.push(Number(data[`winnerId${i}`]));
      i++;
    }
    
    // Parse loser IDs from form data if they exist
    const loserIds = [];
    i = 1;
    while (data[`loserId${i}`]) {
      loserIds.push(Number(data[`loserId${i}`]));
      i++;
    }
    
    // Parse timestamp if provided
    const timestamp = data.timestamp ? new Date(data.timestamp as string) : undefined;
    
    await gameCore.addMatch({
      winnerIds,
      loserIds: loserIds.length > 0 ? loserIds : undefined,
      enteredBy: 1, // Hardcoded for now, should be replaced with actual user ID
      timestamp,
    });

    revalidatePath("/game");
  } catch (error) {
    console.error(error);
    throw new Error("Could not add match");
  }
}
