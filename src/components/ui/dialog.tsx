import { ReactNode, createContext, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog components must be used within Dialog");
  return context;
}

export function Dialog({
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

  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogContent({ className, children }: { className?: string; children: ReactNode }) {
  const { open, onOpenChange } = useDialogContext();

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 p-4 sm:p-6">
      <button
        type="button"
        aria-label="Fechar dialogo"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative mx-auto flex min-h-full max-w-2xl items-center justify-center">
        <div className={cn("relative w-full rounded-2xl border border-border bg-card shadow-2xl", className)}>
          <button
            type="button"
            aria-label="Fechar dialogo"
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("space-y-2 px-5 pb-0 pt-5 sm:px-6 sm:pt-6", className)}>{children}</div>;
}

export function DialogTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h2 className={cn("pr-12 text-xl font-semibold text-foreground", className)}>{children}</h2>;
}

export function DialogDescription({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("text-sm leading-7 text-muted-foreground", className)}>{children}</p>;
}

export function DialogFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("flex flex-col gap-3 px-5 pb-5 pt-4 sm:flex-row sm:justify-end sm:px-6 sm:pb-6", className)}>{children}</div>;
}
