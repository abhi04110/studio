"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  ticker: z
    .string()
    .min(1, "Ticker symbol is required.")
    .max(10, "Ticker symbol is too long.")
    .regex(/^[a-zA-Z0-9.-]+$/, "Invalid characters in ticker symbol."),
});

type FormValues = z.infer<typeof formSchema>;

type StockPredictionFormProps = {
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
};

export function StockPredictionForm({
  onSubmit,
  isLoading,
}: StockPredictionFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Analyze Stock</CardTitle>
        <CardDescription>Enter a stock ticker to generate price predictions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="sr-only">Stock Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AAPL, GOOGL, TSLA" {...field} disabled={isLoading} className="text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              <span>{isLoading ? "Analyzing..." : "Get Predictions"}</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
