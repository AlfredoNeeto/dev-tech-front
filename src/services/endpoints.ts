export const endpoints = {
  status: "/api/dashboard/status",
  filters: "/api/dashboard/filters",
  overview: "/api/dashboard/overview",
  stackDetails: (stack: string) => `/api/dashboard/stacks/${encodeURIComponent(stack)}`,
  stackAnalysis: (stack: string) => `/api/dashboard/stacks/${encodeURIComponent(stack)}/analysis`,
} as const;
