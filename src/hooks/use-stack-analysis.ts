import { useQuery } from "@tanstack/react-query";
import { getDashboardStackAnalysis } from "@/services/api";
import { DashboardFilters } from "@/types/dashboard";

export function useStackAnalysis(filters: DashboardFilters, stack: string) {
  return useQuery({
    queryKey: ["stack-analysis", stack, filters],
    queryFn: () => getDashboardStackAnalysis(filters, stack),
    enabled: Boolean(stack && stack !== "all"),
  });
}
