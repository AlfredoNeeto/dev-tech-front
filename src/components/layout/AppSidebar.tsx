import { usePlan } from "@/app/plan";
import { BookOpen, Compass, Route, SearchCheck, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStatus } from "@/hooks/use-dashboard-status";
import { formatDateTime } from "@/lib/utils";
import { getIntegrationStatus } from "@/services/api";

const items = [
  { label: "Descobrir stacks", icon: SearchCheck },
  { label: "Comparar caminhos", icon: Compass },
  { label: "Explorar stack", icon: Sparkles },
  { label: "Plano de estudo", icon: BookOpen },
];

export function AppSidebar({
  mobile = false,
  onOpenGuide,
  onOpenPlans,
}: {
  mobile?: boolean;
  onOpenGuide?: () => void;
  onOpenPlans?: () => void;
}) {
  const { isPro } = usePlan();
  const integration = getIntegrationStatus();
  const statusQuery = useDashboardStatus();
  const lastUpdate = statusQuery.data?.lastGoldRun ? formatDateTime(statusQuery.data.lastGoldRun) : null;

  return (
    <aside className={mobile ? "grid gap-4" : "hidden gap-4 lg:grid lg:sticky lg:top-6 lg:h-fit"}>
      <Card className="bg-sidebar text-sidebar-foreground">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Dev Tech" className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold">Dev Tech</h1>
                {isPro ? <Badge tone="success">Pro</Badge> : null}
              </div>
              <p className="text-sm text-muted-foreground">Um guia para decidir melhor o que estudar em tecnologia</p>
            </div>
          </div>

          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 shrink-0 text-sidebar-primary" />
                <p className="text-sm font-semibold">Como usar</p>
              </div>
              {onOpenGuide ? (
                <Button variant="ghost" className="h-auto px-0 py-0 text-sm font-medium text-primary hover:bg-transparent hover:text-primary/90" onClick={onOpenGuide}>
                  Guia rapido
                </Button>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Veja a sugestao principal, compare caminhos e abra um roadmap quando fizer sentido.
            </p>
          </div>

          <nav className="grid gap-2">
            {items.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-2.5 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 shrink-0 text-sidebar-primary" />
                <span className="min-w-0 break-words">{label}</span>
              </div>
            ))}
          </nav>

          {!isPro && onOpenPlans ? (
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent px-4 py-3">
              <div className="flex items-center gap-2">
                <Badge tone="success">DevTech Pro</Badge>
                <Sparkles className="h-4 w-4 shrink-0 text-sidebar-primary" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">Mais contexto para decidir melhor</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Compare stacks com mais profundidade e entenda melhor qual caminho faz mais sentido para voce.
              </p>
              <Button className="mt-4 w-full" onClick={onOpenPlans}>
                Contratar plano Pro
              </Button>
            </div>
          ) : null}

          <ThemeToggle />

          {isPro && onOpenPlans ? (
            <button
              type="button"
              onClick={onOpenPlans}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-sidebar-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <WalletCards className="h-4 w-4" />
              Gerenciar plano
            </button>
          ) : null}
        </CardContent>
      </Card>

      <Card className="bg-sidebar text-sidebar-foreground">
        <CardContent className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground">Status da integracao</h2>
            <span className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${integration.configured ? "bg-primary" : "bg-muted-foreground"}`} />
          </div>
          <p className="text-sm font-medium text-foreground">{integration.label}</p>
          {lastUpdate ? <p className="text-sm text-muted-foreground">Ultima atualizacao: {lastUpdate}</p> : null}
        </CardContent>
      </Card>
    </aside>
  );
}
