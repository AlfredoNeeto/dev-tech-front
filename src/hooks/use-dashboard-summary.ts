import { useQuery } from "@tanstack/react-query";
import { getDashboardFilters, getDashboardOverview } from "@/services/api";
import { DashboardFilters } from "@/types/dashboard";

export function useDashboardSummary(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard-summary", filters],
    queryFn: () => getDashboardOverview(filters),
  });
}

export function useDashboardFilters() {
  return useQuery({
    queryKey: ["dashboard-filters"],
    queryFn: getDashboardFilters,
  });
}
