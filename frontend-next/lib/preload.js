import { preloadPOSData as apiPreloadPOSData, preloadDashboardData as apiPreloadDashboardData } from "@/lib/api";
import Cookies from "js-cookie";

// Wrapper functions untuk preload
export const preloadPOSData = apiPreloadPOSData;
export const preloadDashboardData = apiPreloadDashboardData;