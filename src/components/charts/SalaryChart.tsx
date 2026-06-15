import { formatCurrency } from "@/lib/utils";
import { SalaryInsight } from "@/types/dashboard";

export function SalaryChart({ data }: { data: SalaryInsight[] }) {
  const ceiling = Math.max(...data.map((item) => item.p75), 1);

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-border bg-muted p-4">
        <p className="text-sm font-semibold">Como ler os valores</p>
        <div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <p>
            <strong className="text-foreground">P25</strong> mostra uma faixa mais proxima da entrada.
          </p>
          <p>
            <strong className="text-foreground">Mediana</strong> marca o ponto central do mercado.
          </p>
          <p>
            <strong className="text-foreground">P75</strong> indica uma faixa alta ainda recorrente.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <div className="hidden grid-cols-[148px_1fr] items-center gap-4 text-xs text-muted-foreground md:grid">
          <span />
          <div className="flex items-center justify-between">
            <span>R$ 0</span>
            <span>{formatCurrency(ceiling / 2)}</span>
            <span>{formatCurrency(ceiling)}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary/45" />
            P25
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" />
            Mediana
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
            P75
          </span>
        </div>

        <div className="mt-5 grid gap-6">
          {data.map((item) => {
            const p25 = (item.p25 / ceiling) * 100;
            const median = (item.median / ceiling) * 100;
            const p75 = (item.p75 / ceiling) * 100;
            const width = Math.max(p75 - p25, 2);

            return (
              <div key={item.stack} className="grid gap-3 md:grid-cols-[148px_1fr] md:items-center">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{item.stack}</p>
                  <p className="text-xs text-muted-foreground">Mediana de {formatCurrency(item.median)}</p>
                </div>

                <div className="space-y-3">
                  <div className="relative h-12">
                    <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-secondary" />
                    <div
                      className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary/18"
                      style={{ left: `${p25}%`, width: `${width}%` }}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/45"
                      style={{ left: `${p25}%` }}
                    />
                    <div
                      className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary"
                      style={{ left: `${median}%` }}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70"
                      style={{ left: `${p75}%` }}
                    />
                  </div>

                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                    <span>P25: {formatCurrency(item.p25)}</span>
                    <span>Mediana: {formatCurrency(item.median)}</span>
                    <span>P75: {formatCurrency(item.p75)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
