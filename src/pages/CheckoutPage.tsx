import { ArrowLeft, CheckCircle2, CreditCard, QrCode, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePlan } from "@/app/plan";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CheckoutPage({
  onBackToDashboard,
  onBackToPlans,
}: {
  onBackToDashboard: () => void;
  onBackToPlans: () => void;
}) {
  const { activatePro, isPro } = usePlan();
  const [status, setStatus] = useState<"idle" | "loading" | "success">(isPro ? "success" : "idle");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");

  useEffect(() => {
    if (!isPro) return;
    setStatus("success");
  }, [isPro]);

  function handleConfirm() {
    if (status !== "idle") return;
    setStatus("loading");

    window.setTimeout(() => {
      activatePro();
      setStatus("success");
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground md:px-6">
      <div className="mx-auto grid max-w-5xl gap-6">
        <header className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Dev Tech" className="h-9 w-9" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold">Dev Tech</span>
              {isPro ? <Badge tone="success">Pro</Badge> : null}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="ghost" className="justify-start sm:justify-center" onClick={onBackToPlans}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos planos
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="h-fit">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <Badge tone="warning">Modo demonstracao</Badge>
                <h1 className="text-3xl font-semibold">Checkout do Dev Tech Pro</h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  Esta pagina representa a experiencia futura de assinatura. Os dados estao preenchidos e bloqueados apenas para demonstracao.
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold">Resumo do pedido</p>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold">Dev Tech Pro</p>
                      <p className="mt-1 text-sm text-muted-foreground">Mais contexto para decidir o que estudar e qual stack seguir.</p>
                    </div>
                    <strong className="text-lg sm:text-right">R$ 19,90</strong>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Areas Pro desbloqueadas
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Leitura premium liberada
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Experiencia sem bloqueios visuais
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Informacoes do cliente</h2>
                <p className="text-sm leading-6 text-muted-foreground">Campos bloqueados para manter o checkout como demonstracao visual.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-foreground">Nome</span>
                  <input disabled value="Joao Silva" className="h-11 rounded-md border border-input bg-muted px-3 text-foreground opacity-100" />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-foreground">Email</span>
                  <input disabled value="joao@email.com" className="h-11 rounded-md border border-input bg-muted px-3 text-foreground opacity-100" />
                </label>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Pagamento</h2>
                  <p className="text-sm leading-6 text-muted-foreground">Escolha como o pagamento seria feito nesta demonstracao. Nenhum dado real sera enviado.</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-colors",
                      paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border bg-muted hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold">Cartao</p>
                      </div>
                      {paymentMethod === "card" ? <Badge tone="success">Selecionado</Badge> : null}
                    </div>
                    <div className="mt-3 grid gap-3 text-sm">
                      <input disabled value="**** **** **** 4242" className="h-11 rounded-md border border-input bg-background px-3 text-foreground opacity-100" />
                      <div className="grid grid-cols-2 gap-3">
                        <input disabled value="12/30" className="h-11 min-w-0 rounded-md border border-input bg-background px-3 text-foreground opacity-100" />
                        <input disabled value="***" className="h-11 min-w-0 rounded-md border border-input bg-background px-3 text-foreground opacity-100" />
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pix")}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-colors",
                      paymentMethod === "pix" ? "border-primary bg-primary/5" : "border-border bg-muted hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold">Pix</p>
                      </div>
                      {paymentMethod === "pix" ? <Badge tone="success">Selecionado</Badge> : null}
                    </div>
                    <div className="mt-3 rounded-md border border-dashed border-border bg-background/70 p-4">
                      <p className="text-sm font-medium text-foreground">Pix copia e cola demonstrativo</p>
                      <p className="mt-2 break-all text-sm text-muted-foreground">00020126580014BR.GOV.BCB.PIX0136devtech-demo-checkout520400005303986540519.905802BR5925Dev Tech Demonstracao6009Sao Paulo62290525checkout-demonstrativo6304ABCD</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted p-4">
                {status === "idle" ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Ao confirmar com {paymentMethod === "card" ? "cartao" : "Pix"}, a assinatura sera ativada localmente e a interface passara para o estado Pro.
                  </p>
                ) : null}
                {status === "loading" ? <p className="text-sm font-medium text-foreground">Processando pagamento...</p> : null}
                {status === "success" ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Assinatura ativada com sucesso.</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">O dashboard agora mostra a experiencia Pro completa nesta demonstracao.</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {status !== "success" ? <Button onClick={handleConfirm}>{status === "loading" ? "Processando..." : "Confirmar assinatura"}</Button> : null}
                <Button variant={status === "success" ? "default" : "outline"} onClick={onBackToDashboard}>
                  {status === "success" ? "Ir para o dashboard Pro" : "Voltar ao dashboard"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
