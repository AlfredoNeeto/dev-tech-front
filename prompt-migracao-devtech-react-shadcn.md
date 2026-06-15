# Prompt para Migração do Front-end DevTech BI para React + shadcn/ui

## Contexto do projeto

Você irá atuar como um arquiteto front-end especialista em React, TypeScript, Tailwind CSS, shadcn/ui, dashboards interativos e integração com APIs REST.

O projeto atual é o front-end do **DevTech BI**, uma aplicação criada inicialmente com **HTML, CSS e JavaScript puro**.

O DevTech BI é uma plataforma de Business Intelligence voltada para pessoas que estão iniciando na área de tecnologia ou em transição de carreira. O objetivo da aplicação é ajudar o usuário a entender o mercado de tecnologia, descobrir quais stacks estudar, visualizar oportunidades, salários, tendências, demanda por tecnologias e caminhos de aprendizado.

A aplicação atual deve ser migrada para uma arquitetura moderna usando:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts ou ECharts para gráficos
- TanStack Query para consumo e cache da API
- Zod para validação de contratos quando necessário

## Objetivo principal

Migrar toda a aplicação existente em HTML, CSS e JavaScript para uma nova aplicação React, mantendo a identidade visual e a proposta do DevTech BI, mas melhorando a organização, escalabilidade, componentização, manutenção e experiência do usuário.

A migração deve transformar o front-end atual em uma aplicação moderna, modular, responsiva e preparada para consumir a API do DevTech.

## Regras importantes

Não faça apenas uma conversão literal de HTML para JSX.

Aproveite a migração para melhorar a arquitetura do projeto, separar responsabilidades, criar componentes reutilizáveis e organizar o código por domínio/funcionalidade.

Use shadcn/ui como base visual para componentes como:

- Cards
- Buttons
- Tabs
- Selects
- Inputs
- Dialogs
- Badges
- Tables
- Dropdowns
- Skeletons
- Toasts
- Sidebars ou Navigation Menu, se fizer sentido

Use Tailwind CSS para estilização.

Evite CSS global excessivo. Use classes utilitárias do Tailwind e componentes bem definidos.

Mantenha o visual moderno, minimalista, escuro e com uma paleta baseada em tons de azul, evitando aparência genérica.

## Stack desejada

Configure o projeto com:

```txt
React + TypeScript
Vite
Tailwind CSS
shadcn/ui
TanStack Query
Recharts ou ECharts
Zod
Lucide React
```

## Estrutura sugerida de pastas

Organize o projeto de forma clara e escalável:

```txt
src/
  app/
    App.tsx
    providers.tsx
  components/
    ui/
    layout/
    cards/
    charts/
    filters/
    empty-state/
    loading/
  features/
    dashboard/
    stacks/
    salaries/
    opportunities/
    trends/
    beginner/
  services/
    api.ts
    endpoints.ts
  hooks/
  lib/
    utils.ts
  types/
    api.ts
    dashboard.ts
  pages/
    DashboardPage.tsx
  styles/
    globals.css
```

## Funcionalidades esperadas no dashboard

A aplicação deve responder visualmente às principais perguntas do DevTech BI:

1. Qual tecnologia oferece a melhor chance para conseguir o primeiro emprego?
2. O que devo estudar agora?
3. Vale a pena estudar determinada stack?
4. Quanto o mercado está pagando?
5. O mercado está crescendo ou diminuindo?
6. Onde estão as oportunidades?
7. Quais empresas mais contratam determinada stack?
8. Essa stack é amigável para iniciantes?
9. Quais stacks possuem mais vagas remotas?
10. Quais stacks têm melhor equilíbrio entre salário e oportunidade?
11. Quais stacks estão perdendo demanda?

## Páginas ou seções desejadas

Crie ou reorganize o front-end com as seguintes seções:

### 1. Visão Geral

Deve exibir cards principais com:

- Total de vagas analisadas
- Stack mais promissora
- Melhor stack para iniciantes
- Média salarial geral
- Percentual de vagas remotas
- Tendência geral do mercado

### 2. Ranking de Stacks

Tabela ou cards ranqueados por:

- Demanda
- Quantidade de vagas
- Salário mediano
- Percentual de vagas júnior
- Percentual de vagas remotas
- Score de oportunidade

### 3. Explorer de Stack

Área onde o usuário escolhe uma stack e visualiza:

- Senioridade
- Faixa salarial
- Estados com mais oportunidades
- Empresas que mais contratam
- Tipo de contrato
- Modalidade: remoto, híbrido ou presencial
- Sugestão de estudo

### 4. Para Iniciantes

Ranking específico para quem busca o primeiro emprego, considerando:

- Mais vagas júnior
- Menor exigência de senioridade
- Boa demanda
- Salário razoável
- Maior quantidade de vagas remotas

### 5. Mapa de Oportunidades

Exibir distribuição por:

- Estado
- Cidade, se houver dados
- Modalidade de trabalho
- Stack

### 6. Salários

Exibir:

- Mediana salarial
- P25
- P75
- Faixas salariais
- Comparação entre stacks
- Salários por senioridade

### 7. Tendências

Exibir evolução histórica por stack, considerando snapshots ou dados históricos disponíveis na API:

- Crescimento de demanda
- Queda de demanda
- Stacks emergentes
- Stacks em perda de relevância

## Integração com API

Crie uma camada de serviço para chamadas HTTP.

Não espalhe `fetch` ou `axios` diretamente pelos componentes.

Centralize as chamadas em arquivos como:

```txt
services/api.ts
services/endpoints.ts
```

Use TanStack Query para buscar, armazenar em cache e atualizar os dados.

Exemplo esperado de organização:

```ts
useDashboardSummary()
useStackRanking()
useStackDetails(stackId)
useSalaryInsights()
useOpportunityMap()
useMarketTrends()
```

Caso os endpoints reais ainda não existam, crie mocks temporários bem organizados e deixe claro onde substituir pela API real.

## Componentização esperada

Crie componentes reutilizáveis, como:

```txt
MetricCard
RankingCard
StackSelector
StackScoreBadge
SalaryChart
TrendChart
OpportunityTable
RemoteWorkBadge
BeginnerFriendlyBadge
DashboardFilterBar
LoadingSkeleton
EmptyState
ErrorState
```

Cada componente deve ter responsabilidade clara.

Evite componentes gigantes com múltiplas responsabilidades.

## UX e UI

A interface deve ser pensada para pessoas que estão tentando tomar decisões de carreira.

Portanto, os dados não devem ser apresentados apenas como números frios. Sempre que possível, traduza os dados em mensagens úteis, como:

- “Boa stack para começar”
- “Alta demanda, mas poucas vagas júnior”
- “Salário atrativo, porém mercado mais competitivo”
- “Boa opção para trabalho remoto”
- “Stack em crescimento nos últimos meses”

Use cards, badges, gráficos e textos curtos para tornar a leitura simples.

## Responsividade

A aplicação deve funcionar bem em:

- Desktop
- Notebook
- Tablet
- Mobile

Use layout responsivo com Tailwind.

Evite tabelas quebradas no mobile. Quando necessário, use cards no mobile e tabela no desktop.

## Qualidade de código

Siga boas práticas:

- TypeScript com tipos claros
- Componentes pequenos
- Separação entre UI, regra de apresentação e acesso a dados
- Evitar duplicação
- Evitar lógica complexa diretamente no JSX
- Criar funções utilitárias quando necessário
- Usar nomes claros e sem abreviações desnecessárias

## Acessibilidade

Garanta:

- Contraste adequado
- Navegação por teclado
- Labels em inputs e selects
- Textos alternativos quando necessário
- Componentes shadcn/ui configurados corretamente

## Tema visual

Use tema escuro como padrão.

A paleta deve seguir uma aparência moderna baseada em:

- Fundo escuro
- Azul como cor principal
- Cinza para superfícies e bordas
- Verde para indicadores positivos
- Amarelo ou laranja para alertas
- Vermelho para queda ou risco

Evite roxo como cor principal.

## Entregáveis esperados

Ao finalizar, entregue:

1. Nova estrutura do projeto React
2. Componentes migrados e melhorados
3. Configuração do Tailwind CSS
4. Configuração do shadcn/ui
5. Camada de serviços para API
6. Hooks com TanStack Query
7. Componentes de gráficos
8. Layout responsivo
9. Estados de loading, erro e vazio
10. Código limpo, organizado e pronto para evolução

## Critérios de aceite

A migração será considerada concluída quando:

- A aplicação rodar com `npm run dev`
- O layout principal estiver implementado em React
- Os principais blocos da aplicação antiga estiverem migrados
- O código estiver dividido em componentes reutilizáveis
- O Tailwind estiver configurado corretamente
- O shadcn/ui estiver instalado e sendo usado nos componentes principais
- A aplicação estiver preparada para consumir a API real do DevTech
- O visual estiver coerente com um dashboard moderno e profissional
- O projeto estiver fácil de manter e evoluir

## Instrução final

Antes de alterar o código, analise a estrutura atual da aplicação em HTML, CSS e JavaScript.

Depois, proponha rapidamente o plano de migração e execute a migração de forma incremental.

Preserve o que fizer sentido da aplicação atual, mas refatore tudo que estiver dificultando manutenção, escalabilidade ou integração com API.
