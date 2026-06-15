import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { PlanProvider } from "@/app/plan";
import { ThemeProvider } from "@/app/theme";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider>
      <PlanProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </PlanProvider>
    </ThemeProvider>
  );
}
