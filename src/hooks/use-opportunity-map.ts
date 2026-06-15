import { useQuery } from "@tanstack/react-query";
import { getDashboardOpportunityMap } from "@/services/api";
import { DashboardFilters } from "@/types/dashboard";

export function useOpportunityMap(filters: DashboardFilters, stack: string) {
  return useQuery({
    queryKey: ["opportunity-map", filters, stack],
    queryFn: () => getDashboardOpportunityMap(filters, stack),
  });
}
