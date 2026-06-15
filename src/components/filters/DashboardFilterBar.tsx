import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { StackSelector } from "@/components/filters/StackSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DashboardFilters, FiltersData } from "@/types/dashboard";

function formatSeniorityLabel(value: string) {
  if (value === "all") return "Todos os níveis";
  if (value === "junior") return "Mais vagas de entrada";
  if (value === "mid") return "Mais vagas pleno";
  if (value === "senior") return "Mais vagas sênior";
  return value;
}

function formatModalityLabel(value: string) {
  if (value === "all") return "Todos";
  if (value === "remote") return "Remoto";
  if (value === "office") return "Presencial";
  return value;
}

function FilterFields({
  filters,
  options,
  onChange,
}: {
  filters: DashboardFilters;
  options: FiltersData;
  onChange: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">Seu foco agora</span>
        <Select value={filters.goal} onChange={(event) => onChange("goal", event.target.value as DashboardFilters["goal"])}>
          <option value="balanced">Equilibrar chance e retorno</option>
          <option value="firstJob">Conseguir a primeira vaga</option>
          <option value="remote">Buscar trabalho remoto</option>
          <option value="salary">Buscar salário maior</option>
          <option value="demand">Encontrar mais vagas</option>
          <option value="growth">Entrar em mercado aquecido</option>
        </Select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">Janela de análise</span>
        <Select value={filters.period} onChange={(event) => onChange("period", event.target.value)}>
          {options.periods.map((period) => (
            <option key={period} value={String(period)}>
              {period} dias
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">Tecnologia em foco</span>
        <StackSelector value={filters.stack} stacks={options.stacks} onChange={(value) => onChange("stack", value)} />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">Estado</span>
        <Select value={filters.state} onChange={(event) => onChange("state", event.target.value)}>
          <option value="all">Todos</option>
          {options.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">Nível de experiência</span>
        <Select value={filters.seniority} onChange={(event) => onChange("seniority", event.target.value as DashboardFilters["seniority"])}>
          {["all", ...(options.seniorities ?? []).filter((item) => item !== "all")].map((seniority) => (
            <option key={seniority} value={seniority}>
              {formatSeniorityLabel(seniority)}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">Modelo de trabalho</span>
        <Select value={filters.modality} onChange={(event) => onChange("modality", event.target.value as DashboardFilters["modality"])}>
          {(options.modalities ?? ["all", "remote", "office"]).map((modality) => (
            <option key={modality} value={modality}>
              {formatModalityLabel(modality)}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">Mostrar primeiro</span>
        <Select value={filters.sort} onChange={(event) => onChange("sort", event.target.value as DashboardFilters["sort"])}>
          <option value="recommended">Sugestões mais promissoras</option>
          <option value="demand">Maior volume de vagas</option>
          <option value="junior">Mais vagas de entrada</option>
          <option value="remote">Mais vagas remotas</option>
          <option value="salary">Maior salário</option>
          <option value="growth">Maior crescimento</option>
        </Select>
      </label>
      <label className="grid gap-2 text-sm md:col-span-2 xl:col-span-2">
        <span className="font-medium text-muted-foreground">Buscar empresa, cidade ou palavra-chave</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Ex: remoto, banco, São Paulo..."
          />
        </div>
      </label>
    </div>
  );
}

export function DashboardFilterBar({
  filters,
  options,
  onChange,
  onReset,
}: {
  filters: DashboardFilters;
  options: FiltersData;
  onChange: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  onReset: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const summary = useMemo(() => {
    const parts = [
      filters.goal === "balanced" ? "Equilibrado" : filters.goal,
      filters.stack === "all" ? "Todas as stacks" : filters.stack,
      filters.state === "all" ? "Todos os estados" : filters.state,
    ];

    return parts.join(" · ");
  }, [filters.goal, filters.stack, filters.state]);

  return (
    <>
      <Card className="lg:hidden">
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold">Ajuste a busca ao seu momento</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{summary}</p>
            </div>
            <Button type="button" variant="outline" className="shrink-0" onClick={() => setMobileOpen(true)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border bg-secondary px-3 py-1">{filters.period} dias</span>
            <span className="rounded-full border border-border bg-secondary px-3 py-1">{filters.modality === "all" ? "Todos os formatos" : formatModalityLabel(filters.modality)}</span>
            <span className="rounded-full border border-border bg-secondary px-3 py-1">{filters.seniority === "all" ? "Todos os níveis" : formatSeniorityLabel(filters.seniority)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="hidden lg:block">
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Ajuste a busca ao seu momento</h2>
              <p className="mt-1 max-w-[54ch] text-sm leading-6 text-muted-foreground">
                Escolha seu objetivo principal e refine os dados até encontrar opções que façam sentido para você agora.
              </p>
            </div>
            <Button variant="outline" onClick={onReset}>
              Limpar tudo
            </Button>
          </div>
          <FilterFields filters={filters} options={options} onChange={onChange} />
        </CardContent>
      </Card>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtrar resultados</SheetTitle>
            <SheetDescription>Refine a busca para chegar em stacks mais próximas do seu momento atual.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 py-4 sm:px-5">
            <FilterFields filters={filters} options={options} onChange={onChange} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" onClick={onReset}>
                Limpar tudo
              </Button>
              <Button onClick={() => setMobileOpen(false)}>Ver resultados</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
