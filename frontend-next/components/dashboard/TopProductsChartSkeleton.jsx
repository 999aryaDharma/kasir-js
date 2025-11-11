import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TopProductsChartSkeleton() {
  return (
    <Card className="lg:col-span-3">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          <Skeleton className="h-[280px] w-full" />
        </div>
      </CardContent>
    </Card>
  );
}