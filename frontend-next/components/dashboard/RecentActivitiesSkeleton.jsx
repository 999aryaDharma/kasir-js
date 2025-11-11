import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ActivityItemSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

export function RecentActivitiesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-2/5" />
        <Skeleton className="h-4 w-3/5 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <ActivityItemSkeleton />
        <ActivityItemSkeleton />
        <ActivityItemSkeleton />
        <ActivityItemSkeleton />
      </CardContent>
    </Card>
  );
}
