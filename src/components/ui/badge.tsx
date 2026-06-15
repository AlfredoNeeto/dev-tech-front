import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "border-transparent bg-secondary text-secondary-foreground",
        tone === "success" && "border-transparent bg-primary text-primary-foreground",
        tone === "warning" && "border-transparent bg-accent text-accent-foreground",
        tone === "danger" && "border-transparent bg-destructive text-white dark:text-white",
        tone === "info" && "border border-border bg-background text-foreground",
        className,
      )}
      {...props}
    />
  );
}
