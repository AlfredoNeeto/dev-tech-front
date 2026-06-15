import { useQuery } from "@tanstack/react-query";
import { getDashboardSalaryInsights } from "@/services/api";
import { DashboardFilters } from "@/types/dashboard";

export function useSalaryInsights(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["salary-insights", filters],
    queryFn: () => getDashboardSalaryInsights(filters),
  });
}
