import { Badge } from "@/components/ui/badge";

export function RemoteWorkBadge({ remotePercent }: { remotePercent: number }) {
  const tone = remotePercent >= 50 ? "success" : remotePercent >= 35 ? "info" : "warning";
  return <Badge tone={tone}>{remotePercent}% das vagas são remotas</Badge>;
}
