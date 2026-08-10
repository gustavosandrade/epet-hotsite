"use client";

import { useMemo, useState } from "react";

const flowSteps = [
  {
    label: "Login",
    title: "Acesso do ACS",
    description:
      "O profissional entra no ambiente do app com suas credenciais e inicia o trabalho territorial com dados organizados por domicilio, familia e individuo.",
    screenTitle: "Entrada",
    screenLines: ["CPF", "Senha", "Entrar"],
    highlight: "Acesso unico para seguir o fluxo de cadastro e visita.",
  },
  {
    label: "Domicilio",
    title: "Cadastro do domicilio",
    description:
      "O app conduz o preenchimento do endereco, tipo de localizacao, pavimento, comodos, moradores e condicoes de infraestrutura.",
    screenTitle: "Domicilio",
    screenLines: ["Endereco completo", "Comodos e moradores", "Agua, energia e saneamento"],
    highlight: "Menos informacao dispersa e menos retrabalho na revisao.",
  },
  {
    label: "Familia",
    title: "Composicao familiar",
    description:
      "A familia e associada ao domicilio, com prontuario, renda, tempo de moradia e indicacao do responsavel pela unidade familiar.",
    screenTitle: "Familia",
    screenLines: ["Prontuario", "Membros", "Responsavel familiar"],
    highlight: "A familia vira a unidade de analise para o risco.",
  },
  {
    label: "Cidadaos",
    title: "Cadastro dos membros",
    description:
      "Cada membro pode receber dados pessoais, sociais e de saude relevantes para compor as sentinelas de risco familiar.",
    screenTitle: "Membro",
    screenLines: ["Nascimento e cor", "Escolaridade e trabalho", "Condicoes de saude"],
    highlight: "As informacoes entram uma vez e alimentam a estratificacao.",
  },
  {
    label: "Risco",
    title: "Calculo do e-TET",
    description:
      "Com a familia cadastrada, o e-TET registra as sentinelas, soma os pontos e classifica o risco familiar para apoiar a priorizacao das visitas.",
    screenTitle: "Risco familiar",
    screenLines: ["Sentinelas", "Pontuacao", "Classificacao R0 a R3"],
    highlight: "O calculo deixa de depender de soma manual e planilhas soltas.",
  },
];

const sentinelOptions = [
  { id: "bedridden", label: "Pessoa acamada", points: 3 },
  { id: "disability", label: "Deficiencia fisica ou mental", points: 3 },
  { id: "sanitation", label: "Baixas condicoes de saneamento", points: 3 },
  { id: "malnutrition", label: "Desnutricao grave", points: 3 },
  { id: "drug", label: "Drogadicao", points: 2 },
  { id: "unemployed", label: "Desemprego", points: 2 },
  { id: "illiteracy", label: "Analfabetismo", points: 1 },
  { id: "baby", label: "Crianca com menos de 6 meses", points: 1 },
  { id: "elderly", label: "Pessoa com mais de 70 anos", points: 1 },
  { id: "hypertension", label: "Hipertensao arterial", points: 1 },
  { id: "diabetes", label: "Diabetes mellitus", points: 1 },
];

function classifyRisk(score: number) {
  if (score >= 9) return { level: "R3", label: "risco elevado", tone: "high" };
  if (score >= 7) return { level: "R2", label: "risco medio", tone: "medium" };
  if (score >= 5) return { level: "R1", label: "risco menor", tone: "low" };
  return { level: "R0", label: "sem risco familiar registrado", tone: "base" };
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
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

  function toggleSentinel(id: string) {
    setSelectedSentinels((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
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
          <a href="#mudanca">O que muda</a>
          <a href="#fluxo">Fluxo</a>
          <a href="#risco">Risco familiar</a>
          <a href="#guia">Guia</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">PET Saude Digital - UCDB | Grupo 8</p>
          <h1>e-TET: estratificacao de risco familiar mais simples para a APS</h1>
          <p className="lead">
            Um prototipo de apoio ao trabalho dos Agentes Comunitarios de Saude
            que organiza dados do territorio, calcula a Escala de Risco Familiar
            de Coelho-Savassi e ajuda a priorizar visitas com mais clareza.
          </p>
          <div className="hero-metrics" aria-label="Resumo do valor do e-TET">
            <span>Fluxo guiado</span>
            <span>Calculo automatizado</span>
            <span>Priorizacao territorial</span>
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#fluxo">
              Ver funcionamento
            </a>
            <a className="button secondary" href="#mudanca">
              Comparar com o fluxo atual
            </a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Resumo visual do app">
          <div className="dashboard-card">
            <div className="dashboard-top">
              <span>Familia acompanhada</span>
              <strong>R2</strong>
            </div>
            <div className="risk-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <small>7 pontos - prioridade media</small>
          </div>
          <div className="app-preview">
            <div className="preview-phone main-phone">
              <div className="preview-header">
                <span />
                <strong>Sentinelas</strong>
              </div>
              <div className="preview-list">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="preview-action">Gerar classificacao</div>
            </div>
            <div className="preview-phone side-phone">
              <div className="preview-header">
                <span />
                <strong>Cadastro</strong>
              </div>
              <div className="preview-list compact-list">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          <div className="signal-grid">
            <div>
              <strong>11</strong>
              <span>sentinelas</span>
            </div>
            <div>
              <strong>4</strong>
              <span>classes</span>
            </div>
            <div>
              <strong>1</strong>
              <span>fluxo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section comparison" id="mudanca">
        <div className="section-heading">
          <p className="eyebrow">Mudanca principal</p>
          <h2>O que hoje fica manual passa a ser guiado</h2>
          <p>
            O e-TET nao substitui a avaliacao profissional nem os sistemas
            oficiais. Ele organiza o caminho entre cadastro, sentinelas,
            pontuacao e classificacao para reduzir perdas de informacao.
          </p>
        </div>

        <div className="compare-grid">
          <article className="compare-column current">
            <span className="compare-badge">Antes</span>
            <h3>Como costuma ser feito</h3>
            <ul>
              <li>Dados coletados em visitas e registros separados.</li>
              <li>Sentinelas interpretadas e somadas manualmente.</li>
              <li>Planilhas ou anotacoes paralelas para organizar prioridades.</li>
              <li>Maior risco de duplicidade, esquecimento ou transcricao.</li>
            </ul>
          </article>

          <article className="compare-column proposed">
            <span className="compare-badge">Com e-TET</span>
            <h3>Com o apoio do e-TET</h3>
            <ul>
              <li>Cadastro e risco conectados em um fluxo de trabalho.</li>
              <li>Pontuacao calculada automaticamente a partir das sentinelas.</li>
              <li>Classificacao R0, R1, R2 ou R3 exibida de forma imediata.</li>
              <li>Relatorio para apoiar discussao da equipe e planejamento.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section flow-section" id="fluxo">
        <div className="section-heading compact">
          <p className="eyebrow">Funcionamento</p>
          <h2>Do cadastro ao risco familiar</h2>
          <p>
            Clique nas etapas para visualizar como o app conduz o profissional
            ate o calculo da estratificacao.
          </p>
        </div>

        <div className="flow-layout">
          <div className="step-list" role="tablist" aria-label="Etapas do e-TET">
            {flowSteps.map((item, index) => (
              <button
                aria-controls="flow-screen"
                aria-selected={activeStep === index}
                className={activeStep === index ? "step active" : "step"}
                key={item.label}
                onClick={() => setActiveStep(index)}
                role="tab"
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
          </div>

          <article className="flow-detail">
            <p className="eyebrow">{step.label}</p>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <strong>{step.highlight}</strong>
          </article>

          <div className="phone" id="flow-screen" role="tabpanel">
            <div className="phone-top">
              <span />
              <strong>{step.screenTitle}</strong>
            </div>
            <div className="phone-body">
              <div className="phone-hero-line">
                <span>{step.label}</span>
                <strong>{String(activeStep + 1).padStart(2, "0")}</strong>
              </div>
              {step.screenLines.map((line) => (
                <div className="field-row" key={line}>
                  <span>{line}</span>
                  <small />
                </div>
              ))}
              <div className="phone-result">
                <span>Proxima acao</span>
                <strong>{activeStep === 4 ? "Gerar classificacao" : "Salvar e continuar"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section risk-section" id="risco">
        <div className="section-heading">
          <p className="eyebrow">Interativo</p>
          <h2>Calculadora demonstrativa de risco</h2>
          <p>
            Esta simulacao mostra a logica de soma das sentinelas. A aplicacao
            real deve registrar a versao da escala, os dados usados e a revisao
            da equipe.
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
              A classificacao apoia a priorizacao, mas nao substitui a leitura
              clinica, social e territorial da equipe.
            </small>
          </aside>
        </div>
      </section>

      <section className="section assurance">
        <div>
          <p className="eyebrow">Uso responsavel</p>
          <h2>Integra com cuidado, nao por promessa</h2>
        </div>
        <div className="assurance-grid">
          <article>
            <h3>Hoje</h3>
            <p>
              O prototipo pode ser testado com dados ficticios, bases
              autorizadas ou formulacoes manuais, sem acessar automaticamente
              sistemas oficiais.
            </p>
          </article>
          <article>
            <h3>Na pesquisa</h3>
            <p>
              A avaliacao observa confiabilidade do calculo, facilidade de uso,
              tempo, dificuldades e utilidade percebida pelos profissionais.
            </p>
          </article>
          <article>
            <h3>Para uso institucional</h3>
            <p>
              Qualquer envio ao e-SUS PEC ou integracao com e-SUS APS depende
              de autorizacao, seguranca, homologacao e governanca de dados.
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
