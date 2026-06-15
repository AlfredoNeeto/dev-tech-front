export type Goal = "balanced" | "firstJob" | "remote" | "salary" | "demand" | "growth";

export type SeniorityFilter = "all" | "junior" | "mid" | "senior" | "Não informado";
export type ModalityFilter = "all" | "remote" | "office" | "hybrid";

export interface DashboardFilters {
  goal: Goal;
  period: string;
  stack: string;
  state: string;
  seniority: SeniorityFilter;
  modality: ModalityFilter;
  sort: "recommended" | "demand" | "junior" | "remote" | "salary" | "growth";
  search: string;
}

export interface RankingItem {
  stack: string;
  category: string;
  totalJobs: number;
  recentJobs: number;
  juniorPercent: number;
  remotePercent: number;
  salaryMedian: number;
  salaryP25: number;
  salaryP75: number;
  trendPercent: number;
  opportunityScore: number;
  topCompany: string;
  topState: string;
  beginnerFriendly: boolean;
  studyFocus?: string;
}

export interface DashboardSummary {
  totalJobs: number;
  recentJobs: number;
  period: number;
  topDemandStack: string;
  recommendedStack: string;
  medianSalary: number;
  remoteShare: number;
  marketTrend: number;
}

export interface Recommendation {
  stack: string;
  opportunityScore: number;
  reasons: string[];
  warning: string;
}

export interface FiltersData {
  stacks: string[];
  states: string[];
  seniorities?: string[];
  modalities?: string[];
  periods: number[];
}

export interface StackDetail {
  stack: string;
  summary: RankingItem;
  states: Array<{ state: string; jobs: number }>;
  companies: Array<{ company: string; jobs: number }>;
  seniority: Array<{ level: string; percent: number; jobs: number; salaryMedian?: number; salaryP25?: number; salaryP75?: number }>;
  modalities?: Array<{ label: string; percent: number }>;
  trend: Array<{ month: string; totalJobs: number }>;
  studyPlan?: string[];
}

export interface StackAnalysis {
  title: string;
  summary: string;
  reasons: string[];
  risks: string[];
  nextStep: string;
  confidence: "high" | "medium" | "low";
}

export interface SalaryInsight {
  stack: string;
  p25: number;
  median: number;
  p75: number;
}

export interface OpportunityRegion {
  state: string;
  city: string;
  stack: string;
  jobs: number;
  remoteShare: number;
}

export interface TrendInsight {
  stack: string;
  month: string;
  totalJobs: number;
}

export interface DashboardOverviewResponse {
  summary: DashboardSummary;
  recommendation: Recommendation;
  ranking: RankingItem[];
}

export interface DashboardStatus {
  hasData: boolean;
  lastGoldRun: string | null;
  totalStacks: number;
  totalGoldRows: number;
  dataSource: string | null;
  isMock: boolean;
}
