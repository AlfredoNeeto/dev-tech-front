import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-border bg-muted p-4", className)}>{children}</div>;
}

export function AlertTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("text-sm font-semibold", className)}>{children}</p>;
}

export function AlertDescription({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("mt-2 text-sm leading-7 text-muted-foreground", className)}>{children}</p>;
}
