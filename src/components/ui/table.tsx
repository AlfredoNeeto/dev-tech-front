import { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />;
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />;
}

export function TBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TR({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-border/70 transition-colors hover:bg-secondary/60", className)} {...props} />;
}

export function TH({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3 text-left font-semibold text-muted-foreground", className)} {...props} />;
}

export function TD({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-top", className)} {...props} />;
}
