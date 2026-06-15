import { Crown, Sparkles, TrendingUp } from "lucide-react";
import { usePlan } from "@/app/plan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ProUpgradeWidget({ onOpenPlans }: { onOpenPlans: () => void }) {
  const { isPro } = usePlan();

  if (isPro) return null;

  return (
    <Card className="overflow-hidden border-primary/25 bg-[linear-gradient(180deg,oklch(var(--primary)/0.09),transparent_78%)]">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">
            <Crown className="mr-1 h-3.5 w-3.5" />
            DevTech Pro
          </Badge>
          <Badge tone="info">Upgrade sugerido</Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Transforme dados do mercado em decisoes mais inteligentes</h3>
          <p className="max-w-[60ch] text-sm leading-7 text-muted-foreground">
            Va alem do ranking. O DevTech Pro aprofunda a leitura das comparacoes e ajuda voce a decidir com mais confianca qual stack merece seu tempo de estudo.
          </p>
        </div>

        <Separator />

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Leitura premium da comparacao",
            "Mais contexto sobre a sugestao",
            "Acesso ao checkout demonstrativo",
            "Gestao da assinatura Pro",
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-2 rounded-lg border border-border bg-background/90 px-3 py-3 text-sm">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Mais contexto sem perder o valor do plano gratuito
          </div>
          <Button className="w-full sm:w-auto" onClick={onOpenPlans}>
            Conhecer DevTech Pro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
