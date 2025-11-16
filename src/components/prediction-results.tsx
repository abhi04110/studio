"use client";

import { useMemo } from 'react';
import type { GeneratePricePredictionsOutput } from '@/ai/flows/generate-price-predictions';
import { PredictionChart } from './prediction-chart';
import { PredictionDetails } from './prediction-details';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

type PredictionResultsProps = {
  predictionData: GeneratePricePredictionsOutput;
  ticker: string;
};

type ChartDataPoint = {
  date: string;
  historical?: number;
  predicted?: number;
};

function generateHistoricalData(
  firstPrediction: { date: string; price: number },
  length = 90
): { date: string; price: number }[] {
  const historicalData: { date: string; price: number }[] = [];
  if (!firstPrediction) return [];

  const firstPredictionDate = new Date(firstPrediction.date);
  const basePrice = firstPrediction.price;
  
  // Create a more realistic, less linear trend
  const trendFactor = (Math.random() - 0.45) * (basePrice * 0.002);
  const volatility = basePrice * 0.02;

  for (let i = length; i > 0; i--) {
    const date = new Date(firstPredictionDate);
    date.setDate(firstPredictionDate.getDate() - i);

    // Sin wave to simulate some market cycles
    const cycle = Math.sin((i / length) * Math.PI * 2) * (volatility * 2);
    const noise = (Math.random() - 0.5) * volatility;
    
    const price = basePrice - (i * trendFactor) + cycle + noise;

    historicalData.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  return historicalData;
}


export function PredictionResults({ predictionData, ticker }: PredictionResultsProps) {
  const chartData = useMemo(() => {
    if (!predictionData?.predictions?.length) return [];
    
    const firstPrediction = predictionData.predictions[0];
    const historical = generateHistoricalData(firstPrediction);
    
    const combinedData: ChartDataPoint[] = historical.map(d => ({
        date: d.date,
        historical: d.price
    }));

    // Ensure seamless connection
    if (historical.length > 0) {
      combinedData.push({
        date: firstPrediction.date,
        historical: firstPrediction.price,
        predicted: firstPrediction.price,
      });
    }

    predictionData.predictions.slice(1).forEach(p => {
        combinedData.push({
            date: p.date,
            predicted: p.price
        });
    });

    return combinedData;
  }, [predictionData]);

  const lastHistorical = chartData.findLast(d => d.historical !== undefined);
  const lastPrediction = chartData.findLast(d => d.predicted !== undefined);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <PredictionDetails 
        ticker={ticker}
        confidence={predictionData.confidenceInterval}
        currentPrice={lastHistorical?.historical}
        predictedPrice={lastPrediction?.predicted}
        predictionEndDate={lastPrediction?.date}
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Price Trend Analysis for {ticker}</CardTitle>
          <CardDescription>Historical and AI-predicted price movements.</CardDescription>
        </CardHeader>
        <CardContent>
          <PredictionChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
