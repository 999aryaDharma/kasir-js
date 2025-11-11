import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/5" />
        <Skeleton className="h-4 w-4/5 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
