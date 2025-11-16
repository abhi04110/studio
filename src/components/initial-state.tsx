import { LineChart } from "lucide-react";

export function InitialState() {
  return (
    <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-card">
        <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground font-headline">Welcome to StockPredict Pro</h3>
        <p className="mt-1 text-sm text-muted-foreground">
            Enter a stock ticker symbol above to generate an AI-powered price forecast.
        </p>
    </div>
  );
}
