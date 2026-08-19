"use client";

import { useMemo, useRef, useState } from "react";

const brandLogos = [
  {
    name: "PET-Saúde",
    src: "/brand/pet-saude.png",
    alt: "Logo do PET-Saúde Informação e Saúde Digital",
    className: "pet-logo",
  },
  {
    name: "UCDB",
    src: "/brand/ucdb.jpg",
    alt: "Logo da Universidade Católica Dom Bosco",
    className: "ucdb-logo",
  },
  {
    name: "SUS",
    src: "/brand/sus-stack.svg",
    alt: "Logo do Sistema Único de Saúde",
    className: "sus-logo",
  },
  {
    name: "SESAU",
    src: "/brand/sesau.png",
    alt: "Logo da Secretaria Municipal de Saúde de Campo Grande",
    className: "sesau-logo",
  },
];

const guidePages = Array.from({ length: 7 }, (_, index) => ({
  page: index + 1,
  src: `/guide/guide-spread-${String(index + 1).padStart(2, "0")}.jpg`,
  alt: `Lâmina horizontal ${index + 1} do guia de bolso do e-TET`,
}));

const appScreens = [
  {
    label: "Acesso",
    title: "Login do ACS",
    kind: "login",
    text: "Entrada por CPF e senha, seguindo a identidade do e-ACS Território Eletrônico.",
  },
  {
    label: "Território",
    title: "Domicílios",
    kind: "households",
    text: "Lista territorial com busca, domicílios, moradores e status de sincronização.",
  },
  {
    label: "Cadastro",
    title: "Novo domicílio",
    kind: "householdForm",
    text: "Formulário em etapas para endereço, moradia e infraestrutura.",
  },
  {
    label: "Sentinelas",
    title: "Estratificação",
    kind: "riskForm",
    text: "Registro guiado das sentinelas de risco familiar.",
  },
  {
    label: "Risco",
    title: "Resultado",
    kind: "riskResult",
    text: "Pontuação consolidada para apoiar a priorização da equipe.",
  },
];

const flowSteps = [
  {
    label: "Entrar",
    title: "Acesso identificado",
    description:
      "O ACS acessa o e-ACS por CPF e senha para iniciar a rotina de trabalho no território.",
    screenIndex: 0,
  },
  {
    label: "Localizar",
    title: "Domicílio e família",
    description:
      "A equipe localiza o domicílio, verifica famílias residentes e confere se há registros pendentes.",
    screenIndex: 1,
  },
  {
    label: "Cadastrar",
    title: "Dados estruturados",
    description:
      "Endereço, moradia, infraestrutura, responsável familiar e membros são preenchidos em etapas.",
    screenIndex: 2,
  },
  {
    label: "Estratificar",
    title: "Sentinelas de risco",
    description:
      "O profissional informa os fatores de risco da família em um formulário guiado.",
    screenIndex: 3,
  },
  {
    label: "Priorizar",
    title: "Pontuação e decisão",
    description:
      "O resultado orienta a priorização das visitas e a discussão pela equipe de APS.",
    screenIndex: 4,
  },
];

const currentFlow = [
  "Acesso a pastas por distrito e USF",
  "Abertura de formulário específico da unidade",
  "Seleção manual de equipe e microárea",
  "Preenchimento de endereço e sentinelas",
  "Consolidação posterior em planilha",
  "Leitura dos indicadores para planejar a prioridade",
];

const eTetFlow = [
  "Território organizado dentro do aplicativo",
  "Domicílio e família conectados ao mesmo fluxo",
  "Equipe e microárea vinculadas ao registro",
  "Sentinelas preenchidas em tela própria",
  "Pontuação e classificação calculadas automaticamente",
  "Resultado disponível para decisão da equipe",
];

const pitchPoints = [
  {
    title: "O problema fica visível",
    text: "O fluxo atual da coleta ainda depende de muitos passos, acessos e consolidações manuais.",
  },
  {
    title: "A mudança fica concreta",
    text: "O e-TET apresenta uma forma de levar o cálculo para dentro de uma jornada guiada, próxima da rotina do ACS.",
  },
  {
    title: "A demonstração torna a proposta compreensível",
    text: "Mostrar o aplicativo em uso facilita entender por que automatizar pontuação, classificação e organização territorial pode reduzir retrabalho.",
  },
];

const demoVideos = [
  {
    title: "Demonstração do e-TET",
    src: "/screens/video/canva-demonstracao.mp4",
    text: "Demonstração do aplicativo e-TET em uso.",
  },
];

const sentinelOptions = [
  { id: "bedridden", label: "Pessoa acamada", points: 3 },
  { id: "disability", label: "Deficiencia fisica ou mental", points: 3 },
  { id: "sanitation", label: "Baixas condicoes de saneamento", points: 3 },
  { id: "malnutrition", label: "Desnutricao grave", points: 3 },
  { id: "crowding", label: "Mais moradores que comodos", points: 3 },
  { id: "drug", label: "Drogadicao", points: 2 },
  { id: "unemployed", label: "Desemprego", points: 2 },
  { id: "illiteracy", label: "Analfabetismo", points: 1 },
  { id: "baby", label: "Crianca com menos de 6 meses", points: 1 },
  { id: "elderly", label: "Pessoa com mais de 70 anos", points: 1 },
  { id: "hypertension", label: "Hipertensao arterial", points: 1 },
  { id: "diabetes", label: "Diabetes mellitus", points: 1 },
];

function classifyRisk(score: number) {
  if (score >= 9) return { level: "R3", label: "risco máximo", tone: "high" };
  if (score >= 7) return { level: "R2", label: "risco médio", tone: "medium" };
  if (score >= 5) return { level: "R1", label: "risco menor", tone: "low" };
  return { level: "R0", label: "sem risco familiar registrado", tone: "base" };
}

function PhoneScreen({ kind }: { kind: string }) {
  if (kind === "login") {
    return (
      <div className="app-view login-view">
        <div className="login-cover">
          <div className="app-icon">e</div>
          <strong>e-ACS</strong>
          <span>Território Eletrônico</span>
        </div>
        <div className="form-sheet">
          <div className="visual-label">
            CPF
            <span className="input-line">000.000.000-00</span>
          </div>
          <div className="visual-label">
            Senha
            <span className="input-line">Digite sua senha</span>
          </div>
          <button type="button">Entrar</button>
          <small>Versao 1.0.0</small>
        </div>
      </div>
    );
  }

  if (kind === "households") {
    return (
      <div className="app-view">
        <div className="app-bar">
          <span className="hamburger" />
          <strong>Domicílios</strong>
        </div>
        <div className="app-content">
          <p className="muted-line">3 domicílios cadastrados</p>
          <div className="search-pill">Buscar por endereço ou bairro...</div>
          {[
            ["Rua da Esperanca, 100", "Jardim Primavera", "5 moradores"],
            ["Rua da Beira Rio, S/N", "Periferia Norte", "6 moradores"],
            ["Avenida das Nacoes, 1500", "Centro Historico", "4 moradores"],
          ].map(([street, district, residents]) => (
            <article className="home-card" key={street}>
              <span className="home-dot">H</span>
              <div>
                <strong>{street}</strong>
                <small>{district}</small>
                <div className="chips">
                  <span>Casa</span>
                  <span>{residents}</span>
                  <span>Sincronizado</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="bottom-nav">
          <span className="active">Domicílios</span>
          <span>Famílias</span>
          <span>Pessoas</span>
        </div>
      </div>
    );
  }

  if (kind === "householdForm") {
    return (
      <div className="app-view">
        <div className="app-bar">
          <span className="back-mark" />
          <strong>Novo domicílio</strong>
        </div>
        <div className="progress-line">
          <span />
        </div>
        <div className="app-content form-content">
          <h4>Endereço</h4>
          {["Tipo de imóvel", "Microárea", "Nome do logradouro", "CEP", "Bairro"].map(
            (field) => (
              <label className="field-card" key={field}>
                <span>{field}</span>
                <strong>{field === "Microárea" ? "05" : "Preenchido"}</strong>
              </label>
            ),
          )}
          <div className="action-row">
            <span>Cancelar</span>
            <strong>Proxima etapa</strong>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "riskForm") {
    return (
      <div className="app-view">
        <div className="app-bar">
          <span className="shield-mark" />
          <strong>Estratificação</strong>
        </div>
        <div className="app-content form-content">
          <div className="info-box">
            <strong>Automação e-TET</strong>
            <span>Cálculo automático da estratificação de risco familiar.</span>
          </div>
          <h4>Sentinelas da família</h4>
          {["Acamados", "Def. física", "Def. mental", "Desnutrição"].map(
            (field, index) => (
              <label className="field-card risk-field" key={field}>
                <span>{field}</span>
                <strong>{index === 1 ? "1" : "0"}</strong>
              </label>
            ),
          )}
        </div>
        <div className="save-bar">
          <span>Cancelar</span>
          <strong>Salvar</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="app-view">
      <div className="app-bar">
        <span className="shield-mark" />
        <strong>Resultado</strong>
      </div>
      <div className="app-content result-content">
        <div className="score-card">
          <span>Pontuação familiar</span>
          <strong>7</strong>
          <em>R2 - risco médio</em>
        </div>
        <div className="risk-scale">
          <span />
          <span />
          <span className="active" />
          <span />
        </div>
        <article className="priority-card">
          <strong>Priorizar acompanhamento</strong>
          <p>Resultado disponível para discussão da equipe e planejamento das visitas.</p>
        </article>
      </div>
    </div>
  );
}

function PhoneMockup({
  screen,
  className = "",
}: {
  screen: (typeof appScreens)[number];
  className?: string;
}) {
  return (
    <figure className={`phone-device ${className}`}>
      <div className="phone-side left" />
      <div className="phone-side right" />
      <div className="phone-glass">
        <div className="phone-notch" />
        <PhoneScreen kind={screen.kind} />
      </div>
      <figcaption>{screen.text}</figcaption>
    </figure>
  );
}

function DemoPhoneVideo({ video }: { video: (typeof demoVideos)[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  async function startVideo() {
    setHasStarted(true);
    await videoRef.current?.play().catch(() => setHasStarted(false));
  }

  return (
    <article
      aria-label={video.title}
      className="video-card phone-video-card"
      key={video.src}
    >
      <div className="phone-video-frame">
        <video
          aria-label={video.text}
          controls
          onPlay={() => setHasStarted(true)}
          preload="metadata"
          ref={videoRef}
          src={video.src}
        >
          Seu navegador nao suporta reproducao de video.
        </video>
        {!hasStarted && (
          <button
            aria-label="Clique para iniciar a demonstração do e-TET"
            className="video-play-overlay"
            onClick={startVideo}
            type="button"
          >
            <span className="play-circle">
              <span aria-hidden="true" />
            </span>
            <strong>Clique para iniciar</strong>
          </button>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeGuidePage, setActiveGuidePage] = useState(0);
  const [selectedSentinels, setSelectedSentinels] = useState<string[]>([
    "sanitation",
    "elderly",
    "hypertension",
  ]);

  const score = useMemo(
    () =>
      sentinelOptions
        .filter((option) => selectedSentinels.includes(option.id))
        .reduce((total, option) => total + option.points, 0),
    [selectedSentinels],
  );

  const risk = classifyRisk(score);
  const step = flowSteps[activeStep];
  const activeFlowScreen = appScreens[step.screenIndex];
  const guidePage = guidePages[activeGuidePage];

  function toggleSentinel(id: string) {
    setSelectedSentinels((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function selectStep(index: number) {
    setActiveStep(index);
  }

  function previousGuidePage() {
    setActiveGuidePage((current) =>
      current === 0 ? guidePages.length - 1 : current - 1,
    );
  }

  function nextGuidePage() {
    setActiveGuidePage((current) =>
      current === guidePages.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <main>
      <header className="topbar" aria-label="Navegacao principal">
        <a className="brand" href="#inicio" aria-label="Voltar ao inicio">
          <span className="brand-mark">e</span>
          <span>e-TET</span>
        </a>
        <nav>
          <a href="#identidade">Identidade</a>
          <a href="#mudanca">Antes/depois</a>
          <a href="#demonstracao">Demo</a>
          <a href="#produto">Produto</a>
          <a href="#risco">Risco</a>
          <a href="#guia">Guia</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">e-TET | PET-Saúde Digital - UCDB | Grupo 8</p>
          <h1>Risco familiar calculado no ritmo real da visita</h1>
          <p className="lead">
            O e-TET propõe uma experiência guiada para registrar sentinelas,
            calcular a Escala de Risco Familiar de Coelho-Savassi e apoiar a
            priorização das famílias na APS.
          </p>

          <div className="hero-actions">
            <a className="button primary" href="#produto">
              Explorar o funcionamento
            </a>
            <a className="button secondary" href="#demonstracao">
              Ver demonstração
            </a>
          </div>

          <div className="institution-strip" aria-label="Instituições do projeto">
            <span>Instituições parceiras</span>
            <div className="logo-row">
              {brandLogos.map((logo) => (
                <div className={`logo-card ${logo.className}`} key={logo.name}>
                  <img
                    alt={logo.alt}
                    height={72}
                    src={logo.src}
                    width={160}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hero-metrics" aria-label="Resumo do e-TET">
            <span>Cadastro territorial</span>
            <span>Sentinelas padronizadas</span>
            <span>Classificação R0 a R3</span>
          </div>
        </div>

        <div className="hero-stage" aria-label="Telas do aplicativo e-TET">
          <PhoneMockup screen={appScreens[1]} className="hero-phone back-phone" />
          <PhoneMockup screen={appScreens[3]} className="hero-phone front-phone" />
          <div className={`risk-chip ${risk.tone}`}>
            <span>Simulação ativa</span>
            <strong>{risk.level}</strong>
            <small>{score} pontos</small>
          </div>
        </div>
      </section>

      <section className="section identity-section" id="identidade">
        <div className="identity-layout">
          <div className="identity-copy">
            <p className="eyebrow">Identidade do grupo</p>
            <h2>Identidade visual para o trabalho de campo</h2>
            <p>
              A identidade visual do grupo aproxima o protótipo da rotina das
              equipes e reforça a parceria entre PET-Saúde Digital, UCDB e a
              rede pública de saúde.
            </p>
            <div className="identity-tags" aria-label="Elementos de identidade">
              <span>Logo e-TET</span>
              <span>PET-Saúde Digital</span>
              <span>UCDB e SUS</span>
            </div>
          </div>

          <div className="identity-logo">
            <img
              alt="Logo do e-TET"
              height={720}
              src="/identity/e-tet-logo.png"
              width={720}
            />
          </div>
        </div>
      </section>

      <section className="section comparison" id="mudanca">
        <div className="section-heading">
          <p className="eyebrow">Mudança principal</p>
          <h2>Menos dispersão, mais decisão no território</h2>
          <p>
            No processo atual, a estratificação passa por arquivos separados,
            formulários por unidade, seleção manual de equipe e microárea,
            preenchimento das sentinelas e leitura posterior em planilha. O
            e-TET concentra esse caminho em uma jornada única, mantendo a
            avaliação profissional no centro.
          </p>
        </div>

        <div className="route-compare">
          <article className="route-column current">
            <span className="compare-badge">Hoje</span>
            <h3>Fluxo atual da estratificação</h3>
            <ol>
              {currentFlow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>

          <article className="route-column proposed">
            <span className="compare-badge">Com e-TET</span>
            <h3>Fluxo proposto pelo protótipo</h3>
            <ol>
              {eTetFlow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="section presentation-section" id="demonstracao">
        <div className="presentation-layout">
          <div className="presentation-copy">
            <p className="eyebrow">Demonstração do e-TET</p>
            <h2>O aplicativo em funcionamento, no formato da rotina do ACS</h2>
            <p>
              A demonstração apresenta o preenchimento guiado no celular,
              evidenciando como a ferramenta organiza dados do território,
              conduz a classificação familiar e reduz etapas manuais no
              processo de estratificação.
            </p>

            <div className="pitch-grid" aria-label="Pontos aproveitados da apresentação">
              {pitchPoints.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="demo-panel" aria-label="Vídeos de demonstração">
            <div className="demo-panel-heading">
              <span>Demonstração do e-TET</span>
              <strong>Aplicativo em uso</strong>
            </div>
            <div className="video-grid">
              {demoVideos.map((video) => (
                <DemoPhoneVideo key={video.src} video={video} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section product" id="produto">
        <div className="section-heading compact">
          <p className="eyebrow">Funcionamento</p>
          <h2>Do login ao risco familiar em uma jornada única</h2>
          <p>
            Clique nas etapas para alternar entre telas recriadas com base no
            front-end do e-TET e no guia de bolso.
          </p>
        </div>

        <div className="product-layout">
          <div className="step-rail" role="tablist" aria-label="Etapas do e-TET">
            {flowSteps.map((item, index) => (
              <button
                aria-controls="product-screen"
                aria-selected={activeStep === index}
                className={activeStep === index ? "step active" : "step"}
                key={item.label}
                onClick={() => selectStep(index)}
                role="tab"
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
          </div>

          <article className="product-copy">
            <p className="eyebrow">{step.label}</p>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <strong>
              Tela relacionada: {activeFlowScreen.title}. A proposta é reduzir
              retrabalho sem afirmar integração automática com sistemas oficiais.
            </strong>
          </article>

          <PhoneMockup screen={activeFlowScreen} className="detail-phone" />
        </div>
      </section>

      <section className="section risk-section" id="risco">
        <div className="section-heading">
          <p className="eyebrow">Interativo</p>
          <h2>Simule a lógica da estratificação</h2>
          <p>
            Esta simulação reproduz a soma das sentinelas como recurso de
            demonstração. A classificação final deve ser revisada pela equipe e
            registrada conforme autorização institucional.
          </p>
        </div>

        <div className="risk-layout">
          <div className="sentinel-grid">
            {sentinelOptions.map((option) => (
              <label className="sentinel" key={option.id}>
                <input
                  checked={selectedSentinels.includes(option.id)}
                  onChange={() => toggleSentinel(option.id)}
                  type="checkbox"
                />
                <span>{option.label}</span>
                <strong>{option.points} pts</strong>
              </label>
            ))}
          </div>

          <aside className={`risk-result ${risk.tone}`}>
            <span>Pontuação simulada</span>
            <strong>{score}</strong>
            <h3>{risk.level}</h3>
            <p>{risk.label}</p>
            <small>
              A ferramenta apoia a priorização; a decisão final continua sendo
              clínica, social e territorial.
            </small>
          </aside>
        </div>
      </section>

      <section className="section assurance">
        <div className="section-heading compact">
          <p className="eyebrow">Uso responsável</p>
          <h2>Protótipo claro, limites explícitos</h2>
        </div>
        <div className="assurance-grid">
          <article>
            <h3>O que o app oferece</h3>
            <p>
              Cadastro organizado, formulário de sentinelas, cálculo de escore
              e classificação para apoiar a agenda da equipe.
            </p>
          </article>
          <article>
            <h3>O que ainda depende</h3>
            <p>
              Integração oficial, escrita no PEC e sincronização institucional
              exigem autorização, homologação e governança de dados.
            </p>
          </article>
          <article>
            <h3>Como apresentar</h3>
            <p>
              O hotsite pode ser usado para explicar a mudança no fluxo, mostrar
              telas e abrir o guia de bolso durante as discussões com o grupo.
            </p>
          </article>
        </div>
      </section>

      <section className="section guide" id="guia">
        <div className="guide-layout">
          <div className="guide-copy">
            <p className="eyebrow">Guia de bolso</p>
            <h2>Guia de bolso em formato horizontal</h2>
            <p>
              Cada página original foi reorganizada em uma lâmina horizontal,
              mantendo o conteúdo completo e facilitando a leitura direto no
              hotsite.
            </p>
            <a
              className="button primary"
              href="/guide/guia-e-tet-horizontal.pdf"
              rel="noreferrer"
              target="_blank"
            >
              Abrir PDF horizontal
            </a>
          </div>

          <div className="booklet" aria-label="Guia de bolso navegável">
            <div className="booklet-toolbar">
              <button
                aria-label="Página anterior do guia"
                onClick={previousGuidePage}
                type="button"
              >
                &lt;
              </button>
              <span>
                Lâmina {guidePage.page} de {guidePages.length}
              </span>
              <button
                aria-label="Próxima página do guia"
                onClick={nextGuidePage}
                type="button"
              >
                &gt;
              </button>
            </div>

            <div className="booklet-shell">
              <button
                aria-label="Página anterior do guia"
                className="page-turn previous"
                onClick={previousGuidePage}
                type="button"
              >
                &lt;
              </button>
              <figure className="booklet-page">
                <img
                  alt={guidePage.alt}
                  decoding="sync"
                  draggable="false"
                  height="900"
                  loading="eager"
                  src={guidePage.src}
                  width="1600"
                />
              </figure>
              <button
                aria-label="Próxima página do guia"
                className="page-turn next"
                onClick={nextGuidePage}
                type="button"
              >
                &gt;
              </button>
            </div>

            <div className="guide-thumbs" aria-label="Selecionar página do guia">
              {guidePages.map((page, index) => (
                <button
                  aria-current={activeGuidePage === index ? "page" : undefined}
                  aria-label={`Abrir lâmina ${page.page} do guia`}
                  className={activeGuidePage === index ? "active" : ""}
                  key={page.src}
                  onClick={() => setActiveGuidePage(index)}
                  type="button"
                >
                  {page.page}
                </button>
              ))}
            </div>

            <div className="guide-preload" aria-hidden="true">
              {guidePages.map((page) => (
                <img alt="" key={page.src} src={page.src} />
              ))}
            </div>
          </div>
        </div>

        <div className="footer-logos" aria-label="Logos institucionais">
          {brandLogos.map((logo) => (
            <img
              className={logo.className}
              alt={logo.alt}
              height={54}
              key={logo.name}
              src={logo.src}
              width={130}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
