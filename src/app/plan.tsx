import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

type Plan = "free" | "pro";

interface PlanContextValue {
  plan: Plan;
  isPro: boolean;
  activatePro: () => void;
  resetPlan: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function readStoredPlan(): Plan {
  if (typeof window === "undefined") return "free";
  return window.localStorage.getItem("devtech-plan") === "pro" ? "pro" : "free";
}

export function PlanProvider({ children }: PropsWithChildren) {
  const [plan, setPlan] = useState<Plan>(readStoredPlan);

  useEffect(() => {
    window.localStorage.setItem("devtech-plan", plan);
  }, [plan]);

  const value = useMemo(
    () => ({
      plan,
      isPro: plan === "pro",
      activatePro: () => setPlan("pro"),
      resetPlan: () => setPlan("free"),
    }),
    [plan],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan precisa ser usado dentro de PlanProvider.");
  }

  return context;
}
