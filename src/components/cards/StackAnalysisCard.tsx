import { AlertTriangle, BrainCircuit, CheckCircle2, Lightbulb, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StackAnalysis } from "@/types/dashboard";

function getConfidenceLabel(confidence: StackAnalysis["confidence"]) {
  if (confidence === "high") return "Leitura forte";
  if (confidence === "medium") return "Leitura moderada";
  return "Leitura limitada";
}

export function StackAnalysisCard({
  analysis,
  isLoading,
  isError,
  onRetry,
  onOpenRoadmap,
}: {
  analysis?: StackAnalysis;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onOpenRoadmap: () => void;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="h-11 w-44" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !analysis) {
    return (
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BrainCircuit className="h-4 w-4 text-primary" />
            Analise Inteligente
          </div>
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Nao foi possivel gerar a analise inteligente agora.
            </p>
          </div>
          {onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              Tentar novamente
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BrainCircuit className="h-4 w-4 text-primary" />
            Analise Inteligente
          </div>
          <Badge tone={analysis.confidence === "high" ? "success" : analysis.confidence === "medium" ? "warning" : "info"}>
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            {getConfidenceLabel(analysis.confidence)}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">{analysis.title}</h3>
          <p className="max-w-[62ch] text-sm leading-7 text-muted-foreground">{analysis.summary}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              O que favorece esse caminho
            </div>
            <div className="mt-3 grid gap-2">
              {analysis.reasons.length ? (
                analysis.reasons.map((reason) => (
                  <p key={reason} className="text-sm leading-6 text-muted-foreground">
                    {reason}
                  </p>
                ))
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">A IA nao recebeu sinais suficientes para listar motivos com seguranca.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Ponto de atencao
            </div>
            <div className="mt-3 grid gap-2">
              {analysis.risks.length ? (
                analysis.risks.map((risk) => (
                  <p key={risk} className="text-sm leading-6 text-muted-foreground">
                    {risk}
                  </p>
                ))
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">Nenhum ponto de atencao relevante foi destacado neste recorte.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-primary" />
            Proximo passo
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{analysis.nextStep}</p>
        </div>

        <Button className="w-full sm:w-auto" onClick={onOpenRoadmap}>
          Ver roadmap de estudos
        </Button>
      </CardContent>
    </Card>
  );
}
