import { useQuery } from "@tanstack/react-query";
import { getDashboardStatus } from "@/services/api";

export function useDashboardStatus() {
  return useQuery({
    queryKey: ["dashboard-status"],
    queryFn: getDashboardStatus,
  });
}
