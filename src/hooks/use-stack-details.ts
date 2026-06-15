import { useQuery } from "@tanstack/react-query";
import { getDashboardStackDetail } from "@/services/api";
import { DashboardFilters } from "@/types/dashboard";

export function useStackDetails(filters: DashboardFilters, stack: string) {
  return useQuery({
    queryKey: ["stack-detail", stack, filters],
    queryFn: () => getDashboardStackDetail(filters, stack),
    enabled: Boolean(stack && stack !== "all"),
  });
}
