import { ArrowUpRight, Compass, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { RankingItem } from "@/types/dashboard";

function buildWhyNow(summary: RankingItem) {
  if (summary.juniorPercent >= 20) {
    return "Tem boa presenca de vagas de entrada, o que reduz a distancia ate a primeira oportunidade.";
  }
  if (summary.remotePercent >= 20) {
    return "Abre mais espaco para vagas remotas, o que amplia as cidades e empresas que voce pode mirar.";
  }
  if (summary.salaryMedian > 0) {
    return "Mantem uma leitura de mercado consistente e remuneracao que ajuda a sustentar uma trilha de longo prazo.";
  }
  return "Mostra sinais de mercado suficientes para virar uma trilha pratica de estudo.";
}

export function NextStepCard({
  stack,
  summary,
  roadmapTitle,
  onOpenRoadmap,
}: {
  stack: string;
  summary: RankingItem;
  roadmapTitle?: string;
  onOpenRoadmap: () => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Compass className="h-4 w-4 text-primary" />
            Proximo passo
          </div>
          <h3 className="text-2xl font-semibold">Como sair da analise e comecar por {stack}</h3>
          <p className="max-w-[62ch] text-sm leading-7 text-muted-foreground">{buildWhyNow(summary)}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">Vagas no recorte</p>
            <p className="mt-2 text-xl font-semibold">{formatNumber(summary.totalJobs)}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">Entrada</p>
            <p className="mt-2 text-xl font-semibold">{formatPercent(summary.juniorPercent)}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">Mediana</p>
            <p className="mt-2 text-xl font-semibold">{formatCurrency(summary.salaryMedian)}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-primary" />
            Sugestao pratica
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Se {stack} faz sentido para o seu momento, o melhor passo agora e abrir o roadmap
            {roadmapTitle ? ` ${roadmapTitle}` : ""} e transformar essa leitura de mercado em uma ordem de estudo.
          </p>
        </div>

        <Button className="w-full sm:w-auto" onClick={onOpenRoadmap}>
          Ver roadmap de estudos
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
