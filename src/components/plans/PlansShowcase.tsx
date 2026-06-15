import { ArrowLeft, Check, CircleHelp, ShieldCheck, Sparkles, Star } from "lucide-react";
import { usePlan } from "@/app/plan";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Accordion } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const planFeatures = [
  { label: "Ranking de stacks", free: true, pro: true },
  { label: "Dados de mercado", free: true, pro: true },
  { label: "Salarios", free: true, pro: true },
  { label: "Tendencias", free: true, pro: true },
  { label: "Roadmaps", free: true, pro: true },
  { label: "Analise Inteligente basica", free: true, pro: true },
  { label: "Camada premium de comparacao", free: false, pro: true },
  { label: "Camada premium de aprofundamento", free: false, pro: true },
  { label: "Gestao da assinatura demonstrativa", free: false, pro: true },
];

const faqItems = [
  {
    title: "Os dados do DevTech sao reais?",
    content: "Sim. O DevTech usa a API principal como fonte de verdade e organiza essa leitura para ajudar voce a decidir o que estudar com mais seguranca.",
  },
  {
    title: "A analise inteligente inventa informacoes?",
    content: "Nao. A analise interpreta os dados do produto para reduzir duvidas e explicar, em linguagem mais simples, o que o mercado esta sinalizando.",
  },
  {
    title: "Qual a diferenca entre Free e Pro?",
    content: "O plano gratuito ajuda voce a descobrir stacks, entender o mercado e abrir roadmaps. O Pro entra quando voce quer uma leitura mais aprofundada das comparacoes e das sugestoes do produto.",
  },
  {
    title: "O checkout ja e real?",
    content: "Ainda nao. Nesta versao, o checkout e demonstrativo e existe para mostrar como a monetizacao deve funcionar futuramente.",
  },
];

export function PlansShowcase({
  onBackToDashboard,
  onGoToCheckout,
}: {
  onBackToDashboard: () => void;
  onGoToCheckout: () => void;
}) {
  const { isPro, resetPlan } = usePlan();

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-5 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-8">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Dev Tech" className="h-9 w-9" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold">Dev Tech</span>
              {isPro ? <Badge tone="success">Pro</Badge> : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onBackToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao dashboard
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <section className="rounded-lg border border-border bg-card">
          <CardContent className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="info">Planos</Badge>
                {!isPro ? <Badge tone="warning">Demonstracao de monetizacao</Badge> : null}
              </div>
              <div className="space-y-3">
                <h1 className="max-w-[13ch] text-4xl font-semibold tracking-tight">Descubra o que estudar com mais confianca.</h1>
                <p className="max-w-[64ch] text-base leading-7 text-muted-foreground">
                  Se voce esta comecando em tecnologia, mudando de carreira ou tentando sair da duvida sobre qual stack vale seu tempo, o Dev Tech ajuda a transformar dados do mercado em um proximo passo mais claro.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="text-sm font-semibold">Mais confianca</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Entenda por que uma stack aparece como boa opcao antes de investir meses estudando.</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="text-sm font-semibold">Mais clareza</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Compare tecnologias com foco em demanda, salario e chance real de entrada.</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="text-sm font-semibold">Mais velocidade</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Chegue mais rapido a uma decisao pratica sobre o que estudar agora e por onde comecar.</p>
                </div>
              </div>
            </div>

            <Card className="bg-muted">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Resumo do upgrade
                </div>
                <h2 className="text-2xl font-semibold">DevTech Pro</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Ideal para quem quer uma leitura mais aprofundada antes de escolher por onde estudar e qual stack faz mais sentido agora.
                </p>
                <Separator />
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Preco de demonstracao</p>
                    <p className="text-3xl font-semibold">R$ 19,90</p>
                  </div>
                  {!isPro ? <Badge tone="success">Mais popular</Badge> : <Badge tone="success">Pro ativo</Badge>}
                </div>
                <Button className="w-full" onClick={isPro ? onBackToDashboard : onGoToCheckout}>
                  {isPro ? "Voltar para a experiencia Pro" : "Experimentar DevTech Pro"}
                </Button>
                <p className="text-xs leading-5 text-muted-foreground">
                  Nenhum pagamento real sera processado nesta versao. O objetivo aqui e demonstrar como a assinatura funcionara futuramente.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </section>

        {isPro ? (
          <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="success">Assinatura ativa</Badge>
                  <Badge tone="info">Gerenciar plano</Badge>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Seu DevTech Pro esta ativo</h2>
                  <p className="max-w-[58ch] text-sm leading-6 text-muted-foreground">
                    Nesta demonstracao, voce ja esta com o plano Pro liberado. Isso significa que as areas premium visiveis no dashboard ficam desbloqueadas e a experiencia segue sem bloqueios visuais.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted p-4">
                    <p className="text-xs font-medium text-muted-foreground">Plano atual</p>
                    <p className="mt-2 text-sm font-semibold">DevTech Pro</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted p-4">
                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                    <p className="mt-2 text-sm font-semibold">Ativo na demonstracao</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted p-4">
                    <p className="text-xs font-medium text-muted-foreground">Preco</p>
                    <p className="mt-2 text-sm font-semibold">R$ 19,90 / mes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted">
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Cancelar assinatura demonstrativa</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Se quiser voltar para o plano gratuito e rever como a oferta aparece para novos usuarios, voce pode cancelar esta assinatura simulada agora.
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={resetPlan}>
                  Cancelar plano atual
                </Button>
                <p className="text-xs leading-5 text-muted-foreground">
                  Esta acao remove apenas o estado Pro salvo localmente nesta demonstracao. Nenhum pagamento real esta vinculado a ela.
                </p>
              </CardContent>
            </Card>
          </section>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">O que continua gratuito</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  O plano gratuito continua util para descobrir stacks, acompanhar salarios e abrir roadmaps. Ele ja ajuda bastante quem esta no comeco e precisa entender melhor o mercado antes de escolher uma direcao.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="text-sm font-semibold">Mercado em leitura simples</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Ranking, tendencias, salarios e dados principais continuam visiveis para orientar seu inicio.</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="text-sm font-semibold">Roadmaps abertos</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Voce continua conseguindo sair do mercado e ir direto para uma trilha de estudo.</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="text-sm font-semibold">Analise basica</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">A leitura inicial segue disponivel para ajudar voce a entender o cenario sem complicacao.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Comparacao de planos</h2>
                <p className="text-sm leading-6 text-muted-foreground">A diferenca entre os planos aparece na profundidade da decisao, nao no acesso ao valor principal do produto.</p>
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <div className="grid grid-cols-[minmax(0,1.4fr)_100px_100px] bg-muted px-4 py-3 text-sm font-semibold">
                  <span>Recurso</span>
                  <span className="text-center">Free</span>
                  <span className="text-center">Pro</span>
                </div>
                {planFeatures.map((item) => (
                  <div key={item.label} className="grid grid-cols-[minmax(0,1.4fr)_100px_100px] items-center border-t border-border px-4 py-3 text-sm">
                    <span className="pr-4 text-foreground">{item.label}</span>
                    <span className="flex justify-center">{item.free ? <Check className="h-4 w-4 text-primary" /> : <span className="text-muted-foreground">-</span>}</span>
                    <span className="flex justify-center">{item.pro ? <Check className="h-4 w-4 text-primary" /> : <span className="text-muted-foreground">-</span>}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardContent className="space-y-3 p-6">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Decisoes com mais confianca</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                O foco do Pro nao e jogar mais numeros na tela, e explicar melhor o que eles significam para a sua carreira.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Menos tempo perdido</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Evite passar meses estudando uma stack que nao conversa com seu objetivo, seu perfil ou seu momento de entrada.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <CircleHelp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Mais clareza no proximo passo</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Quando a recomendacao fizer sentido, o produto ajuda voce a sair da comparacao e entrar no estudo com mais objetividade.
              </p>
            </CardContent>
          </Card>
        </section>

        {!isPro ? (
          <Alert>
            <AlertTitle>O produto continua totalmente utilizavel no plano gratuito</AlertTitle>
            <AlertDescription>
              Dashboard, rankings, dados de mercado, salarios, tendencias, roadmaps e analise basica continuam disponiveis. O Pro entra como camada de aprofundamento para quem quer decidir com menos duvida, nao como bloqueio do essencial.
            </AlertDescription>
          </Alert>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Perguntas comuns</h2>
                <p className="text-sm leading-6 text-muted-foreground">Se voce ainda esta entendendo como o Dev Tech pode te ajudar, estas respostas deixam a proposta mais clara.</p>
              </div>
              <Accordion items={faqItems} />
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="space-y-4 p-6">
              <Badge tone="info">Quando faz sentido ir para o Pro</Badge>
              <h2 className="text-2xl font-semibold">Aprofunde a decisao antes de investir seu tempo</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Se voce quer comparar stacks com mais contexto, entender melhor as recomendacoes e sair com menos duvida sobre o que estudar, o DevTech Pro entra como essa camada extra de clareza.
              </p>
              <Button onClick={isPro ? onBackToDashboard : onGoToCheckout}>
                {isPro ? "Voltar ao dashboard Pro" : "Ver como funciona o Pro"}
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
