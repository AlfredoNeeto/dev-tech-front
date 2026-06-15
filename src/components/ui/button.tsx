import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-10",
        variant === "default" && "bg-primary text-primary-foreground hover:opacity-90",
        variant === "outline" && "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        variant === "ghost" && "text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
});
