import { preloadDashboardData } from "@/lib/preload";

// Preload dashboard data sebelum komponen mount
if (typeof document !== 'undefined') {
  preloadDashboardData(6);
}