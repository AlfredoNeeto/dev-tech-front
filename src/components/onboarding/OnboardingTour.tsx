import { ArrowRight, BookOpen, Compass, SearchCheck, Sparkles, X } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TourSection = "discover" | "compare" | "explore" | "study";

type TourStep = {
  title: string;
  description: string;
  takeaway: string;
  icon: ReactNode;
  section: TourSection;
  sectionLabel: string;
};

const steps: TourStep[] = [
  {
    title: "Comece pela melhor sugestao do momento",
    description: "O Dev Tech olha o recorte atual do mercado e mostra qual stack parece mais promissora para voce investigar primeiro.",
    takeaway: "Objetivo desta etapa: sair da tela sabendo qual stack vale olhar primeiro.",
    icon: <SearchCheck className="h-5 w-5 text-primary" />,
    section: "discover",
    sectionLabel: "Descobrir stacks",
  },
  {
    title: "Compare antes de decidir",
    description: "Nao escolha so porque uma stack apareceu em primeiro lugar. Compare entrada, remoto, salario e volume de vagas.",
    takeaway: "Objetivo desta etapa: entender por que uma opcao pode ser melhor que outra.",
    icon: <Compass className="h-5 w-5 text-primary" />,
    section: "compare",
    sectionLabel: "Comparar caminhos",
  },
  {
    title: "Abra a leitura detalhada da stack",
    description: "Na exploracao da stack voce encontra a Analise Inteligente e entende o que os dados significam na pratica.",
    takeaway: "Objetivo desta etapa: transformar numero bruto em orientacao de carreira.",
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    section: "explore",
    sectionLabel: "Explorar stack",
  },
  {
    title: "Leve a decisao para um plano de estudo",
    description: "Quando a stack fizer sentido, abra o roadmap sugerido e comece com uma ordem mais clara de estudo.",
    takeaway: "Objetivo desta etapa: sair do dashboard com um proximo passo concreto.",
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    section: "study",
    sectionLabel: "Plano de estudo",
  },
];

export function OnboardingTour({
  open,
  onClose,
  onComplete,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  onNavigate: (section: TourSection) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = useMemo(() => steps[stepIndex], [stepIndex]);

  useEffect(() => {
    if (open) {
      setStepIndex(0);
      onNavigate(steps[0].section);
    }
  }, [open]);

  if (!open) return null;

  function goToStep(index: number) {
    setStepIndex(index);
    onNavigate(steps[index].section);
  }

  function handleNext() {
    if (stepIndex === steps.length - 1) {
      setStepIndex(0);
      onComplete();
      return;
    }

    goToStep(stepIndex + 1);
  }

  function handleBack() {
    if (stepIndex === 0) return;
    goToStep(stepIndex - 1);
  }

  function handleClose() {
    setStepIndex(0);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/78 p-4 backdrop-blur-sm sm:p-6">
      <div className="mx-auto flex min-h-full max-w-3xl items-center justify-center">
        <Card className="w-full border-border shadow-2xl">
          <CardContent className="max-h-[88vh] overflow-y-auto p-5 sm:p-6">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    Guia rapido de primeira visita
                  </div>
                  <div className="space-y-2">
                    <h2 className="max-w-[14ch] text-3xl font-semibold tracking-tight sm:text-4xl">
                      Entenda o Dev Tech sem se perder na tela
                    </h2>
                    <p className="max-w-[58ch] text-sm leading-7 text-muted-foreground sm:text-base">
                      O objetivo aqui nao e ensinar tudo. E mostrar o caminho mais rapido para sair com uma decisao mais clara sobre o que estudar.
                    </p>
                  </div>
                </div>

                <Button variant="ghost" className="px-2" onClick={handleClose} aria-label="Fechar guia">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {steps.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => goToStep(index)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                        index === stepIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <span>{index + 1}</span>
                      <span>{item.sectionLabel}</span>
                    </button>
                  ))}
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-200"
                    style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-[linear-gradient(180deg,oklch(var(--primary)/0.08),transparent_70%)] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                    {step.icon}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Etapa {stepIndex + 1} de {steps.length}</p>
                      <h3 className="text-2xl font-semibold sm:text-3xl">{step.title}</h3>
                      <p className="max-w-[56ch] text-sm leading-7 text-muted-foreground sm:text-base">{step.description}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4">
                      <p className="text-sm font-semibold">O que voce precisa sair entendendo</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.takeaway}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm text-muted-foreground">1. Mercado</p>
                        <p className="mt-2 text-sm font-semibold">Ver o cenario</p>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm text-muted-foreground">2. Decisao</p>
                        <p className="mt-2 text-sm font-semibold">Escolher melhor</p>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm text-muted-foreground">3. Estudo</p>
                        <p className="mt-2 text-sm font-semibold">Comecar com rumo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleClose}>
                    Pular guia
                  </Button>
                  <Button variant="outline" onClick={() => onNavigate(step.section)}>
                    Abrir esta area
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack} disabled={stepIndex === 0}>
                    Voltar
                  </Button>
                  <Button onClick={handleNext}>
                    {stepIndex === steps.length - 1 ? "Comecar agora" : "Proximo"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
