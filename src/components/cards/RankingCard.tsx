import { ArrowUpRight } from "lucide-react";
import { BeginnerFriendlyBadge } from "@/components/cards/BeginnerFriendlyBadge";
import { RemoteWorkBadge } from "@/components/cards/RemoteWorkBadge";
import { StackScoreBadge } from "@/components/cards/StackScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { RankingItem } from "@/types/dashboard";

export function RankingCard({
  item,
  index,
  onSelect,
}: {
  item: RankingItem;
  index: number;
  onSelect: (stack: string) => void;
}) {
  return (
    <Card className="md:hidden">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">#{index + 1}</p>
            <h3 className="text-xl font-semibold">{item.stack}</h3>
            <p className="text-sm text-muted-foreground">{item.category}</p>
          </div>
          <StackScoreBadge score={item.opportunityScore} />
        </div>
        <div className="flex flex-wrap gap-2">
          <RemoteWorkBadge remotePercent={item.remotePercent} />
          <BeginnerFriendlyBadge beginnerFriendly={item.beginnerFriendly} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Vagas</p>
            <p className="font-semibold">{formatNumber(item.totalJobs)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Faixa central</p>
            <p className="font-semibold">{formatCurrency(item.salaryMedian)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Entrada</p>
            <p className="font-semibold">{item.juniorPercent}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ritmo do mercado</p>
            <p className="font-semibold">{item.trendPercent > 0 ? "+" : ""}{item.trendPercent}%</p>
          </div>
        </div>
        <Button className="w-full" variant="outline" onClick={() => onSelect(item.stack)}>
          Ver detalhes
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
