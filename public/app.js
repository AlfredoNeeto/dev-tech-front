const apiConfig = {
  baseUrl: "https://api.alfredonetodev.net"
};

const state = {
  status: null,
  filtersData: null,
  overview: null,
  selectedDetail: null,
  selectedStack: null,
  assistantOpen: false,
  assistantSending: false,
  activeView: "overview",
  filters: {
    goal: "balanced",
    period: "30",
    stack: "all",
    state: "all",
    seniority: "all",
    modality: "all",
    sort: "recommended",
    search: ""
  }
};

const roadmapLinks = {
  "C#": "https://roadmap.sh/aspnet-core",
  "ASP.NET Core": "https://roadmap.sh/aspnet-core",
  ".NET": "https://roadmap.sh/aspnet-core",
  "Java": "https://roadmap.sh/java",
  "Spring": "https://roadmap.sh/spring-boot",
  "Python": "https://roadmap.sh/python",
  "JavaScript": "https://roadmap.sh/javascript",
  "TypeScript": "https://roadmap.sh/typescript",
  "React": "https://roadmap.sh/react",
  "Angular": "https://roadmap.sh/angular",
  "Node.js": "https://roadmap.sh/nodejs",
  "PHP": "https://roadmap.sh/php",
  "Go": "https://roadmap.sh/golang",
  "Flutter": "https://roadmap.sh/flutter",
  "DevOps": "https://roadmap.sh/devops",
  "Docker": "https://roadmap.sh/docker",
  "SQL": "https://roadmap.sh/sql",
  "PostgreSQL": "https://roadmap.sh/postgresql-dba",
  "Frontend": "https://roadmap.sh/frontend",
  "Backend": "https://roadmap.sh/backend",
  "Full Stack": "https://roadmap.sh/full-stack"
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindEvents();
  await loadDashboard();
}

async function loadDashboard() {
  setLoading(true);

  try {
    state.status = await fetchJson("/api/dashboard/status");

    if (!state.status.hasData) {
      renderEmptyDataState();
      return;
    }

    state.filtersData = await fetchJson("/api/dashboard/filters");
    hydrateFilters(state.filtersData);
    await refreshOverview();
  } catch (error) {
    renderErrorState(error);
  } finally {
    setLoading(false);
  }
}

async function refreshOverview() {
  setLoading(true);

  try {
    const query = new URLSearchParams({
      goal: state.filters.goal,
      period: state.filters.period,
      state: state.filters.state,
      seniority: state.filters.seniority,
      modality: state.filters.modality,
      search: state.filters.search,
      sort: state.filters.sort
    });

    state.overview = await fetchJson(`/api/dashboard/overview?${query}`);

    if (state.filters.stack !== "all") {
      state.selectedStack = state.filters.stack;
    } else if (state.selectedStack && !state.overview.ranking.some((item) => item.stack === state.selectedStack)) {
      state.selectedStack = null;
    }

    state.selectedDetail = await loadSelectedStackDetail();
    renderDashboard();
  } catch (error) {
    renderErrorState(error);
  } finally {
    setLoading(false);
  }
}

async function loadSelectedStackDetail() {
  if (!state.selectedStack) return null;

  try {
    const query = new URLSearchParams({ period: state.filters.period });
    return await fetchJson(`/api/dashboard/stacks/${encodeURIComponent(state.selectedStack)}?${query}`);
  } catch {
    return null;
  }
}

async function fetchJson(path, options = {}) {
  const response = await fetch(`${apiConfig.baseUrl}${path}`, options);

  if (!response.ok) {
    throw new Error(`API retornou ${response.status} em ${path}`);
  }

  return await response.json();
}

function bindEvents() {
  document.querySelector("#filters").addEventListener("input", async (event) => {
    const target = event.target;
    if (!target.name) return;

    state.filters[target.name] = target.value;

    if (target.name === "stack") {
      state.selectedStack = target.value === "all" ? null : target.value;
    }

    await refreshOverview();
  });

  document.querySelector("#clearFilters").addEventListener("click", async () => {
    clearFilters();
    await refreshOverview();
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveView(button.dataset.view);
    });
  });

  bindAssistantEvents();
}

function bindAssistantEvents() {
  document.querySelector("#assistantToggle").addEventListener("click", () => {
    setAssistantOpen(!state.assistantOpen);
  });

  document.querySelector("#assistantClose").addEventListener("click", () => {
    setAssistantOpen(false);
  });

  document.querySelectorAll("[data-assistant-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#assistantInput").value = button.dataset.assistantPrompt;
      document.querySelector("#assistantInput").focus();
    });
  });

  document.querySelector("#assistantForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.querySelector("#assistantInput");
    const message = input.value.trim();
    if (!message || state.assistantSending) return;

    input.value = "";
    await sendAssistantMessage(message);
  });
}

function setAssistantOpen(isOpen) {
  state.assistantOpen = isOpen;
  const widget = document.querySelector("#assistantWidget");
  const panel = document.querySelector("#assistantPanel");
  const toggle = document.querySelector("#assistantToggle");

  widget.classList.toggle("open", isOpen);
  panel.setAttribute("aria-hidden", String(!isOpen));
  toggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    setTimeout(() => document.querySelector("#assistantInput").focus(), 80);
  }
}

async function sendAssistantMessage(message) {
  setAssistantOpen(true);
  appendAssistantMessage(message, "user");
  setAssistantSending(true);

  try {
    const response = await fetchJson("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context: buildAssistantContext()
      })
    });

    const answer = response.answer ?? response.message ?? response.content ?? "Nao recebi uma resposta do assistente.";
    appendAssistantMessage(answer, "system");
  } catch {
    appendAssistantMessage(
      "O assistente ainda nao esta disponivel. Crie o endpoint POST /api/assistant/chat na API para ativar esta conversa.",
      "error"
    );
  } finally {
    setAssistantSending(false);
  }
}

function appendAssistantMessage(text, type) {
  const messages = document.querySelector("#assistantMessages");
  const item = document.createElement("div");
  item.className = `assistant-message assistant-message-${type}`;
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function setAssistantSending(isSending) {
  state.assistantSending = isSending;
  const button = document.querySelector("#assistantSend");
  button.disabled = isSending;
  button.textContent = isSending ? "Enviando..." : "Enviar";
}

function buildAssistantContext() {
  const selected = getSelectedStack();
  const ranking = state.overview?.ranking?.slice(0, 5).map((item) => ({
    stack: item.stack,
    opportunityScore: item.opportunityScore,
    totalJobs: item.totalJobs,
    juniorPercent: item.juniorPercent,
    remotePercent: item.remotePercent,
    salaryMedian: item.salaryMedian,
    trendPercent: item.trendPercent
  })) ?? [];

  return {
    goal: state.filters.goal,
    goalLabel: getGoalText(),
    filters: { ...state.filters },
    recommendation: state.overview?.recommendation ?? null,
    summary: state.overview?.summary ?? null,
    selectedStack: selected ?? null,
    selectedDetail: state.selectedDetail ?? null,
    topRanking: ranking,
    dataSource: state.status?.dataSource ?? "Adzuna",
    lastGoldRun: state.status?.lastGoldRun ?? null,
    instruction: "Responda em portugues, use somente os dados enviados e diga quando faltar informacao."
  };
}

function hydrateFilters(filters) {
  fillSelect("#stackFilter", ["all", ...filters.stacks], "Todas");
  fillSelect("#stateFilter", ["all", ...filters.states], "Todos");

  const periods = filters.periods.length > 0 ? filters.periods : [7, 30];
  document.querySelector("#periodFilter").innerHTML = periods
    .map((period) => `<option value="${period}">${period} dias</option>`)
    .join("");

  if (!periods.includes(Number(state.filters.period))) {
    state.filters.period = String(periods.includes(30) ? 30 : periods[0]);
  }

  document.querySelector("#periodFilter").value = state.filters.period;
}

function fillSelect(selector, values, allLabel) {
  const select = document.querySelector(selector);
  select.innerHTML = values.map((value) => {
    const label = value === "all" ? allLabel : value;
    return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
  }).join("");
}

function renderDashboard() {
  const overview = state.overview;

  if (!overview || overview.ranking.length === 0) {
    renderNoResultState();
    return;
  }

  const selected = getSelectedStack();

  renderDataNotice();
  renderHeaderSummary(overview, selected);
  renderRecommendation(overview.recommendation);
  renderCards(overview.summary);
  renderRanking(overview.ranking, selected);
  renderStackAnalysis(selected);
  renderTrends(overview.ranking, selected);
  renderStudyRoadmap(selected);
  generateInsights(overview, selected);
}

function renderDataNotice() {
  const notice = document.querySelector("#dataNotice");
  const lastRun = state.status?.lastGoldRun ? formatDateTime(state.status.lastGoldRun) : "sem execucao registrada";
  notice.textContent = `Dados reais da API DevTech. Fonte: ${state.status?.dataSource ?? "Adzuna"}. Ultima Gold: ${lastRun}.`;
  notice.classList.add("connected");
}

function renderHeaderSummary(overview, selected) {
  document.querySelector("#headerStack").textContent = selected?.stack ?? "Todas";
  document.querySelector("#filterSummary").textContent =
    `${getGoalText()} com ${overview.totalStacks} ${overview.totalStacks === 1 ? "stack filtrada" : "stacks filtradas"} e ${formatNumber(overview.summary.recentJobs)} vagas recentes em ${overview.summary.period} dias.`;
}

function renderRecommendation(recommendation) {
  if (!recommendation) {
    document.querySelector("#recommendedStack").textContent = "Sem dados";
    document.querySelector("#opportunityScore").textContent = "0";
    document.querySelector("#opportunityMeter").style.width = "0%";
    document.querySelector("#mainInsight").textContent = "Nao ha dados suficientes para recomendar uma stack com os filtros atuais.";
    document.querySelector("#recommendationReason").textContent = "";
    document.querySelector("#decisionBox").innerHTML = "";
    return;
  }

  const hasFocusedStack = state.filters.stack !== "all" || Boolean(state.selectedStack);
  document.querySelector("#recommendedStack").textContent = recommendation.stack;
  document.querySelector("#opportunityScore").textContent = Math.round(recommendation.opportunityScore);
  document.querySelector("#opportunityMeter").style.width = `${Math.min(recommendation.opportunityScore, 100)}%`;
  document.querySelector("#mainInsight").textContent =
    `${recommendation.stack} e a stack recomendada para o objetivo selecionado: ${getGoalText().toLowerCase()}.`;
  document.querySelector("#recommendationReason").textContent = hasFocusedStack
    ? "Esta recomendacao considera a tecnologia em foco, os filtros e os dados reais da camada Gold."
    : "Esta recomendacao considera o objetivo, os filtros ativos e todas as stacks disponiveis no recorte atual.";
  document.querySelector("#decisionBox").innerHTML = `
    <div class="decision-group">
      <strong>Por que entrou na recomendacao</strong>
      <ul class="decision-list">
        ${recommendation.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
      </ul>
    </div>
    <p class="decision-alert">${escapeHtml(recommendation.warning)}</p>
  `;
}

function renderCards(summary) {
  const cards = [
    ["briefcase", "Total de vagas", formatNumber(summary.totalJobs), "Volume das stacks filtradas"],
    ["chart", "Stack mais demandada", summary.topDemandStack ?? "Sem dados", "Maior volume no recorte"],
    ["target", "Melhor escolha", summary.recommendedStack ?? "Sem dados", "Maior score para o objetivo"],
    ["salary", "Salario mediano", formatCurrency(summary.medianSalary), "Media ponderada por volume"],
    ["clock", "Vagas recentes", formatNumber(summary.recentJobs), `Novas vagas em ${summary.period} dias`],
    ["user", "Vagas junior", formatNumber(summary.juniorJobs), "Acesso inicial aproximado"]
  ];

  document.querySelector("#cards").innerHTML = cards.map(([icon, label, value, helper]) => `
    <article class="metric-card">
      <div class="metric-top">
        <span>${label}</span>
        <span class="card-icon" aria-hidden="true">${getIcon(icon)}</span>
      </div>
      <strong>${value}</strong>
      <small>${helper}</small>
    </article>
  `).join("");
}

function renderRanking(ranking, selected) {
  const visibleRanking = ranking.slice(0, 5);
  document.querySelector("#resultCount").textContent = `Top ${visibleRanking.length} de ${ranking.length}`;

  const target = document.querySelector("#ranking");
  target.innerHTML = visibleRanking.map((item, index) => `
    <button class="ranking-row ${selected?.stack === item.stack ? "active" : ""}" type="button" data-stack="${escapeHtml(item.stack)}">
      <span class="rank-number">${index + 1}</span>
      <span class="stack-name">
        <strong>${escapeHtml(item.stack)}</strong>
        <small>${escapeHtml(item.category)}</small>
      </span>
      <span class="bar-cell">
        <span class="bar-label"><span>Score</span><b>${Math.round(item.opportunityScore)}</b></span>
        <span class="bar-track"><span style="width:${Math.min(item.opportunityScore, 100)}%"></span></span>
      </span>
      <span class="data-cell"><strong>${formatNumber(item.totalJobs)}</strong> vagas</span>
      <span class="data-cell"><strong>${formatPercent(item.juniorPercent)}</strong> junior</span>
      <span class="data-cell hide-md"><strong>${formatPercent(item.remotePercent)}</strong> remoto</span>
      <span class="data-cell hide-md"><strong>${formatNumber(item.recentJobs)}</strong> recentes</span>
      <span class="trend-pill ${getTrendClass(item.trendPercent)}">${formatTrend(item.trendPercent)}</span>
    </button>
  `).join("");

  target.querySelectorAll("[data-stack]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.selectedStack = button.dataset.stack;
      document.querySelector("#stackFilter").value = state.selectedStack;
      state.filters.stack = state.selectedStack;
      setActiveView("detail");
      await refreshOverview();
    });
  });
}

function renderStackAnalysis(item) {
  const container = document.querySelector("#stackAnalysis");
  const title = document.querySelector("#stackTitle");
  const stackClass = document.querySelector("#stackClass");
  const detail = state.selectedDetail;

  if (!item) {
    title.textContent = "Analise";
    stackClass.textContent = "Sem dados";
    stackClass.className = "status-pill";
    container.innerHTML = `<div class="empty-state">Selecione uma stack para ver a analise.</div>`;
    return;
  }

  title.textContent = item.stack;
  const classification = classifyStack(item);
  stackClass.textContent = classification.label;
  stackClass.className = `status-pill ${classification.className}`;

  const p25 = salaryPosition(item.salaryP25);
  const p50 = salaryPosition(item.salaryMedian);
  const p75 = salaryPosition(item.salaryP75);
  const stateRows = detail?.states?.slice(0, 4) ?? [];
  const companyRows = detail?.companies?.slice(0, 4) ?? [];
  const seniorityRows = detail?.seniority?.slice(0, 3) ?? [];

  container.innerHTML = `
    <div class="stack-analysis-grid">
      ${analysisItem("Total de vagas", formatNumber(item.totalJobs))}
      ${analysisItem("Empresa lider", item.topCompany ?? "Nao informado")}
      ${analysisItem("Estado lider", item.topState ?? "Nao informado")}
      ${analysisItem("Remoto", formatPercent(item.remotePercent))}
      ${analysisItem("Junior", formatPercent(item.juniorPercent))}
      ${analysisItem("Cobertura salarial", formatPercent(item.salaryCoveragePercent))}
    </div>

    <div class="salary-range">
      <h3>Faixa salarial informada</h3>
      <div class="range-scale" aria-hidden="true">
        <span class="range-fill" style="left:${p25}%; width:${Math.max(p75 - p25, 4)}%"></span>
        <span class="range-dot" style="left:${p50}%"></span>
      </div>
      <div class="range-labels">
        <span>P25 ${formatCurrency(item.salaryP25)}</span>
        <span>P50 ${formatCurrency(item.salaryMedian)}</span>
        <span>P75 ${formatCurrency(item.salaryP75)}</span>
      </div>
    </div>

    <p class="stack-verdict">${generateStackVerdict(item)}</p>

    <div class="stack-analysis-grid">
      ${analysisList("Estados com mais vagas", stateRows, "state")}
      ${analysisList("Empresas em destaque", companyRows, "company")}
      ${analysisList("Senioridade", seniorityRows, "seniority")}
    </div>
  `;
}

function renderTrends(ranking, selected) {
  const target = document.querySelector("#trends");
  const source = ranking.length > 0 ? ranking : [];

  if (!source.length) {
    target.innerHTML = `<div class="empty-state">Sem tendencia disponivel para os filtros atuais.</div>`;
    return;
  }

  const rising = [...source].sort((a, b) => b.trendPercent - a.trendPercent).slice(0, 3);
  const falling = [...source].sort((a, b) => a.trendPercent - b.trendPercent).slice(0, 3);
  const chart = selected
    ? renderSimpleSparkline(selected)
    : `<div class="empty-state">Selecione uma tecnologia em foco para ver o historico detalhado de snapshots.</div>`;

  target.innerHTML = `
    <div class="trend-layout">
      ${chart}
      <div class="trend-columns">
        <div>
          <h3>Em alta</h3>
          <div class="trend-list">${rising.map(renderTrendItem).join("")}</div>
        </div>
        <div>
          <h3>Em queda</h3>
          <div class="trend-list">${falling.map(renderTrendItem).join("")}</div>
        </div>
      </div>
    </div>
  `;
}

function renderSimpleSparkline(item) {
  const trend = state.selectedDetail?.trend ?? [];

  if (trend.length > 1) {
    return renderDetailSparkline(item, trend);
  }

  const values = [
    Math.max(0, item.totalJobs - item.recentJobs),
    item.totalJobs
  ];
  const width = 520;
  const height = 96;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 18) - 9;
    return [x, y];
  });
  const path = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];

  return `
    <div>
      <h3>${escapeHtml(item.stack)}: sinal de evolucao no periodo</h3>
      <svg class="sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="Sinal de evolucao para ${escapeHtml(item.stack)}">
        <path d="${path}"></path>
        <circle cx="${last[0]}" cy="${last[1]}" r="5"></circle>
      </svg>
    </div>
  `;
}

function renderDetailSparkline(item, trend) {
  const values = trend.map((point) => point.totalJobs);
  const width = 520;
  const height = 96;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 18) - 9;
    return [x, y];
  });
  const path = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];

  return `
    <div>
      <h3>${escapeHtml(item.stack)}: historico real das snapshots Gold</h3>
      <svg class="sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="Historico de vagas para ${escapeHtml(item.stack)}">
        <path d="${path}"></path>
        <circle cx="${last[0]}" cy="${last[1]}" r="5"></circle>
      </svg>
    </div>
  `;
}

function renderStudyRoadmap(item) {
  const roadmap = document.querySelector("#roadmap");
  const source = document.querySelector("#roadmapSource");
  document.querySelector("#roadmapTitle").textContent = item ? `Trilha para ${item.stack}` : "O que estudar depois";

  if (!item) {
    source.innerHTML = `
      <p><strong>DevTech</strong> usa dados reais de mercado para indicar caminhos. Selecione uma stack para abrir uma referencia externa de estudos.</p>
      <a class="roadmap-link" href="https://roadmap.sh" target="_blank" rel="noopener noreferrer">Abrir roadmap.sh</a>
    `;
    roadmap.innerHTML = `<li>Selecione uma stack para ver sugestoes de estudo.</li>`;
    return;
  }

  const roadmapUrl = getRoadmapShUrl(item.stack);
  const steps = getStudySteps(item.stack);
  source.innerHTML = `
    <p><strong>Decisao pelos dados, estudo pela trilha.</strong> Com base nos dados do mercado, esta stack aparece como uma boa opcao para seu momento. Use o roadmap.sh como guia complementar para organizar seus estudos e avancar passo a passo.</p>
    <a class="roadmap-link" href="${roadmapUrl}" target="_blank" rel="noopener noreferrer">Abrir trilha no roadmap.sh</a>
  `;
  roadmap.innerHTML = steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
}

function generateInsights(overview, selected) {
  const narrative = document.querySelector("#narrativeInsight");
  const quick = document.querySelector("#quickInsights");

  if (!selected) {
    narrative.textContent = "Sem dados suficientes para gerar uma leitura confiavel.";
    quick.innerHTML = "";
    return;
  }

  const salaryWarning = selected.salaryCoveragePercent < 35
    ? "Poucas vagas informam salario. Use os valores como referencia."
    : "A cobertura salarial esta razoavel para comparar faixas.";

  narrative.textContent =
    `${selected.stack} tem ${formatNumber(selected.totalJobs)} vagas no recorte atual. ${generateStackVerdict(selected)} ${salaryWarning}`;

  quick.innerHTML = [
    ["user", "Primeira vaga", beginnerInsight(selected)],
    ["remote", "Remoto", `A stack tem ${formatPercent(selected.remotePercent)} de sinal remoto.`],
    ["clock", "Periodo", `${selected.stack} soma ${formatNumber(selected.recentJobs)} vagas recentes em ${overview.summary.period} dias.`]
  ].map(([icon, title, text]) => `
    <div class="mini-insight">
      <header>
        <span class="mini-icon" aria-hidden="true">${getIcon(icon)}</span>
        <strong>${title}</strong>
      </header>
      <span>${text}</span>
    </div>
  `).join("");
}

function renderEmptyDataState() {
  renderDataNoticeEmpty("Ainda nao existem dados processados. Execute a pipeline Bronze, Silver e Gold.");
  clearContent("Sem dados disponiveis");
}

function renderNoResultState() {
  clearContent("Nenhuma stack corresponde aos filtros atuais.");
}

function renderErrorState(error) {
  renderDataNoticeEmpty("Nao foi possivel carregar dados reais da API.");
  clearContent(error.message);
}

function clearContent(message) {
  document.querySelector("#headerStack").textContent = "Sem dados";
  document.querySelector("#filterSummary").textContent = message;
  document.querySelector("#recommendedStack").textContent = "Sem dados";
  document.querySelector("#opportunityScore").textContent = "0";
  document.querySelector("#opportunityMeter").style.width = "0%";
  document.querySelector("#mainInsight").textContent = message;
  document.querySelector("#recommendationReason").textContent = "";
  document.querySelector("#decisionBox").innerHTML = "";
  document.querySelector("#cards").innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  document.querySelector("#ranking").innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  document.querySelector("#stackAnalysis").innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  document.querySelector("#trends").innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  document.querySelector("#roadmapSource").innerHTML = "";
  document.querySelector("#roadmap").innerHTML = "";
  document.querySelector("#resultCount").textContent = "0 stacks";
}

function renderDataNoticeEmpty(message) {
  const notice = document.querySelector("#dataNotice");
  notice.textContent = message;
  notice.classList.remove("connected");
}

function setLoading(isLoading) {
  document.body.classList.toggle("is-loading", isLoading);
}

function setActiveView(view) {
  state.activeView = view;

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.viewPanel === view);
  });
}

function clearFilters() {
  state.filters = {
    goal: "balanced",
    period: "30",
    stack: "all",
    state: "all",
    seniority: "all",
    modality: "all",
    sort: "recommended",
    search: ""
  };
  state.selectedStack = null;
  document.querySelector("#filters").reset();
  document.querySelector("#goalFilter").value = state.filters.goal;
  document.querySelector("#periodFilter").value = state.filters.period;
  document.querySelector("#stackFilter").value = state.filters.stack;
  document.querySelector("#stateFilter").value = state.filters.state;
  document.querySelector("#seniorityFilter").value = state.filters.seniority;
  document.querySelector("#modalityFilter").value = state.filters.modality;
  document.querySelector("#sortFilter").value = state.filters.sort;
}

function getSelectedStack() {
  return state.overview?.ranking.find((item) => item.stack === state.selectedStack) ?? null;
}

function classifyStack(item) {
  if (item.opportunityScore >= 72 && item.juniorPercent >= 18) return { label: "Boa para comecar", className: "good" };
  if ((item.salaryMedian ?? 0) >= 11000 && item.juniorPercent < 14) return { label: "Mais competitiva", className: "warn" };
  if (item.trendPercent < -5) return { label: "Em atencao", className: "risk" };
  return { label: "Equilibrada", className: "warn" };
}

function generateStackVerdict(item) {
  if (item.juniorPercent >= 24) {
    return `Vale a pena estudar ${item.stack} se seu objetivo e buscar a primeira vaga.`;
  }
  if (item.remotePercent >= 50) {
    return `Vale a pena estudar ${item.stack} se seu objetivo e buscar oportunidades remotas.`;
  }
  if ((item.salaryMedian ?? 0) >= 11000) {
    return `Vale a pena estudar ${item.stack} se seu objetivo e salario, mas a entrada tende a exigir mais experiencia.`;
  }
  return `Vale a pena estudar ${item.stack} se ela combina com seu plano de carreira e voce pretende construir portfolio consistente.`;
}

function beginnerInsight(item) {
  if (item.juniorPercent >= 24) return `${item.stack} parece mais amigavel para iniciantes dentro do recorte filtrado.`;
  if (item.juniorPercent >= 16) return `${item.stack} tem entrada possivel, mas portfolio ajuda a competir melhor.`;
  return `${item.stack} parece mais competitiva para iniciantes e pode exigir base previa maior.`;
}

function renderTrendItem(item) {
  return `
    <div class="trend-item">
      <strong>${escapeHtml(item.stack)}</strong>
      <span class="trend-pill ${getTrendClass(item.trendPercent)}">${formatTrend(item.trendPercent)}</span>
    </div>
  `;
}

function analysisItem(label, value) {
  return `<div class="analysis-item"><span>${label}</span><strong>${value}</strong></div>`;
}

function analysisList(title, rows, type) {
  if (!rows.length) {
    return `<div class="analysis-item"><span>${title}</span><strong>Nao informado</strong></div>`;
  }

  const content = rows.map((row) => {
    const label = type === "seniority" ? row.level : type === "state" ? row.state : row.company;
    const value = type === "seniority" ? `${formatPercent(row.percent)} (${formatNumber(row.jobs)})` : formatNumber(row.jobs);
    return `<li><span>${escapeHtml(label)}</span><b>${value}</b></li>`;
  }).join("");

  return `<div class="analysis-item analysis-list"><span>${title}</span><ul>${content}</ul></div>`;
}

function salaryPosition(value) {
  return Math.max(0, Math.min(100, ((value ?? 0) / 18000) * 100));
}

function getTrendClass(value) {
  if (value > 4) return "up";
  if (value < -4) return "down";
  return "flat";
}

function getGoalText() {
  const labels = {
    balanced: "Melhor equilibrio",
    firstJob: "Primeira vaga",
    remote: "Trabalho remoto",
    salary: "Melhor salario",
    demand: "Mais vagas",
    growth: "Mercado aquecido"
  };

  return labels[state.filters.goal] ?? labels.balanced;
}

function getRoadmapShUrl(stack) {
  return roadmapLinks[stack] ?? "https://roadmap.sh";
}

function getStudySteps(stack) {
  return [
    "Revisar fundamentos de programacao",
    `Estudar a base de ${stack}`,
    "Praticar Git, terminal e organizacao de projetos",
    "Construir uma API ou aplicacao pequena",
    "Persistir dados com SQL",
    "Adicionar testes e validacoes",
    "Criar um projeto de portfolio",
    "Publicar o projeto e documentar decisoes"
  ];
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(value ?? 0);
}

function formatPercent(value) {
  return `${Math.round(value ?? 0)}%`;
}

function formatTrend(value) {
  const rounded = Math.round(value ?? 0);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getIcon(name) {
  const icons = {
    briefcase: '<svg viewBox="0 0 24 24"><path d="M9 4h6a2 2 0 0 1 2 2v2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2Zm0 4h6V6H9v2Zm-5 4v6h16v-6h-5v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1H4Z"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M4 19h16v2H2V3h2v16Zm3-2V9h3v8H7Zm5 0V5h3v12h-3Zm5 0v-6h3v6h-3Z"/></svg>',
    target: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2Zm0 5a5 5 0 1 0 5 5h-2a3 3 0 1 1-3-3V7Zm8.6-3.6-3.1.6.6-3.1 1.5 1.5 2.5-2.4 1.4 1.4-2.4 2.5 1.5 1.5Z"/></svg>',
    salary: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15.8V20h-2v-2.1a5.3 5.3 0 0 1-3-1.3l1.1-1.7a4 4 0 0 0 2.8 1.1c1.1 0 1.8-.4 1.8-1.2s-.6-1-2.1-1.4C9.5 12.9 8.3 12 8.3 10.2c0-1.6 1.1-2.8 2.7-3.1V4.8h2v2.3a5 5 0 0 1 2.6 1l-1 1.7a3.7 3.7 0 0 0-2.4-.8c-1 0-1.6.4-1.6 1.1s.6.9 2 1.3c2.3.6 3.4 1.5 3.4 3.3 0 1.6-1.1 2.8-3 3.1Z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 11h5v-2h-4V6h-2v7h1Z"/></svg>',
    user: '<svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/></svg>',
    remote: '<svg viewBox="0 0 24 24"><path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6v2h3v2H7v-2h3v-2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v9h16V7H4Zm4.5 6.5 1.4-1.4a3 3 0 0 1 4.2 0l1.4 1.4 1.4-1.4-1.4-1.4a5 5 0 0 0-7 0l-1.4 1.4 1.4 1.4Z"/></svg>'
  };

  return icons[name] ?? icons.chart;
}
