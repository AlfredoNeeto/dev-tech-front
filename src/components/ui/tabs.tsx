import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid gap-6", className)}>{children}</div>;
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto rounded-lg border border-border bg-card p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
