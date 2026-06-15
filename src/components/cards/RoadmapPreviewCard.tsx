import { ArrowUpRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RoadmapPreviewCard({
  stack,
  roadmapTitle,
  summary,
  onOpenRoadmap,
}: {
  stack: string;
  roadmapTitle?: string;
  summary?: string;
  onOpenRoadmap: () => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 text-primary" />
          Roadmap de estudos
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">{roadmapTitle ?? "Roadmap sugerido"}</h3>
          <p className="text-sm leading-7 text-muted-foreground">
            {summary ?? `Abra um roadmap ligado a ${stack} para transformar os sinais do mercado em um plano de estudo mais claro.`}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
          O Dev Tech usa o mercado para ajudar na decisao. O roadmap entra logo depois, para mostrar por onde comecar.
        </div>

        <Button variant="outline" className="w-full sm:w-auto" onClick={onOpenRoadmap}>
          Abrir roadmap completo
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
