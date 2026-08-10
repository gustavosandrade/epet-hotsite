"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

const appScreens = [
  {
    label: "Acesso",
    title: "Login do ACS",
    src: "/screens/app-login.png",
    alt: "Print da tela de login do e-ACS no guia de bolso do e-TET",
    text: "O profissional entra com CPF e senha para acessar o territorio eletronico.",
  },
  {
    label: "Territorio",
    title: "Domicilios cadastrados",
    src: "/screens/app-households.png",
    alt: "Print da lista de domicilios cadastrados no app",
    text: "A lista organiza enderecos, moradores e situacao de sincronizacao.",
  },
  {
    label: "Cadastro",
    title: "Novo domicilio",
    src: "/screens/app-household-form.png",
    alt: "Print do formulario de novo domicilio no app",
    text: "O preenchimento passa por endereco, moradia e infraestrutura.",
  },
  {
    label: "Sentinelas",
    title: "Estratificacao",
    src: "/screens/app-risk-form.png",
    alt: "Print da tela de estratificacao de risco familiar",
    text: "As sentinelas sao registradas em um formulario especifico para a familia.",
  },
  {
    label: "Risco",
    title: "Campos de risco",
    src: "/screens/app-risk-fields.png",
    alt: "Print dos campos finais de sentinelas do e-TET",
    text: "O app soma os fatores e apoia a classificacao do risco familiar.",
  },
];

const flowSteps = [
  {
    label: "Entrar",
    title: "Acesso identificado",
    description:
      "O ACS acessa o e-ACS por CPF e senha para iniciar a rotina de trabalho no territorio.",
    screenIndex: 0,
  },
  {
    label: "Localizar",
    title: "Domicilio e familia",
    description:
      "A equipe localiza o domicilio, verifica familias residentes e confere se ha registros pendentes.",
    screenIndex: 1,
  },
  {
    label: "Cadastrar",
    title: "Dados estruturados",
    description:
      "Endereco, moradia, infraestrutura, responsavel familiar e membros sao preenchidos em etapas.",
    screenIndex: 2,
  },
  {
    label: "Estratificar",
    title: "Sentinelas de risco",
    description:
      "O profissional informa os fatores de risco da familia em um formulario guiado.",
    screenIndex: 3,
  },
  {
    label: "Priorizar",
    title: "Pontuacao e decisao",
    description:
      "O resultado orienta a priorizacao das visitas e a discussao pela equipe de APS.",
    screenIndex: 4,
  },
];

const currentFlow = [
  "Coleta durante a visita",
  "Conferencia dos campos",
  "Soma das sentinelas",
  "Registro ou planilha paralela",
  "Priorizacao pela equipe",
];

const eTetFlow = [
  "Formulario guiado",
  "Sentinelas padronizadas",
  "Pontuacao automatizada",
  "Risco exibido na hora",
  "Relatorio para planejamento",
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
  if (score >= 9) return { level: "R3", label: "risco maximo", tone: "high" };
  if (score >= 7) return { level: "R2", label: "risco medio", tone: "medium" };
  if (score >= 5) return { level: "R1", label: "risco menor", tone: "low" };
  return { level: "R0", label: "sem risco familiar registrado", tone: "base" };
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeScreen, setActiveScreen] = useState(3);
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
  const featuredScreen = appScreens[activeScreen];

  function toggleSentinel(id: string) {
    setSelectedSentinels((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function selectStep(index: number) {
    setActiveStep(index);
    setActiveScreen(flowSteps[index].screenIndex);
  }

  return (
    <main>
      <header className="topbar" aria-label="Navegacao principal">
        <a className="brand" href="#inicio" aria-label="Voltar ao inicio">
          <span className="brand-mark">e</span>
          <span>e-TET</span>
        </a>
        <nav>
          <a href="#mudanca">Antes/depois</a>
          <a href="#produto">Produto</a>
          <a href="#telas">Telas</a>
          <a href="#risco">Risco</a>
          <a href="#guia">Guia</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">PET Saude Digital - UCDB | Grupo 8</p>
          <h1>Risco familiar calculado no ritmo real da visita</h1>
          <p className="lead">
            O e-TET transforma o cadastro territorial em uma experiencia guiada
            para registrar sentinelas, somar a Escala de Risco Familiar de
            Coelho-Savassi e apoiar a priorizacao das familias na APS.
          </p>

          <div className="hero-actions">
            <a className="button primary" href="#produto">
              Explorar o funcionamento
            </a>
            <a className="button secondary" href="#telas">
              Ver telas do aplicativo
            </a>
          </div>

          <div className="hero-metrics" aria-label="Resumo do e-TET">
            <span>Cadastro territorial</span>
            <span>Sentinelas padronizadas</span>
            <span>Classificacao R0 a R3</span>
          </div>
        </div>

        <div className="hero-stage" aria-label="Telas reais do aplicativo e-TET">
          <div className="screen-stack">
            <Image
              className="screen-shot shot-back"
              src="/screens/app-households.png"
              alt="Lista de domicilios no e-TET"
              width={325}
              height={670}
              sizes="(max-width: 760px) 54vw, 260px"
              unoptimized
            />
            <Image
              className="screen-shot shot-front"
              src="/screens/app-risk-form.png"
              alt="Formulario de estratificacao de risco familiar no e-TET"
              priority
              width={325}
              height={700}
              sizes="(max-width: 760px) 68vw, 320px"
              unoptimized
            />
          </div>
          <div className={`risk-chip ${risk.tone}`}>
            <span>Simulacao ativa</span>
            <strong>{risk.level}</strong>
            <small>{score} pontos</small>
          </div>
          <p className="source-note">Prints extraidos do Guia de Bolso E-TET.</p>
        </div>
      </section>

      <section className="section comparison" id="mudanca">
        <div className="section-heading">
          <p className="eyebrow">Mudanca principal</p>
          <h2>Menos dispersao, mais decisao no territorio</h2>
          <p>
            Os videos enviados mostram o fluxo atual como uma sequencia de
            coleta, conferencia e registro. O e-TET concentra esse caminho em
            etapas visuais, mantendo a avaliacao profissional no centro.
          </p>
        </div>

        <div className="route-compare">
          <article className="route-column current">
            <span className="compare-badge">Hoje</span>
            <h3>Fluxo observado na coleta atual</h3>
            <ol>
              {currentFlow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>

          <article className="route-column proposed">
            <span className="compare-badge">Com e-TET</span>
            <h3>Fluxo proposto pelo prototipo</h3>
            <ol>
              {eTetFlow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="section product" id="produto">
        <div className="section-heading compact">
          <p className="eyebrow">Funcionamento</p>
          <h2>Do login ao risco familiar em uma jornada unica</h2>
          <p>
            Clique nas etapas para alternar entre telas reais do guia e ver o
            que muda no trabalho do ACS.
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
              Tela relacionada: {activeFlowScreen.title}. O objetivo e reduzir
              retrabalho sem afirmar integracao automatica com sistemas oficiais.
            </strong>
          </article>

          <figure className="device-frame" id="product-screen" role="tabpanel">
            <Image
              src={activeFlowScreen.src}
              alt={activeFlowScreen.alt}
              width={330}
              height={700}
              sizes="(max-width: 760px) 88vw, 360px"
              unoptimized
            />
            <figcaption>{activeFlowScreen.text}</figcaption>
          </figure>
        </div>
      </section>

      <section className="section screens" id="telas">
        <div className="section-heading">
          <p className="eyebrow">Telas reais</p>
          <h2>Uma vitrine do prototipo, sem mockup generico</h2>
          <p>
            As imagens abaixo foram retiradas do guia de bolso e ajudam a
            apresentar o aplicativo em reunioes, oficinas e validacoes com as
            USF participantes.
          </p>
        </div>

        <div className="screen-gallery">
          <div className="screen-picker" role="tablist" aria-label="Telas do aplicativo">
            {appScreens.map((screen, index) => (
              <button
                aria-controls="featured-screen"
                aria-selected={activeScreen === index}
                className={activeScreen === index ? "picker active" : "picker"}
                key={screen.label}
                onClick={() => setActiveScreen(index)}
                role="tab"
                type="button"
              >
                <span>{screen.label}</span>
                <strong>{screen.title}</strong>
              </button>
            ))}
          </div>

          <figure className="featured-screen" id="featured-screen" role="tabpanel">
            <Image
              src={featuredScreen.src}
              alt={featuredScreen.alt}
              width={330}
              height={720}
              sizes="(max-width: 1060px) 88vw, 520px"
              unoptimized
            />
            <figcaption>
              <span>{featuredScreen.label}</span>
              {featuredScreen.text}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section risk-section" id="risco">
        <div className="section-heading">
          <p className="eyebrow">Interativo</p>
          <h2>Teste a logica da estratificacao</h2>
          <p>
            Esta simulacao reproduz a soma das sentinelas como recurso de
            demonstracao. A classificacao final deve ser revisada pela equipe e
            registrada conforme autorizacao institucional.
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
            <span>Pontuacao simulada</span>
            <strong>{score}</strong>
            <h3>{risk.level}</h3>
            <p>{risk.label}</p>
            <small>
              A ferramenta apoia a priorizacao; a decisao final continua sendo
              clinica, social e territorial.
            </small>
          </aside>
        </div>
      </section>

      <section className="section assurance">
        <div className="section-heading compact">
          <p className="eyebrow">Uso responsavel</p>
          <h2>Prototipo claro, limites explicitos</h2>
        </div>
        <div className="assurance-grid">
          <article>
            <h3>O que o app oferece</h3>
            <p>
              Cadastro organizado, formulario de sentinelas, calculo de escore
              e classificacao para apoiar a agenda da equipe.
            </p>
          </article>
          <article>
            <h3>O que ainda depende</h3>
            <p>
              Integracao oficial, escrita no PEC e sincronizacao institucional
              exigem autorizacao, homologacao e governanca de dados.
            </p>
          </article>
          <article>
            <h3>Como apresentar</h3>
            <p>
              Use o hotsite para explicar a mudanca no fluxo, mostrar telas e
              abrir o guia de bolso durante as discussoes com o grupo.
            </p>
          </article>
        </div>
      </section>

      <section className="section guide" id="guia">
        <div>
          <p className="eyebrow">Guia de bolso</p>
          <h2>Material de apoio para apresentacao e treinamento</h2>
          <p>
            O guia apresenta o caminho do e-TET desde o acesso do ACS ate o
            cadastro do domicilio, familia, membros e sentinelas de risco.
          </p>
        </div>
        <a
          className="button primary"
          href="https://drive.google.com/file/d/1iLxRSNPdShdBMfVxWJJ9IqNts67JZKxd/view"
          rel="noreferrer"
          target="_blank"
        >
          Abrir guia completo
        </a>
      </section>
    </main>
  );
}
