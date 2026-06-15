import { useEffect, useState } from "react";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { PlansPage } from "@/pages/PlansPage";

export function App() {
  const [path, setPath] = useState(() => window.location.pathname || "/");

  useEffect(() => {
    function handlePopState() {
      setPath(window.location.pathname || "/");
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextPath: "/" | "/plans" | "/pricing" | "/checkout") {
    const normalized = nextPath === "/pricing" ? "/plans" : nextPath;
    window.history.pushState({}, "", normalized);
    setPath(normalized);
  }

  if (path === "/checkout") {
    return <CheckoutPage onBackToDashboard={() => navigate("/")} onBackToPlans={() => navigate("/plans")} />;
  }

  if (path === "/plans" || path === "/pricing") {
    return <PlansPage onBackToDashboard={() => navigate("/")} onGoToCheckout={() => navigate("/checkout")} />;
  }

  return <DashboardPage onNavigateToPlans={() => navigate("/plans")} />;
}
