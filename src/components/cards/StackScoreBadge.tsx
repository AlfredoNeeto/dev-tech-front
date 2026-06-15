import { Badge } from "@/components/ui/badge";

export function StackScoreBadge({ score }: { score: number }) {
  const tone = score >= 78 ? "success" : score >= 64 ? "info" : score >= 50 ? "warning" : "danger";
  return <Badge tone={tone}>Potencial {Math.round(score)}</Badge>;
}
