"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type ChartDataPoint = {
  date: string;
  historical?: number;
  predicted?: number;
};

type PredictionChartProps = {
  data: ChartDataPoint[];
};

const chartConfig = {
  historical: {
    label: "Historical",
    color: "hsl(var(--chart-1))",
  },
  predicted: {
    label: "Predicted",
    color: "hsl(var(--chart-2))",
  },
};

export function PredictionChart({ data }: PredictionChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['dataMin - 5', 'dataMax + 5']}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(value, payload) => {
                 if (payload && payload.length > 0) {
                     const date = new Date(payload[0].payload.date);
                     return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                 }
                 return value;
              }}
              formatter={(value, name) => (
                <div className="flex items-center gap-2">
                  <div className="capitalize">{name}</div>
                  <div className="font-bold">${value.toFixed(2)}</div>
                </div>
              )}
            />
          }
        />
         <Legend content={<ChartLegendContent />} />
        <Line
          dataKey="historical"
          type="monotone"
          stroke="var(--color-historical)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="predicted"
          type="monotone"
          stroke="var(--color-predicted)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 2, fill: "var(--color-predicted)" }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
