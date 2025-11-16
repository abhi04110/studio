'use server';

/**
 * @fileOverview A stock price prediction AI agent.
 *
 * - generatePricePredictions - A function that handles the stock price prediction process.
 * - GeneratePricePredictionsInput - The input type for the generatePricePredictions function.
 * - GeneratePricePredictionsOutput - The return type for the generatePricePredictionsOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePricePredictionsInputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol.'),
});
export type GeneratePricePredictionsInput = z.infer<
  typeof GeneratePricePredictionsInputSchema
>;

const GeneratePricePredictionsOutputSchema = z.object({
  predictions: z
    .array(z.object({date: z.string(), price: z.number()}))
    .describe('An array of predicted stock prices with dates.'),
  confidenceInterval: z
    .number()
    .describe('The confidence interval for the predictions.'),
});
export type GeneratePricePredictionsOutput = z.infer<
  typeof GeneratePricePredictionsOutputSchema
>;

export async function generatePricePredictions(
  input: GeneratePricePredictionsInput
): Promise<GeneratePricePredictionsOutput> {
  return generatePricePredictionsFlow(input);
}

const getStockPricePrediction = ai.defineTool(
  {
    name: 'getStockPricePrediction',
    description:
      'Returns future stock price predictions for a given ticker symbol.',
    inputSchema: z.object({
      ticker: z.string().describe('The ticker symbol of the stock.'),
    }),
    outputSchema: z.object({
      predictions: z
        .array(z.object({date: z.string(), price: z.number()}))
        .describe('An array of predicted stock prices with dates.'),
      confidenceInterval: z
        .number()
        .describe('The confidence interval for the predictions.'),
    }),
  },
  async (input) => {
    // TODO: Integrate with actual machine learning model here.
    // This is a placeholder that returns dummy data.
    const startDate = new Date();
    const predictions = Array.from({length: 30}, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i + 1);
      return {date: date.toISOString().split('T')[0], price: 100 + i * 2};
    });
    return {
      predictions: predictions,
      confidenceInterval: 0.9,
    };
  }
);

const prompt = ai.definePrompt({
  name: 'generatePricePredictionsPrompt',
  tools: [getStockPricePrediction],
  input: {schema: GeneratePricePredictionsInputSchema},
  output: {schema: GeneratePricePredictionsOutputSchema},
  prompt: `You are a financial analyst. Using the getStockPricePrediction tool, provide future stock price predictions for the given ticker symbol: {{{ticker}}}. Return the predictions and confidence interval.`,
});

const generatePricePredictionsFlow = ai.defineFlow(
  {
    name: 'generatePricePredictionsFlow',
    inputSchema: GeneratePricePredictionsInputSchema,
    outputSchema: GeneratePricePredictionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
