import { ArrowDown, ArrowUp, TrendingUp, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PredictionDetailsProps = {
  ticker: string;
  confidence: number;
  currentPrice?: number;
  predictedPrice?: number;
  predictionEndDate?: string;
};

export function PredictionDetails({
  ticker,
  confidence,
  currentPrice,
  predictedPrice,
  predictionEndDate,
}: PredictionDetailsProps) {
  const priceChange = predictedPrice !== undefined && currentPrice !== undefined 
    ? predictedPrice - currentPrice 
    : undefined;
    
  const percentageChange = priceChange !== undefined && currentPrice !== undefined && currentPrice > 0
    ? (priceChange / currentPrice) * 100
    : undefined;

  const formattedDate = predictionEndDate ? new Date(predictionEndDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prediction Confidence</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(confidence * 100).toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">AI model confidence level</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Predicted Change</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {percentageChange !== undefined ? (
            <>
              <div className="text-2xl font-bold flex items-center">
                {percentageChange >= 0 ? (
                  <ArrowUp className="h-6 w-6 text-accent" />
                ) : (
                  <ArrowDown className="h-6 w-6 text-destructive" />
                )}
                <span>{Math.abs(percentageChange).toFixed(2)}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                from ${currentPrice?.toFixed(2)} to ${predictedPrice?.toFixed(2)} by {formattedDate}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Not enough data to calculate change.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Predicted Price</CardTitle>
          <div className="text-xs font-bold bg-primary/20 text-primary rounded-full px-2 py-0.5">{ticker}</div>
        </CardHeader>
        <CardContent>
           <div className="text-2xl font-bold">${predictedPrice?.toFixed(2) ?? 'N/A'}</div>
          <p className="text-xs text-muted-foreground">
            Predicted price by {formattedDate}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
