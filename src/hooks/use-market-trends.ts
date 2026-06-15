import { useQuery } from "@tanstack/react-query";
import { getDashboardMarketTrends } from "@/services/api";
import { DashboardFilters } from "@/types/dashboard";

export function useMarketTrends(filters: DashboardFilters, stack: string) {
  return useQuery({
    queryKey: ["market-trends", filters, stack],
    queryFn: () => getDashboardMarketTrends(filters, stack),
    enabled: Boolean(stack && stack !== "all"),
  });
}
