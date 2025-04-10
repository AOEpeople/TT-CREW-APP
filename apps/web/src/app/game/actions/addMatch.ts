"use server";
import { formDataToObject } from "@/lib/formDataToObject";
import { revalidatePath } from "next/cache";
import { addMatch as addMatchToCore } from "@/lib/server/gameCore";

export async function addMatch(formData: FormData) {
  try {
    const data = formDataToObject(formData);
    const winnerId1 = Number(data.winnerId1);
    const winnerId2 = data.winnerId2 ? Number(data.winnerId2) : undefined;
    
    await addMatchToCore({
      winnerId1,
      winnerId2,
      enteredBy: 1, // Hardcoded for now, should be replaced with actual user ID
    });

    revalidatePath("/game");
  } catch (error) {
    console.error(error);
    throw new Error("Could not add match");
  }
}
