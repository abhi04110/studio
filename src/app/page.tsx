"use client";

import { useState } from "react";
import type { GeneratePricePredictionsOutput } from "@/ai/flows/generate-price-predictions";
import { getPredictionsAction } from "@/app/actions";
import { Logo } from "@/components/icons";
import { StockPredictionForm } from "@/components/stock-prediction-form";
import { PredictionResults } from "@/components/prediction-results";
import { PredictionSkeleton } from "@/components/prediction-skeleton";
import { InitialState } from "@/components/initial-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [prediction, setPrediction] = useState<GeneratePricePredictionsOutput | null>(null);
  const [ticker, setTicker] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPredictions = async (data: { ticker: string }) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setTicker(data.ticker.toUpperCase());

    const result = await getPredictionsAction({ ticker: data.ticker });

    if (result.success && result.data) {
      setPrediction(result.data);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-4 md:px-6 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
        <div className="container mx-auto flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">
            StockPredict Pro
          </h1>
        </div>
      </header>
      <main className="flex-1 w-full container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section aria-labelledby="prediction-form-heading">
            <h2 id="prediction-form-heading" className="sr-only">Stock Ticker Input</h2>
            <StockPredictionForm
              onSubmit={handleGetPredictions}
              isLoading={isLoading}
            />
          </section>

          <section aria-live="polite">
             <h2 className="sr-only">Prediction Results</h2>
            {isLoading && <PredictionSkeleton />}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {prediction && (
              <PredictionResults predictionData={prediction} ticker={ticker} />
            )}
            {!isLoading && !prediction && !error && <InitialState />}
          </section>
        </div>
      </main>
       <footer className="py-4 px-4 md:px-6">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} StockPredict Pro. All Rights Reserved.</p>
          </div>
      </footer>
    </div>
  );
}
