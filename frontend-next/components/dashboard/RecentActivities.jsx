"use client";

import useSWR from "swr";
import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTimeAgo } from "@/lib/utils";
import { AlertCircle, CheckCircle, Plus } from "lucide-react";
import { fetchRecentActivities } from "@/lib/api";

const ActivityItem = memo(({ icon, title, description, time, iconBgColor }) => {
  const IconComponent = { CheckCircle, AlertCircle, Plus }[icon];
  const bgColorClass = {
    success: "bg-lime-400/10 text-lime-400",
    warning: "bg-orange-500/10 text-orange-500",
    primary: "bg-primary/10 text-primary",
  }[iconBgColor];

  const formattedTime = formatTimeAgo(time);

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`p-2 rounded-full ${bgColorClass}`}>
        {IconComponent && <IconComponent className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none mb-1">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formattedTime}
      </span>
    </div>
  );
});
ActivityItem.displayName = "ActivityItem";

export function RecentActivities() {
  const { data: rawRecentActivities, error } = useSWR(
    "/recent-activities",
    fetchRecentActivities,
    {
      refreshInterval: 60000, // Refresh setiap 1 menit
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      dedupingInterval: 30000, // Prevent duplicate requests dalam 30 detik
    }
  );

  // Normalisasi struktur data recent activities
  const recentActivities = useMemo(() => {
    if (!rawRecentActivities) return null;
    
    // Cek apakah data berada dalam property 'data' atau langsung berupa array
    return Array.isArray(rawRecentActivities) 
      ? rawRecentActivities 
      : rawRecentActivities.data || rawRecentActivities;
  }, [rawRecentActivities]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Update terkini dari sistem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[250px] overflow-y-auto">
          {recentActivities
            ?.filter((activity) => new Date(activity.time) <= new Date())
            .map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                title={activity.title}
                description={activity.description}
                time={activity.time}
                iconBgColor={activity.iconBgColor}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
