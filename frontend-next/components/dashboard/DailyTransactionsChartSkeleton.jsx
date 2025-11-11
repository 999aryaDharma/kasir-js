import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DailyTransactionsChartSkeleton() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <CardContent>
        <div className="h-[250px] w-full flex items-center justify-center">
          <Skeleton className="h-[230px] w-full" />
        </div>
      </CardContent>
    </Card>
  );
}