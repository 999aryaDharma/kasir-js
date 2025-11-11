import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function SummaryCard({ title, value, trend, className }) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                "font-medium",
                trend.isPositive ? "text-emerald-500" : "text-red-500"
              )}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}% vs bulan lalu
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

SummaryCard.Skeleton = function SummaryCardSkeleton({ count = 1 }) {
  if (count > 1) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-3/5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-2/5 mb-2" />
              <Skeleton className="h-3 w-4/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-3/5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-2/5 mb-2" />
        <Skeleton className="h-3 w-4/5" />
      </CardContent>
    </Card>
  );
};
