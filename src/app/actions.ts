"use server";

import { generatePricePredictions } from "@/ai/flows/generate-price-predictions";
import type { GeneratePricePredictionsOutput } from "@/ai/flows/generate-price-predictions";

type ActionResult = {
  success: boolean;
  data?: GeneratePricePredictionsOutput;
  error?: string;
};

export async function getPredictionsAction(input: {
  ticker: string;
}): Promise<ActionResult> {
  try {
    // Basic validation
    if (!input.ticker || typeof input.ticker !== "string") {
      return { success: false, error: "Invalid ticker symbol provided." };
    }

    const output = await generatePricePredictions({ ticker: input.ticker });

    if (!output || !output.predictions || output.predictions.length === 0) {
      return { success: false, error: "Could not retrieve predictions for this ticker." };
    }

    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    // Return a user-friendly error message
    return { success: false, error: "Failed to generate stock predictions. Please try again later." };
  }
}
