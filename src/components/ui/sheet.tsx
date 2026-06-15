import { ReactNode, createContext, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type SheetContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within Sheet");
  }
  return context;
}

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return <SheetContext.Provider value={{ open, onOpenChange }}>{children}</SheetContext.Provider>;
}

export function SheetContent({
  side = "left",
  className,
  children,
}: {
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  const { open, onOpenChange } = useSheetContext();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Fechar painel"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute inset-y-0 z-50 flex w-[min(92vw,24rem)] flex-col border-border bg-background shadow-lg",
          side === "left" ? "left-0 border-r" : "right-0 border-l",
          className,
        )}
      >
        <button
          type="button"
          aria-label="Fechar painel"
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function SheetHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("space-y-1 border-b border-border px-4 py-4 pr-14 sm:px-5", className)}>{children}</div>;
}

export function SheetTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h2 className={cn("text-base font-semibold text-foreground", className)}>{children}</h2>;
}

export function SheetDescription({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("text-sm leading-6 text-muted-foreground", className)}>{children}</p>;
}
