import { ArrowRight, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { RankingItem } from "@/types/dashboard";

function buildDecision(top: RankingItem, second?: RankingItem) {
  if (!second) {
    return `${top.stack} aparece como a melhor leitura deste recorte porque combina demanda, entrada e continuidade.`;
  }

  if (top.juniorPercent >= second.juniorPercent + 6) {
    return `${top.stack} tende a ser a melhor escolha para quem quer entrar mais rapido, porque abre mais espaco para vagas de entrada do que ${second.stack}.`;
  }

  if (top.remotePercent >= second.remotePercent + 6) {
    return `${top.stack} ganha vantagem para quem precisa de flexibilidade, porque mostra mais presenca de vagas remotas do que ${second.stack}.`;
  }

  if (top.salaryMedian >= second.salaryMedian + 12000) {
    return `${top.stack} se destaca quando a prioridade e potencial salarial, mas ainda vale checar se o caminho de entrada faz sentido para o seu momento.`;
  }

  return `${top.stack} lidera por equilibrio geral. ${second.stack} continua sendo uma boa alternativa se voce quiser comparar um caminho parecido.`;
}

export function ComparisonSummaryCard({
  top,
  second,
  onSelect,
}: {
  top: RankingItem;
  second?: RankingItem;
  onSelect: (stack: string) => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Scale className="h-4 w-4 text-primary" />
          Qual escolher?
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold">{top.stack}</h3>
            <p className="max-w-[64ch] text-sm leading-7 text-muted-foreground">{buildDecision(top, second)}</p>
            <Button className="w-full sm:w-auto" onClick={() => onSelect(top.stack)}>
              Explorar {top.stack}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3">
            {[top, second].filter(Boolean).map((item) => {
              const stack = item as RankingItem;
              return (
                <div key={stack.stack} className="rounded-lg border border-border bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {stack.stack}
                  </div>
                  <div className="mt-3 grid gap-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Entrada</span>
                      <strong>{formatPercent(stack.juniorPercent)}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Remoto</span>
                      <strong>{formatPercent(stack.remotePercent)}</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Mediana</span>
                      <strong>{formatCurrency(stack.salaryMedian)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
