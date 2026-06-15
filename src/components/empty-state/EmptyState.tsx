import { Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
        <Compass className="h-8 w-8 text-muted-foreground" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mx-auto max-w-[48ch] text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
