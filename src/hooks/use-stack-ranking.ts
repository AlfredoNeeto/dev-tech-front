import { useQuery } from "@tanstack/react-query";
import { getDashboardBeginnerRanking, getDashboardOverview } from "@/services/api";
import { DashboardFilters } from "@/types/dashboard";

export function useStackRanking(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["stack-ranking", filters],
    queryFn: async () => (await getDashboardOverview(filters)).ranking,
  });
}

export function useBeginnerRanking(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["beginner-ranking", filters],
    queryFn: () => getDashboardBeginnerRanking(filters),
  });
}
