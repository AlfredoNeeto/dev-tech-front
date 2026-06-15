import { Lock } from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PremiumFeatureOverlay({
  title,
  description,
  onOpenPlans,
  children,
  unlocked = false,
  className,
}: {
  title: string;
  description: string;
  onOpenPlans: () => void;
  children: ReactNode;
  unlocked?: boolean;
  className?: string;
}) {
  if (unlocked) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", "min-h-[320px] md:min-h-[340px]", className)}>
      <div className="pointer-events-none h-full blur-[2px] opacity-55">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/62 p-4 backdrop-blur-[1px] sm:p-6">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card/95 p-5 text-center shadow-xl">
          <div className="flex justify-center">
            <Badge tone="info">
              <Lock className="mr-1 h-3.5 w-3.5" />
              Recurso Premium
            </Badge>
          </div>
          <p className="mt-4 text-lg font-semibold text-foreground">{title}</p>
          <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-7 text-muted-foreground">{description}</p>
          <Button className="mt-5 w-full sm:w-auto" onClick={onOpenPlans}>
            Conhecer DevTech Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
