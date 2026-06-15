import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-48 flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mx-auto max-w-[48ch] text-sm text-muted-foreground">{description}</p>
        </div>
        {onRetry ? <Button onClick={onRetry}>Tentar carregar de novo</Button> : null}
      </CardContent>
    </Card>
  );
}
