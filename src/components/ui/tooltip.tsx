import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({
  content,
  children,
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open ? (
        <span className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs leading-6 text-muted-foreground shadow-lg">
          {content}
        </span>
      ) : null}
    </span>
  );
}
