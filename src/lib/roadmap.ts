export interface RoadmapEntry {
  slug: string;
  title: string;
  summary: string;
}

const roadmapCatalog: Array<RoadmapEntry & { matches: string[] }> = [
  {
    slug: "backend",
    title: "Backend",
    summary: "Bom para quem quer construir APIs, regras de negocio e integracoes.",
    matches: ["java", "spring boot", "node", "nodejs", "expressjs", "nestjs", "fastapi"],
  },
  {
    slug: "react",
    title: "React",
    summary: "Ajuda quem quer entrar pelo frontend moderno e criar interfaces web.",
    matches: ["react"],
  },
  {
    slug: "frontend",
    title: "Frontend",
    summary: "Mostra a base de HTML, CSS, JavaScript e construcao de interfaces.",
    matches: ["javascript", "typescript", "html", "css", "tailwind css", "svelte"],
  },
  {
    slug: "next",
    title: "Next.js",
    summary: "Bom para quem quer trabalhar com React em produtos completos.",
    matches: ["nextjs"],
  },
  {
    slug: "angular",
    title: "Angular",
    summary: "Indicado para quem busca produtos corporativos e times maiores.",
    matches: ["angular"],
  },
  {
    slug: "vue",
    title: "Vue",
    summary: "Uma rota de frontend com curva suave e boa organizacao.",
    matches: ["vuejs"],
  },
  {
    slug: "python",
    title: "Python",
    summary: "Ajuda a entrar em automacao, backend e trilhas de dados com a mesma base.",
    matches: ["python", "django", "flask"],
  },
  {
    slug: "java",
    title: "Java",
    summary: "Uma trilha forte para backend, sistemas corporativos e carreira de longo prazo.",
    matches: ["java"],
  },
  {
    slug: "php",
    title: "PHP",
    summary: "Uma rota pratica para web, manutencao de sistemas e backends consolidados.",
    matches: ["php", "laravel"],
  },
  {
    slug: "golang",
    title: "Go",
    summary: "Boa opcao para backend, performance e plataformas de infraestrutura.",
    matches: ["go"],
  },
  {
    slug: "rust",
    title: "Rust",
    summary: "Uma rota mais tecnica para performance, sistemas e seguranca.",
    matches: ["rust"],
  },
  {
    slug: "devops",
    title: "DevOps",
    summary: "Ajuda a entender deploy, infraestrutura e operacao de software.",
    matches: ["devops", "docker", "kubernetes", "terraform", "aws", "azure", "google cloud"],
  },
  {
    slug: "sql",
    title: "SQL",
    summary: "Base importante para dados, analise e produtos orientados por banco.",
    matches: ["sql", "mysql", "sql server"],
  },
  {
    slug: "postgresql-dba",
    title: "PostgreSQL",
    summary: "Foca em banco relacional, consultas e administracao de dados.",
    matches: ["postgresql"],
  },
  {
    slug: "mongodb",
    title: "MongoDB",
    summary: "Mostra como trabalhar com dados nao relacionais em produtos modernos.",
    matches: ["mongodb"],
  },
  {
    slug: "redis",
    title: "Redis",
    summary: "Boa extensao para cache, filas e ganho de performance em backend.",
    matches: ["redis"],
  },
  {
    slug: "qa",
    title: "QA",
    summary: "Uma porta de entrada pela qualidade, testes e automacao.",
    matches: ["qa", "cypress", "playwright", "selenium"],
  },
  {
    slug: "android",
    title: "Android",
    summary: "Caminho focado em apps nativos para Android.",
    matches: ["android", "kotlin"],
  },
  {
    slug: "ios",
    title: "iOS",
    summary: "Caminho focado em apps nativos para ecossistema Apple.",
    matches: ["ios", "swift"],
  },
  {
    slug: "flutter",
    title: "Flutter",
    summary: "Boa opcao para quem quer criar apps mobile com uma base unica.",
    matches: ["flutter"],
  },
  {
    slug: "react-native",
    title: "React Native",
    summary: "Liga a base de React ao desenvolvimento mobile.",
    matches: ["react native"],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    summary: "Uma trilha para seguranca, resposta a incidentes e protecao de sistemas.",
    matches: ["cybersecurity", "seguranca da informacao"],
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    summary: "Ajuda quem quer entrar em analise, BI e leitura de dados de negocio.",
    matches: ["data science", "data engineering", "engenharia de dados", "power bi", "tableau"],
  },
];

function normalizeStackKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.\-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function getRoadmap(stack: string) {
  const key = normalizeStackKey(stack);
  return roadmapCatalog.find((entry) => entry.matches.includes(key)) ?? null;
}

export function getRoadmapUrl(stack: string) {
  const roadmap = getRoadmap(stack);
  return roadmap ? `https://roadmap.sh/${roadmap.slug}` : "https://roadmap.sh";
}
