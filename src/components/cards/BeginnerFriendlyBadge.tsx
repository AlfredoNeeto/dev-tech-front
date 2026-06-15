import { Badge } from "@/components/ui/badge";

export function BeginnerFriendlyBadge({ beginnerFriendly }: { beginnerFriendly: boolean }) {
  return <Badge tone={beginnerFriendly ? "success" : "warning"}>{beginnerFriendly ? "Mais amigável para começar" : "Entrada mais disputada"}</Badge>;
}
