import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function PredictionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Card>
        <CardHeader>
            <Skeleton className="h-6 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
        </CardHeader>
        <CardContent>
            <Skeleton className="aspect-video w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
