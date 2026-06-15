import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  className,
}: {
  items: Array<{ title: string; content: ReactNode }>;
  className?: string;
}) {
  const [openItem, setOpenItem] = useState<number | null>(0);

  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((item, index) => {
        const isOpen = openItem === index;

        return (
          <div key={item.title} className="rounded-lg border border-border bg-card">
            <button
              type="button"
              onClick={() => setOpenItem(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
            >
              <span className="text-sm font-semibold text-foreground">{item.title}</span>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            {isOpen ? <div className="px-4 pb-4 text-sm leading-6 text-muted-foreground">{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
