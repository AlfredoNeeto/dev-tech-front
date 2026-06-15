import { filtersSchema } from "@/types/api";
import {
  DashboardFilters,
  DashboardOverviewResponse,
  DashboardStatus,
  DashboardSummary,
  FiltersData,
  OpportunityRegion,
  RankingItem,
  Recommendation,
  SalaryInsight,
  StackAnalysis,
  StackDetail,
  TrendInsight,
} from "@/types/dashboard";

const API_BASE_URL = "https://api.alfredonetodev.net";

type ApiOverviewSummary = {
  totalJobs: number;
  recentJobs: number;
  medianSalary: number;
  juniorJobs: number;
  topDemandStack: string | null;
  recommendedStack: string | null;
  period: number;
};

type ApiRecommendation = {
  stack: string | null;
  opportunityScore: number;
  reasons: string[] | null;
  warning: string | null;
};

type ApiRankingItem = {
  stack: string | null;
  category: string | null;
  totalJobs: number;
  demandScore: number;
  opportunityScore: number;
  juniorPercent: number;
  midPercent: number;
  seniorPercent: number;
  remotePercent: number;
  salaryMedian: number | null;
  salaryP25: number | null;
  salaryP75: number | null;
  salaryCoveragePercent: number;
  newJobs7: number;
  newJobs30: number;
  recentJobs: number;
  trendPercent: number;
  topState: string | null;
  topCompany: string | null;
};

type ApiOverviewResponse = {
  summary: ApiOverviewSummary;
  recommendation: ApiRecommendation;
  ranking: ApiRankingItem[];
};

type ApiStackDetailResponse = {
  stack: string | null;
  totalJobs: number;
  demandScore: number;
  juniorPercent: number;
  midPercent: number;
  seniorPercent: number;
  remotePercent: number;
  salaryMedian: number | null;
  salaryP25: number | null;
  salaryP75: number | null;
  salaryCoveragePercent: number;
  newJobs7: number;
  newJobs30: number;
  recentJobs: number;
  topState: string | null;
  topCompany: string | null;
  states: Array<{ state: string | null; jobs: number; rank: number }> | null;
  companies: Array<{ company: string | null; jobs: number; rank: number }> | null;
  seniority:
    | Array<{
        level: string | null;
        jobs: number;
        percent: number;
        salaryMedian: number | null;
        salaryAvg: number | null;
        salaryP25: number | null;
        salaryP75: number | null;
      }>
    | null;
  trend:
    | Array<{
        date: string;
        totalJobs: number;
        newJobs7: number;
        demandScore: number;
        remotePercent: number;
        salaryMedian: number | null;
        salaryP25: number | null;
        salaryP75: number | null;
      }>
    | null;
};

type ApiDashboardStatusResponse = {
  hasData: boolean;
  lastGoldRun: string | null;
  totalStacks: number;
  totalGoldRows: number;
  dataSource: string | null;
  isMock: boolean;
};

type ApiStackAnalysisResponse = {
  title: string;
  summary: string;
  reasons: string[] | null;
  risks: string[] | null;
  nextStep: string;
  confidence: "high" | "medium" | "low";
};

function buildOverviewParams(filters: DashboardFilters) {
  return new URLSearchParams({
    goal: filters.goal,
    period: filters.period,
    state: filters.state,
    seniority: filters.seniority,
    modality: filters.modality,
    sort: filters.sort,
    search: filters.search,
  });
}

function buildStackDetailParams(filters: DashboardFilters) {
  return new URLSearchParams({
    period: filters.period,
  });
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeRankingItem(item: ApiRankingItem): RankingItem {
  return {
    stack: item.stack ?? "Stack não informada",
    category: item.category ?? "Tecnologia",
    totalJobs: item.totalJobs,
    recentJobs: item.recentJobs,
    juniorPercent: item.juniorPercent,
    remotePercent: item.remotePercent,
    salaryMedian: item.salaryMedian ?? 0,
    salaryP25: item.salaryP25 ?? 0,
    salaryP75: item.salaryP75 ?? 0,
    trendPercent: item.trendPercent,
    opportunityScore: item.opportunityScore,
    topCompany: item.topCompany ?? "Sem dado",
    topState: item.topState ?? "Sem dado",
    beginnerFriendly: item.juniorPercent >= 8,
  };
}

function sortRanking(filters: DashboardFilters, ranking: RankingItem[]) {
  const items = [...ranking];

  switch (filters.sort) {
    case "demand":
      return items.sort((a, b) => b.totalJobs - a.totalJobs);
    case "junior":
      return items.sort((a, b) => b.juniorPercent - a.juniorPercent);
    case "remote":
      return items.sort((a, b) => b.remotePercent - a.remotePercent);
    case "salary":
      return items.sort((a, b) => b.salaryMedian - a.salaryMedian);
    case "growth":
      return items.sort((a, b) => b.trendPercent - a.trendPercent);
    default:
      return items.sort((a, b) => b.opportunityScore - a.opportunityScore);
  }
}

function buildRecommendation(ranking: RankingItem[], fallback: ApiRecommendation): Recommendation {
  const top = ranking[0];

  if (!top) {
    return {
      stack: fallback.stack ?? "Sem recomendação",
      opportunityScore: fallback.opportunityScore ?? 0,
      reasons: fallback.reasons ?? [],
      warning: fallback.warning ?? "",
    };
  }

  return {
    stack: top.stack,
    opportunityScore: top.opportunityScore,
    reasons: fallback.reasons?.length ? fallback.reasons : [`${top.stack} aparece com boa combinação entre vagas, remuneração e continuidade.`],
    warning: fallback.warning ?? "Use esse ranking como ponto de partida e compare também senioridade, remuneração e volume de vagas.",
  };
}

function buildSummary(source: ApiOverviewSummary, ranking: RankingItem[]): DashboardSummary {
  const visibleRanking = ranking.length ? ranking : [];
  const salaryValues = visibleRanking.map((item) => item.salaryMedian).filter((value) => value > 0);

  return {
    totalJobs: visibleRanking.reduce((sum, item) => sum + item.totalJobs, 0) || source.totalJobs,
    recentJobs: visibleRanking.reduce((sum, item) => sum + item.recentJobs, 0) || source.recentJobs,
    period: source.period,
    topDemandStack: visibleRanking[0]?.stack ?? source.topDemandStack ?? "Sem dado",
    recommendedStack: visibleRanking[0]?.stack ?? source.recommendedStack ?? "Sem dado",
    medianSalary: salaryValues.length ? average(salaryValues) : source.medianSalary,
    remoteShare: average(visibleRanking.map((item) => item.remotePercent)),
    marketTrend: average(visibleRanking.map((item) => item.trendPercent)),
  };
}

function normalizeOverview(filters: DashboardFilters, response: ApiOverviewResponse): DashboardOverviewResponse {
  const normalizedRanking = response.ranking.map(normalizeRankingItem);
  const stackFiltered = filters.stack === "all" ? normalizedRanking : normalizedRanking.filter((item) => item.stack === filters.stack);
  const ranking = sortRanking(filters, stackFiltered);

  return {
    summary: buildSummary(response.summary, ranking),
    recommendation: buildRecommendation(ranking, response.recommendation),
    ranking,
  };
}

function formatTrendLabel(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
}

export function getIntegrationStatus() {
  return {
    configured: true,
    baseUrl: null,
    label: "Integração ativa",
    description: "Os dados do dashboard estão sendo carregados normalmente.",
  };
}

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Falha ao carregar ${path}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getDashboardFilters(): Promise<FiltersData> {
  const data = filtersSchema.parse(await requestJson("/api/dashboard/filters"));

  return {
    ...data,
    seniorities: data.seniorities,
    modalities: data.modalities,
    stacks: [...data.stacks].sort((a, b) => a.localeCompare(b, "pt-BR")),
    states: [...data.states].sort((a, b) => a.localeCompare(b, "pt-BR")),
  };
}

export async function getDashboardStatus(): Promise<DashboardStatus> {
  const response = await requestJson<ApiDashboardStatusResponse>("/api/dashboard/status");
  return {
    hasData: response.hasData,
    lastGoldRun: response.lastGoldRun,
    totalStacks: response.totalStacks,
    totalGoldRows: response.totalGoldRows,
    dataSource: response.dataSource,
    isMock: response.isMock,
  };
}

export async function getDashboardOverview(filters: DashboardFilters): Promise<DashboardOverviewResponse> {
  const params = buildOverviewParams(filters);
  const response = await requestJson<ApiOverviewResponse>(`/api/dashboard/overview?${params.toString()}`);
  return normalizeOverview(filters, response);
}

export async function getDashboardStackDetail(filters: DashboardFilters, stack: string): Promise<StackDetail | null> {
  const params = buildStackDetailParams(filters);
  const detail = await requestJson<ApiStackDetailResponse>(`/api/dashboard/stacks/${encodeURIComponent(stack)}?${params.toString()}`);

  return {
    stack: detail.stack ?? stack,
    summary: {
      stack: detail.stack ?? stack,
      category: "Tecnologia",
      totalJobs: detail.totalJobs,
      recentJobs: detail.recentJobs,
      juniorPercent: detail.juniorPercent,
      remotePercent: detail.remotePercent,
      salaryMedian: detail.salaryMedian ?? 0,
      salaryP25: detail.salaryP25 ?? 0,
      salaryP75: detail.salaryP75 ?? 0,
      trendPercent: 0,
      opportunityScore: detail.demandScore,
      topCompany: detail.topCompany ?? "Sem dado",
      topState: detail.topState ?? "Sem dado",
      beginnerFriendly: detail.juniorPercent >= 8,
    },
    states:
      detail.states?.map((item) => ({
        state: item.state ?? "Sem dado",
        jobs: item.jobs,
      })) ?? [],
    companies:
      detail.companies?.map((item) => ({
        company: item.company ?? "Sem dado",
        jobs: item.jobs,
      })) ?? [],
    seniority:
      detail.seniority?.map((item) => ({
        level: item.level ?? "Sem dado",
        percent: item.percent,
        jobs: item.jobs,
        salaryMedian: item.salaryMedian ?? 0,
        salaryP25: item.salaryP25 ?? 0,
        salaryP75: item.salaryP75 ?? 0,
      })) ?? [],
    trend:
      detail.trend?.map((item) => ({
        month: formatTrendLabel(item.date),
        totalJobs: item.totalJobs,
      })) ?? [],
  };
}

export async function getDashboardStackAnalysis(filters: DashboardFilters, stack: string): Promise<StackAnalysis> {
  const params = buildOverviewParams(filters);
  const response = await requestJson<ApiStackAnalysisResponse>(
    `/api/dashboard/stacks/${encodeURIComponent(stack)}/analysis?${params.toString()}`,
  );

  return {
    title: response.title,
    summary: response.summary,
    reasons: response.reasons ?? [],
    risks: response.risks ?? [],
    nextStep: response.nextStep,
    confidence: response.confidence,
  };
}

export async function getDashboardSalaryInsights(filters: DashboardFilters): Promise<SalaryInsight[]> {
  const overview = await getDashboardOverview(filters);
  return overview.ranking
    .filter((item) => item.salaryMedian > 0 || item.salaryP25 > 0 || item.salaryP75 > 0)
    .map((item) => ({
      stack: item.stack,
      p25: item.salaryP25,
      median: item.salaryMedian,
      p75: item.salaryP75,
    }));
}

export async function getDashboardOpportunityMap(filters: DashboardFilters, stack: string): Promise<OpportunityRegion[]> {
  if (stack && stack !== "all") {
    const detail = await getDashboardStackDetail(filters, stack);
    return (
      detail?.states.map((item) => ({
        state: item.state,
        city: "",
        stack: detail.stack,
        jobs: item.jobs,
        remoteShare: detail.summary.remotePercent,
      })) ?? []
    );
  }

  const overview = await getDashboardOverview(filters);
  return overview.ranking
    .filter((item) => item.topState && item.topState !== "Sem dado")
    .slice(0, 8)
    .map((item) => ({
      state: item.topState,
      city: "",
      stack: item.stack,
      jobs: item.totalJobs,
      remoteShare: item.remotePercent,
    }));
}

export async function getDashboardMarketTrends(filters: DashboardFilters, stack: string): Promise<TrendInsight[]> {
  const detail = await getDashboardStackDetail(filters, stack);
  return (
    detail?.trend.map((item) => ({
      stack: detail.stack,
      month: item.month,
      totalJobs: item.totalJobs,
    })) ?? []
  );
}

export async function getDashboardBeginnerRanking(filters: DashboardFilters): Promise<RankingItem[]> {
  const overview = await getDashboardOverview(filters);
  return [...overview.ranking].sort((a, b) => {
    if (a.beginnerFriendly !== b.beginnerFriendly) {
      return Number(b.beginnerFriendly) - Number(a.beginnerFriendly);
    }
    if (a.juniorPercent !== b.juniorPercent) {
      return b.juniorPercent - a.juniorPercent;
    }
    return b.opportunityScore - a.opportunityScore;
  });
}
