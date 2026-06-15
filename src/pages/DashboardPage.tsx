import { usePlan } from "@/app/plan";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  Gauge,
  GraduationCap,
  Menu,
  Signal,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ComparisonSummaryCard } from "@/components/cards/ComparisonSummaryCard";
import { MetricCard } from "@/components/cards/MetricCard";
import { NextStepCard } from "@/components/cards/NextStepCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { RoadmapPreviewCard } from "@/components/cards/RoadmapPreviewCard";
import { StackAnalysisCard } from "@/components/cards/StackAnalysisCard";
import { RemoteWorkBadge } from "@/components/cards/RemoteWorkBadge";
import { StackScoreBadge } from "@/components/cards/StackScoreBadge";
import { SalaryChart } from "@/components/charts/SalaryChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { EmptyState } from "@/components/empty-state/EmptyState";
import { ErrorState } from "@/components/empty-state/ErrorState";
import { DashboardFilterBar } from "@/components/filters/DashboardFilterBar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { LoadingSkeleton } from "@/components/loading/LoadingSkeleton";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { PremiumFeatureOverlay } from "@/components/premium/PremiumFeatureOverlay";
import { ProUpgradeWidget } from "@/components/premium/ProUpgradeWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip } from "@/components/ui/tooltip";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultFilters } from "@/features/dashboard/constants";
import { useDashboardFilters, useDashboardSummary } from "@/hooks/use-dashboard-summary";
import { useBeginnerRanking, useStackRanking } from "@/hooks/use-stack-ranking";
import { useMarketTrends } from "@/hooks/use-market-trends";
import { useSalaryInsights } from "@/hooks/use-salary-insights";
import { useStackAnalysis } from "@/hooks/use-stack-analysis";
import { useStackDetails } from "@/hooks/use-stack-details";
import { getRoadmap, getRoadmapUrl } from "@/lib/roadmap";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { DashboardFilters, RankingItem } from "@/types/dashboard";

type Section = "discover" | "compare" | "explore" | "study";
type ExploreSection = "overview" | "analysis" | "market" | "companies";

const sections: Array<{ id: Section; label: string }> = [
  { id: "discover", label: "Descobrir stacks" },
  { id: "compare", label: "Comparar caminhos" },
  { id: "explore", label: "Explorar stack" },
  { id: "study", label: "Plano de estudo" },
];

function getOpportunityMessage(item: RankingItem) {
  if (item.juniorPercent >= 22) {
    return `${item.stack} parece uma rota mais acessivel para quem quer entrar na area agora.`;
  }
  if (item.remotePercent >= 20) {
    return `${item.stack} ganha forca porque abre mais espaco para buscar vagas remotas.`;
  }
  if (item.salaryMedian >= 100000) {
    return `${item.stack} pode pagar melhor, mas costuma pedir preparo mais consistente logo na entrada.`;
  }
  return `${item.stack} mantem um bom equilibrio entre chance de vaga, continuidade e aprendizado pratico.`;
}

function getTrendNarrative(item: RankingItem) {
  if (item.trendPercent > 6) return "mercado em crescimento";
  if (item.trendPercent < -4) return "mercado mais seletivo";
  return "mercado estavel";
}

function formatCurrencyOrFallback(value: number) {
  return value > 0 ? formatCurrency(value) : "Sem dado";
}

function getStudyRecommendation(item: RankingItem) {
  if (item.juniorPercent >= 20) {
    return `Vale olhar ${item.stack} com carinho se sua meta e a primeira vaga.`;
  }
  if (item.remotePercent >= 20) {
    return `${item.stack} pode ser um bom caminho se voce precisa ampliar suas opcoes para remoto.`;
  }
  return `${item.stack} aparece como uma trilha consistente para estudar com foco de medio prazo.`;
}

export function DashboardPage({ onNavigateToPlans }: { onNavigateToPlans: () => void }) {
  const { isPro } = usePlan();
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [activeSection, setActiveSection] = useState<Section>("discover");
  const [activeExploreSection, setActiveExploreSection] = useState<ExploreSection>("overview");
  const [focusedStack, setFocusedStack] = useState("React");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const effectiveStack = filters.stack === "all" ? focusedStack : filters.stack;

  const filtersQuery = useDashboardFilters();
  const summaryQuery = useDashboardSummary(filters);
  const rankingQuery = useStackRanking(filters);
  const beginnerQuery = useBeginnerRanking(filters);
  const salaryQuery = useSalaryInsights(filters);
  const trendsQuery = useMarketTrends(filters, effectiveStack);
  const stackDetailQuery = useStackDetails(filters, effectiveStack);
  const stackAnalysisQuery = useStackAnalysis(filters, effectiveStack);

  const ranking = rankingQuery.data ?? [];
  const selectedStack = stackDetailQuery.data;
  const recommendation = summaryQuery.data?.recommendation;
  const beginnerTop = beginnerQuery.data?.[0];
  const roadmap = selectedStack ? getRoadmap(selectedStack.stack) : getRoadmap(effectiveStack);
  const topComparison = ranking[0];
  const secondComparison = ranking[1];

  const decisionSignals = useMemo(() => {
    if (!summaryQuery.data || !recommendation || !beginnerTop) return [];

    return [
      {
        title: "Melhor chance agora",
        body: `${recommendation.stack} aparece na frente porque combina volume de vagas, chance de entrada e ${getTrendNarrative(ranking[0] ?? beginnerTop)}.`,
      },
      {
        title: "Primeira vaga",
        body: `${beginnerTop.stack} se destaca para quem busca comecar porque reune ${formatPercent(beginnerTop.juniorPercent)} de vagas de entrada.`,
      },
      {
        title: "O que isso muda",
        body:
          summaryQuery.data.summary.remoteShare >= 10
            ? "Ha espaco para buscar vagas remotas, o que amplia suas opcoes fora dos grandes polos."
            : "Neste recorte, vale olhar com mais atencao para estado, empresa e senioridade.",
      },
    ];
  }, [beginnerTop, ranking, recommendation, summaryQuery.data]);

  const isLoading =
    filtersQuery.isLoading ||
    summaryQuery.isLoading ||
    rankingQuery.isLoading ||
    beginnerQuery.isLoading ||
    salaryQuery.isLoading ||
    (effectiveStack !== "all" && (trendsQuery.isLoading || stackDetailQuery.isLoading));

  const hasError =
    filtersQuery.isError ||
    summaryQuery.isError ||
    rankingQuery.isError ||
    beginnerQuery.isError ||
    salaryQuery.isError ||
    trendsQuery.isError ||
    stackDetailQuery.isError;

  function updateFilter<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    if (key === "stack" && typeof value === "string" && value !== "all") {
      setFocusedStack(value);
    }
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setFocusedStack("React");
  }

  function handleSelectStack(stack: string, exploreSection: ExploreSection = "overview") {
    setFocusedStack(stack);
    setFilters((current) => ({ ...current, stack }));
    setActiveSection("explore");
    setActiveExploreSection(exploreSection);
  }

  function openRoadmap(stack: string) {
    window.open(getRoadmapUrl(stack), "_blank", "noreferrer");
  }

  const handleNavigateFromGuide = useCallback((section: Section) => {
    setActiveSection(section);
  }, []);

  function handleOpenGuide() {
    setOnboardingOpen(true);
  }

  function handleCloseGuide() {
    setOnboardingOpen(false);
    try {
      window.localStorage.setItem("devtech-onboarding-seen-v1", "true");
    } catch {}
  }

  useEffect(() => {
    try {
      const seenGuide = window.localStorage.getItem("devtech-onboarding-seen-v1");
      if (!seenGuide) {
        setOnboardingOpen(true);
      }
    } catch {}
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen overflow-x-clip bg-background px-4 py-5 text-foreground sm:px-5 md:px-6">
        <LoadingSkeleton />
      </main>
    );
  }

  if (hasError || !filtersQuery.data || !summaryQuery.data) {
    return (
      <main className="min-h-screen overflow-x-clip bg-background px-4 py-5 text-foreground sm:px-5 md:px-6">
        <ErrorState
          title="Nao foi possivel carregar o Dev Tech"
          description="Nao conseguimos buscar os dados agora. Tente novamente em instantes."
          onRetry={() => {
            void filtersQuery.refetch();
            void summaryQuery.refetch();
            void rankingQuery.refetch();
            void beginnerQuery.refetch();
            void salaryQuery.refetch();
            void stackAnalysisQuery.refetch();
            void trendsQuery.refetch();
            void stackDetailQuery.refetch();
          }}
        />
      </main>
    );
  }

  if (!ranking.length) {
    return (
      <main className="min-h-screen overflow-x-clip bg-background px-4 py-5 text-foreground sm:px-5 md:px-6">
        <EmptyState
          title="Nenhuma stack encontrada"
          description="Esse recorte ficou restrito demais. Limpe alguns filtros ou mude o objetivo para voltar a ver opcoes."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-background px-4 py-5 text-foreground sm:px-5 md:px-6">
      <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:hidden">
          <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-5 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Dev Tech</p>
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{effectiveStack === "all" ? "Visao geral do mercado" : effectiveStack}</p>
                </div>
              </div>
              <Button type="button" variant="outline" className="shrink-0" onClick={() => setMobileNavOpen(true)}>
                <Menu className="mr-2 h-4 w-4" />
                Menu
              </Button>
            </div>
          </div>
        </div>

        <AppSidebar onOpenGuide={handleOpenGuide} onOpenPlans={onNavigateToPlans} />

        <div className="grid min-w-0 gap-6">
          <section className="rounded-[20px] border border-border bg-card p-4 sm:p-6">
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <Badge tone="info" className="w-fit">
                  Mercado, decisao e estudo no mesmo fluxo
                </Badge>
                <div className="space-y-3">
                  <h1 className="max-w-[14ch] text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                    Descubra o que estudar e por onde comecar
                  </h1>
                  <p className="max-w-[68ch] text-sm leading-7 text-muted-foreground sm:text-base">
                    O Dev Tech usa dados reais de mercado para ajudar voce a comparar stacks, entender oportunidades e sair com um proximo passo mais claro.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {decisionSignals.map((signal) => (
                    <div key={signal.title} className="rounded-lg border border-border bg-muted p-4">
                      <p className="text-sm font-semibold">{signal.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{signal.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Card>
                <CardContent className="grid h-full content-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Melhor ponto de partida agora
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="break-words text-2xl font-semibold sm:text-3xl">{recommendation?.stack}</h2>
                      <StackScoreBadge score={recommendation?.opportunityScore ?? 0} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {recommendation?.reasons[0] ?? "Ajuste os filtros para encontrar uma recomendacao mais proxima do seu momento."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-border bg-muted p-4">
                      <p className="text-sm font-medium text-muted-foreground">Leitura rapida</p>
                      <p className="mt-2 text-sm leading-6">
                        {recommendation?.warning ?? "Antes de decidir, compare senioridade, remuneracao e volume de vagas."}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-primary/10 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Proximo passo
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {recommendation ? getStudyRecommendation(ranking[0]) : "Use a sugestao principal como ponto de partida e depois abra um roadmap ligado a essa stack."}
                      </p>
                    </div>

                    <Button className="w-full sm:w-auto" onClick={() => handleSelectStack(recommendation?.stack ?? ranking[0].stack, "analysis")}>
                      Ver analise de {recommendation?.stack ?? ranking[0].stack}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <DashboardFilterBar filters={filters} options={filtersQuery.data} onChange={updateFilter} onReset={resetFilters} />

          <Tabs>
            <TabsList>
              {sections.map((section) => (
                <TabsTrigger key={section.id} active={activeSection === section.id} onClick={() => setActiveSection(section.id)}>
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeSection === "discover" ? (
              <section className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <MetricCard
                    icon={BriefcaseBusiness}
                    label="Total de vagas"
                    value={formatNumber(summaryQuery.data.summary.totalJobs)}
                    helper="Quantidade de oportunidades encontradas neste recorte."
                  />
                  <MetricCard
                    icon={Gauge}
                    label="Melhor momento agora"
                    value={summaryQuery.data.summary.recommendedStack}
                    helper="Stack com melhor equilibrio entre demanda e chance de entrada."
                  />
                  <MetricCard
                    icon={GraduationCap}
                    label="Melhor opcao para comecar"
                    value={beginnerTop?.stack ?? "Sem dados"}
                    helper="Stack com melhor leitura para quem busca a primeira vaga."
                  />
                  <MetricCard
                    icon={WalletCards}
                    label="Faixa salarial central"
                    value={formatCurrencyOrFallback(summaryQuery.data.summary.medianSalary)}
                    helper="Leitura media de remuneracao dentro do recorte atual."
                  />
                  <MetricCard
                    icon={Compass}
                    label="Vagas remotas"
                    value={formatPercent(summaryQuery.data.summary.remoteShare)}
                    helper="Mostra quanto o remoto aparece dentro desse cenario."
                  />
                  <MetricCard
                    icon={Signal}
                    label="Ritmo do mercado"
                    value={`${summaryQuery.data.summary.marketTrend > 0 ? "+" : ""}${Math.round(summaryQuery.data.summary.marketTrend)}%`}
                    helper="Sinaliza se o mercado esta aquecido, estavel ou mais seletivo."
                  />
                </div>

                <Card>
                  <CardContent className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-primary" />
                        <h2 className="text-xl font-semibold">O que os dados sugerem</h2>
                      </div>
                      <p className="mt-3 max-w-[64ch] text-sm leading-7 text-muted-foreground">
                        O foco aqui nao e apenas ver qual stack tem o maior numero. A melhor decisao costuma ser a que aproxima voce de uma oportunidade real sem perder continuidade de estudo.
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {ranking.slice(0, 3).map((item) => (
                        <div key={item.stack} className="rounded-lg border border-border bg-muted p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <strong>{item.stack}</strong>
                            <StackScoreBadge score={item.opportunityScore} />
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{getOpportunityMessage(item)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            ) : null}

            {activeSection === "compare" ? (
              <section className="grid gap-4">
                {topComparison ? <ComparisonSummaryCard top={topComparison} second={secondComparison} onSelect={handleSelectStack} /> : null}

                  <PremiumFeatureOverlay
                    unlocked={isPro}
                    onOpenPlans={onNavigateToPlans}
                    title="Compare stacks ilimitadamente e com mais profundidade"
                    description="No DevTech Pro, a comparacao ganha uma camada extra de leitura para ajudar voce a entender melhor as diferencas entre os caminhos."
                  >
                  <Card>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">Comparacao inteligente</p>
                        {!isPro ? <Badge tone="info">Pro</Badge> : null}
                      </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          Visualize uma leitura premium da comparacao para entender melhor qual caminho parece mais consistente no recorte atual.
                        </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-muted p-4">
                          <p className="text-xs text-muted-foreground">Comparacao por perfil</p>
                          <p className="mt-2 text-sm font-semibold">Iniciante vs transicao</p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted p-4">
                          <p className="text-xs text-muted-foreground">Mais stacks</p>
                          <p className="mt-2 text-sm font-semibold">Analise ilimitada</p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted p-4">
                          <p className="text-xs text-muted-foreground">Leitura mais rica</p>
                          <p className="mt-2 text-sm font-semibold">Explicacao detalhada</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </PremiumFeatureOverlay>

                <Card className="hidden md:block">
                  <CardContent className="overflow-x-auto p-0">
                    <Table>
                      <THead>
                        <TR>
                          <TH>Stack</TH>
                          <TH>Leitura rapida</TH>
                          <TH>Vagas</TH>
                          <TH>Mediana</TH>
                          <TH>Entrada</TH>
                          <TH>Remoto</TH>
                          <TH>Potencial</TH>
                          <TH />
                        </TR>
                      </THead>
                      <TBody>
                        {ranking.map((item) => (
                          <TR key={item.stack}>
                            <TD className="font-semibold">{item.stack}</TD>
                            <TD className="max-w-[24ch] text-muted-foreground">{getOpportunityMessage(item)}</TD>
                            <TD>{formatNumber(item.totalJobs)}</TD>
                            <TD>{formatCurrencyOrFallback(item.salaryMedian)}</TD>
                            <TD>{formatPercent(item.juniorPercent)}</TD>
                            <TD>{formatPercent(item.remotePercent)}</TD>
                            <TD>
                              <StackScoreBadge score={item.opportunityScore} />
                            </TD>
                            <TD>
                              <Button variant="ghost" onClick={() => handleSelectStack(item.stack)}>
                                Ver
                              </Button>
                            </TD>
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:hidden">
                  {ranking.map((item, index) => (
                    <RankingCard key={item.stack} item={item} index={index} onSelect={handleSelectStack} />
                  ))}
                </div>
              </section>
            ) : null}

            {activeSection === "explore" ? (
              <section className="grid gap-6">
                <Card>
                  <CardContent className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Explorar stack</p>
                        <h2 className="break-words text-2xl font-semibold">{selectedStack?.stack ?? effectiveStack}</h2>
                      </div>
                      {selectedStack ? <RemoteWorkBadge remotePercent={selectedStack.summary.remotePercent} /> : null}
                    </div>

                    {selectedStack ? (
                      <>
                        <Tabs className="gap-4">
                          <TabsList>
                            <TabsTrigger active={activeExploreSection === "overview"} onClick={() => setActiveExploreSection("overview")}>
                              Visao geral
                            </TabsTrigger>
                            <TabsTrigger active={activeExploreSection === "analysis"} onClick={() => setActiveExploreSection("analysis")}>
                              Analise inteligente
                            </TabsTrigger>
                            <TabsTrigger active={activeExploreSection === "market"} onClick={() => setActiveExploreSection("market")}>
                              Mercado e salarios
                            </TabsTrigger>
                            <TabsTrigger active={activeExploreSection === "companies"} onClick={() => setActiveExploreSection("companies")}>
                              Empresas e regioes
                            </TabsTrigger>
                          </TabsList>

                          {activeExploreSection === "overview" ? (
                            <div className="grid gap-4">
                              <div className="grid gap-3 lg:grid-cols-3">
                                <div className="rounded-lg border border-border bg-muted p-4 lg:col-span-2">
                                  <p className="text-sm font-medium text-muted-foreground">Vale a pena estudar isso agora?</p>
                                  <p className="mt-2 text-sm leading-7">{getOpportunityMessage(selectedStack.summary)}</p>
                                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                    Hoje {selectedStack.stack} mostra {formatNumber(selectedStack.summary.totalJobs)} vagas, {formatPercent(selectedStack.summary.juniorPercent)} de entrada e {getTrendNarrative(selectedStack.summary)}.
                                  </p>
                                </div>
                                <div className="rounded-lg border border-border bg-muted p-4">
                                  <p className="text-sm font-medium text-muted-foreground">Faixa salarial</p>
                                  <div className="mt-3 grid gap-2 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-muted-foreground">P25</span>
                                      <strong>{formatCurrencyOrFallback(selectedStack.summary.salaryP25)}</strong>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-muted-foreground">Mediana</span>
                                      <strong>{formatCurrencyOrFallback(selectedStack.summary.salaryMedian)}</strong>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-muted-foreground">P75</span>
                                      <strong>{formatCurrencyOrFallback(selectedStack.summary.salaryP75)}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-lg border border-border bg-muted p-4">
                                  <p className="text-sm text-muted-foreground">Vagas no recorte</p>
                                  <p className="mt-2 text-2xl font-semibold">{formatNumber(selectedStack.summary.totalJobs)}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-muted p-4">
                                  <p className="text-sm text-muted-foreground">Entrada</p>
                                  <p className="mt-2 text-2xl font-semibold">{formatPercent(selectedStack.summary.juniorPercent)}</p>
                                </div>
                                <div className="rounded-lg border border-border bg-muted p-4">
                                  <p className="text-sm text-muted-foreground">Remoto</p>
                                  <p className="mt-2 text-2xl font-semibold">{formatPercent(selectedStack.summary.remotePercent)}</p>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {activeExploreSection === "analysis" ? (
                            <div className="grid gap-4">
                              <StackAnalysisCard
                                analysis={stackAnalysisQuery.data}
                                isLoading={stackAnalysisQuery.isLoading}
                                isError={stackAnalysisQuery.isError}
                                onRetry={() => {
                                  void stackAnalysisQuery.refetch();
                                }}
                                onOpenRoadmap={() => openRoadmap(selectedStack.stack)}
                              />

                              <PremiumFeatureOverlay
                                unlocked={isPro}
                                onOpenPlans={onNavigateToPlans}
                                title="Aprofunde a leitura da recomendacao"
                                description="O DevTech Pro adiciona uma camada extra de interpretacao para ajudar voce a entender melhor por que essa stack aparece como boa opcao."
                              >
                                <Card>
                                  <CardContent className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-semibold">Leitura premium da recomendacao</p>
                                      {!isPro ? <Badge tone="info">Pro</Badge> : null}
                                      <Tooltip content="Camada premium demonstrativa: amplia a interpretacao sem bloquear a analise basica.">
                                        <span className="cursor-help text-xs font-semibold text-muted-foreground underline decoration-dotted underline-offset-4">
                                          Saiba mais
                                        </span>
                                      </Tooltip>
                                    </div>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                      Esta area aprofunda a leitura da stack com mais contexto sobre oportunidade, ponto de atencao e proximo passo.
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                      <div className="rounded-lg border border-border bg-muted p-4">
                                        <p className="text-xs text-muted-foreground">Leitura</p>
                                        <p className="mt-2 text-sm font-semibold">Oportunidade</p>
                                      </div>
                                      <div className="rounded-lg border border-border bg-muted p-4">
                                        <p className="text-xs text-muted-foreground">Explicacao</p>
                                        <p className="mt-2 text-sm font-semibold">Por que esta recomendacao?</p>
                                      </div>
                                      <div className="rounded-lg border border-border bg-muted p-4">
                                        <p className="text-xs text-muted-foreground">Proximo passo</p>
                                        <p className="mt-2 text-sm font-semibold">Trilha sugerida</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </PremiumFeatureOverlay>
                            </div>
                          ) : null}

                          {activeExploreSection === "market" ? (
                            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                              <Card>
                                <CardContent className="space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Mercado e salarios</p>
                                    <h3 className="text-2xl font-semibold">Quanto o mercado esta pagando</h3>
                                    <p className="mt-2 max-w-[48ch] text-sm leading-6 text-muted-foreground">
                                      Compare a faixa mais comum de cada stack e use isso junto com chance de entrada, nao de forma isolada.
                                    </p>
                                  </div>
                                  <SalaryChart data={salaryQuery.data ?? []} />
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Leitura de tendencia</p>
                                    <h3 className="text-2xl font-semibold">Essa tecnologia esta ganhando ou perdendo espaco?</h3>
                                    <p className="mt-2 max-w-[48ch] text-sm leading-6 text-muted-foreground">
                                      O grafico ajuda a perceber se a demanda por {selectedStack.stack} esta subindo, esta estavel ou perdendo forca.
                                    </p>
                                  </div>
                                  <TrendChart data={trendsQuery.data ?? []} stack={selectedStack.stack} />
                                </CardContent>
                              </Card>
                            </div>
                          ) : null}

                          {activeExploreSection === "companies" ? (
                            <div className="grid gap-4 xl:grid-cols-3">
                              <Card>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Empresas que mais aparecem</p>
                                  </div>
                                  <div className="grid gap-2">
                                    {selectedStack.companies.slice(0, 5).map((company) => (
                                      <div key={company.company} className="flex items-center justify-between gap-3 text-sm">
                                        <span className="min-w-0 break-words">{company.company}</span>
                                        <strong className="shrink-0">{formatNumber(company.jobs)}</strong>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Estados com mais vagas</p>
                                  </div>
                                  <div className="grid gap-2">
                                    {selectedStack.states.slice(0, 5).map((state) => (
                                      <div key={state.state} className="flex items-center justify-between gap-3 text-sm">
                                        <span className="min-w-0 break-words">{state.state}</span>
                                        <strong className="shrink-0">{formatNumber(state.jobs)}</strong>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Entrada por senioridade</p>
                                  </div>
                                  <div className="grid gap-2">
                                    {selectedStack.seniority.slice(0, 4).map((item) => (
                                      <div key={item.level} className="rounded-md border border-border bg-muted px-3 py-3 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                          <strong>{item.level}</strong>
                                          <span>{formatPercent(item.percent)}</span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between gap-3 text-muted-foreground">
                                          <span>{formatNumber(item.jobs)} vagas</span>
                                          <span>{formatCurrencyOrFallback(item.salaryMedian ?? 0)}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ) : null}
                        </Tabs>
                      </>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border bg-muted p-6 text-sm leading-6 text-muted-foreground">
                        Escolha uma stack no ranking para entender melhor o cenario.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            ) : null}

            {activeSection === "study" ? (
              <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                {selectedStack ? (
                  <>
                    <NextStepCard
                      stack={selectedStack.stack}
                      summary={selectedStack.summary}
                      roadmapTitle={roadmap?.title}
                      onOpenRoadmap={() => openRoadmap(selectedStack.stack)}
                    />
                    <ProUpgradeWidget onOpenPlans={onNavigateToPlans} />
                    <RoadmapPreviewCard
                      stack={selectedStack.stack}
                      roadmapTitle={roadmap?.title}
                      summary={roadmap?.summary}
                      onOpenRoadmap={() => openRoadmap(selectedStack.stack)}
                    />
                    <div className="xl:col-span-2">
                      <PremiumFeatureOverlay
                        unlocked={isPro}
                        onOpenPlans={onNavigateToPlans}
                        title="Area Pro em demonstracao"
                        description="Este espaco mostra como o DevTech Pro pode ganhar novas camadas de acompanhamento sem mudar o valor principal do produto."
                      >
                        <Card>
                          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold">Espaco reservado para evolucoes do Pro</p>
                              <p className="text-sm leading-6 text-muted-foreground">
                                Nesta demonstracao, esta area representa como o plano Pro pode crescer no futuro sem interferir no uso do plano gratuito hoje.
                              </p>
                            </div>
                            {!isPro ? (
                              <div className="flex flex-wrap gap-2">
                                <Badge tone="info">Pro</Badge>
                                <Badge tone="info">Em demonstracao</Badge>
                              </div>
                            ) : null}
                          </CardContent>
                        </Card>
                      </PremiumFeatureOverlay>
                    </div>
                  </>
                ) : (
                  <Card className="xl:col-span-2">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Plano de estudo
                      </div>
                      <h2 className="text-2xl font-semibold">Escolha uma stack para abrir o proximo passo</h2>
                      <p className="max-w-[58ch] text-sm leading-7 text-muted-foreground">
                        Primeiro compare as opcoes. Depois volte aqui para abrir um roadmap ligado ao caminho que fez mais sentido para voce.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>
            ) : null}

          </Tabs>
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Navegacao</SheetTitle>
            <SheetDescription>Acesse as areas principais do dashboard e acompanhe o status da integracao.</SheetDescription>
          </SheetHeader>
          <div className="px-4 py-4 sm:px-5">
            <AppSidebar mobile onOpenGuide={handleOpenGuide} onOpenPlans={onNavigateToPlans} />
          </div>
        </SheetContent>
      </Sheet>

      <OnboardingTour
        open={onboardingOpen}
        onClose={handleCloseGuide}
        onComplete={handleCloseGuide}
        onNavigate={handleNavigateFromGuide}
      />
    </main>
  );
}
