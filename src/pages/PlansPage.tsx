import { PlansShowcase } from "@/components/plans/PlansShowcase";

export function PlansPage({
  onBackToDashboard,
  onGoToCheckout,
}: {
  onBackToDashboard: () => void;
  onGoToCheckout: () => void;
}) {
  return <PlansShowcase onBackToDashboard={onBackToDashboard} onGoToCheckout={onGoToCheckout} />;
}
