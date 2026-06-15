import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <strong className="mt-3 block break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{value}</strong>
          </div>
          <span className="shrink-0 rounded-md border border-border bg-secondary p-2 text-secondary-foreground">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <p className="max-w-[28ch] text-sm leading-6 text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
