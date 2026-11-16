"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

/**
 * Hero interativo: cinco aparelhos 3D (console, controle, smartphone,
 * notebook gamer e PC gamer).
 * A pessoa arrasta para girar, troca de aparelho pelas setas/abas e
 * passa o mouse ou toca nas peças para ver o serviço de cada uma.
 *
 * O 3D (Three.js) fica em hero3d/ e só é carregado no navegador.
 */
const Stage3D = dynamic(() => import("./hero3d/Stage3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="size-10 animate-spin rounded-full border-2 border-line-strong border-t-brand-blueSoft" />
    </div>
  ),
});

type Hotspot = {
  id: string;
  /** texto curto do botão */
  label: string;
  title: string;
  text: string;
  /** ângulo (graus) que deixa a peça de frente: [inclinação, giro] */
  view: [number, number];
};

type Device = {
  /** precisa bater com a chave do modelo em hero3d/models.ts */
  id: string;
  name: string;
  tab: string;
  kicker: string;
  view: [number, number];
  hotspots: Hotspot[];
};

const pc: Device = {
  id: "pc",
  name: "PC gamer",
  tab: "PCs",
  kicker: "Computadores",
  view: [10, -128],
  hotspots: [
    {
      id: "montagem",
      label: "Montagem",
      title: "Montagem de PC gamer",
      text: "Do gabinete vazio à máquina pronta para jogar: montagem completa das peças, com cabos organizados.",
      view: [8, -116],
    },
    {
      id: "limpeza",
      label: "Limpeza",
      title: "Limpeza técnica e pasta térmica",
      text: "Poeira nas ventoinhas, PC esquentando ou barulhento. Limpeza interna e pasta térmica nova.",
      view: [12, -100],
    },
    {
      id: "upgrade",
      label: "Upgrade",
      title: "Upgrade de SSD, RAM e peças",
      text: "Mais desempenho sem trocar de computador: instalamos SSD, memória e outras peças.",
      view: [4, -118],
    },
    {
      id: "formatacao",
      label: "Formatação",
      title: "Formatação e sistemas",
      text: "Sistema lento, com erros ou vírus. Formatação, reinstalação e recuperação de desempenho.",
      view: [8, -160],
    },
    {
      id: "diagnostico",
      label: "Não liga",
      title: "Diagnóstico de hardware",
      text: "Não liga, reinicia sozinho ou trava. Identificamos a peça com defeito antes de qualquer reparo.",
      view: [8, -24],
    },
  ],
};

const devices: Device[] = [
  {
    id: "ps5",
    name: "PlayStation 5",
    tab: "Consoles",
    kicker: "Consoles e videogames",
    view: [9, -38],
    hotspots: [
      {
        id: "metal",
        label: "Metal líquido",
        title: "Limpeza e troca do metal líquido",
        text: "Console esquentando, ventoinha no máximo ou desligando no meio do jogo? Fazemos a limpeza interna e a troca do metal líquido do processador.",
        view: [6, -58],
      },
      {
        id: "hdmi",
        label: "Conector HDMI",
        title: "Troca do conector HDMI",
        text: "Sem imagem na TV, tela preta ou sinal falhando. Substituímos o conector HDMI danificado.",
        view: [8, -150],
      },
      {
        id: "limpeza",
        label: "Ventilação",
        title: "Limpeza e manutenção preventiva",
        text: "Poeira acumulada aumenta o barulho e a temperatura. Limpeza técnica completa para o console voltar a respirar.",
        view: [10, -74],
      },
      {
        id: "boot",
        label: "Não liga",
        title: "Problemas de inicialização",
        text: "Não liga, liga e desliga ou trava ao iniciar. Diagnóstico técnico para identificar o defeito antes de qualquer reparo.",
        view: [6, -28],
      },
    ],
  },
  {
    id: "controller",
    name: "Controle DualSense",
    tab: "Controles",
    kicker: "Controles",
    view: [14, -22],
    hotspots: [
      {
        id: "analogico",
        label: "Analógico",
        title: "Troca de analógico",
        text: "Personagem andando sozinho, mira puxando ou direcional que não responde (o famoso drift). Substituímos o analógico do seu controle.",
        view: [10, 14],
      },
      {
        id: "placa",
        label: "Placa",
        title: "Reparo de placa",
        text: "Controle que não liga, não conecta ou desliga sozinho. Diagnóstico técnico e reparo na placa.",
        view: [18, -6],
      },
      {
        id: "conector",
        label: "Conector",
        title: "Reparo do conector de carga",
        text: "Não carrega, só funciona com o cabo em certa posição ou não é reconhecido pelo console.",
        view: [58, -8],
      },
      {
        id: "botoes",
        label: "Botões e gatilhos",
        title: "Reparo de botões e gatilhos",
        text: "Botão afundado, falhando ou gatilho sem resposta. Limpeza interna e troca das peças gastas.",
        view: [10, -24],
      },
      {
        id: "bateria",
        label: "Bateria",
        title: "Troca de bateria",
        text: "Carga que dura pouco ou controle que só funciona ligado no cabo.",
        view: [8, 168],
      },
    ],
  },
  {
    id: "iphone",
    name: "iPhone 18 Pro Max",
    tab: "Smartphones",
    kicker: "Smartphones",
    view: [6, -26],
    hotspots: [
      {
        id: "tela",
        label: "Tela",
        title: "Troca de tela",
        text: "Vidro trincado, toque falhando ou manchas na imagem. Substituímos o conjunto de tela.",
        view: [6, -18],
      },
      {
        id: "bateria",
        label: "Bateria",
        title: "Troca de bateria",
        text: "Descarrega rápido, desliga sozinho ou estufou? Avaliamos a bateria e fazemos a troca.",
        view: [6, 160],
      },
      {
        id: "conector",
        label: "Conector de carga",
        title: "Troca do conector de carga",
        text: "Não carrega, só carrega em certa posição ou dá mau contato no cabo.",
        view: [-34, -16],
      },
      {
        id: "camera",
        label: "Câmeras",
        title: "Câmeras e componentes",
        text: "Câmera embaçada, lente quebrada ou sem foco. Reparo e substituição dos componentes.",
        view: [6, 152],
      },
      {
        id: "placa",
        label: "Placa",
        title: "Reparos de placa",
        text: "Não liga, esquenta ou teve contato com líquido. Diagnóstico técnico para identificar o defeito na placa.",
        view: [6, 170],
      },
    ],
  },
  {
    id: "notebook",
    name: "Notebook gamer",
    tab: "Notebooks",
    kicker: "Computadores e notebooks",
    view: [20, -28],
    hotspots: [
      {
        id: "tela",
        label: "Tela",
        title: "Troca de tela",
        text: "Tela quebrada, com listras, manchas ou sem imagem. Substituímos o painel do seu notebook.",
        view: [12, -20],
      },
      {
        id: "teclado",
        label: "Teclado",
        title: "Troca de teclado",
        text: "Teclas falhando, soltas ou teclado que parou depois de um líquido derramado.",
        view: [36, -20],
      },
      {
        id: "termica",
        label: "Aquecimento",
        title: "Limpeza técnica e pasta térmica",
        text: "Esquentando, travando no jogo ou com cooler barulhento. Limpeza interna e pasta térmica nova.",
        view: [40, 8],
      },
      {
        id: "upgrade",
        label: "SSD e RAM",
        title: "Upgrade de SSD e RAM",
        text: "Mais velocidade para jogos e trabalho sem trocar de máquina.",
        view: [36, -40],
      },
      {
        id: "sistema",
        label: "Sistema",
        title: "Formatação e sistemas",
        text: "Sistema lento ou com erros. Formatação, reinstalação e recuperação de desempenho.",
        view: [12, -8],
      },
    ],
  },
  pc,
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [active, setActive] = useState<string | null>(null);
  const [focus, setFocus] = useState({ id: "", n: 0 });
  const [touched, setTouched] = useState(false);

  const device = devices[index];
  const hotspot = device.hotspots.find((h) => h.id === active) ?? null;

  const goTo = (next: number) => {
    const n = devices.length;
    const i = ((next % n) + n) % n;
    if (i === index) return;
    setDir(next > index ? 1 : -1);
    setIndex(i);
    setActive(null);
  };

  const select = (id: string, rotate: boolean) => {
    setActive(id);
    setTouched(true);
    if (rotate) setFocus((f) => ({ id, n: f.n + 1 }));
  };

  const quoteHref = hotspot
    ? whatsappLink(
        `Olá! Vim pelo site da Nonitro Lab e gostaria de um orçamento: ${hotspot.title} (${device.name}).`,
      )
    : whatsappLink(whatsappMessages.default);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-10 pt-20 sm:pt-24 lg:min-h-[100svh] lg:pb-14"
    >
      {/* Fundo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_45%,#000_30%,transparent_75%)]" />
        <div className="absolute left-[64%] top-[46%] h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/20 blur-[130px]" />
        <div className="absolute left-[28%] top-[72%] h-[40vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/20 blur-[120px]" />
      </div>

      <div className="container grid items-center gap-x-8 gap-y-4 lg:min-h-[calc(100svh-9.5rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:grid-rows-[auto_auto]">
        {/* Título */}
        <div className="text-center lg:col-start-1 lg:row-start-1 lg:self-end lg:text-left">
          <span className="eyebrow whitespace-nowrap max-sm:px-2.5 max-sm:text-[10px] max-sm:tracking-[0.12em]">
            Laboratório técnico · {siteConfig.location.city} — {siteConfig.location.state}
          </span>
          <h1
            id="hero-title"
            className="mt-4 text-balance text-[clamp(2.4rem,5vw,4.75rem)] font-semibold leading-[0.98] tracking-tight text-gradient"
          >
            Tecnologia em boas mãos.
          </h1>
        </div>

        {/* Palco 3D */}
        <div className="relative h-[54svh] min-h-[380px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[min(78svh,700px)]">
          <Stage3D
            deviceId={device.id}
            view={device.view}
            hotspots={device.hotspots}
            activeId={active}
            focusKey={`${focus.id}:${focus.n}`}
            direction={dir}
            onSelect={select}
            onInteract={() => setTouched(true)}
          />

          {/* Dica */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center transition-opacity duration-500 ${
              touched ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="flex items-center gap-2 rounded-full border border-line bg-bg/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-text-muted backdrop-blur">
              <Hand className="size-3.5 animate-pulse" />
              Arraste para girar · toque nas peças
            </span>
          </div>

          {/* Setas */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Aparelho anterior"
            className="absolute left-0 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-bg/70 text-text backdrop-blur transition-colors hover:bg-bg-raised"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Próximo aparelho"
            className="absolute right-0 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-bg/70 text-text backdrop-blur transition-colors hover:bg-bg-raised"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>

          {/* Abas */}
          <div
            role="tablist"
            aria-label="Escolha o aparelho"
            className="absolute inset-x-0 bottom-0 z-20 flex justify-center"
          >
            <div className="flex gap-1 rounded-full border border-line bg-bg/70 p-1 backdrop-blur">
              {devices.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => goTo(i)}
                  className={`rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors sm:px-4 sm:text-sm ${
                    i === index
                      ? "bg-brand-gradient text-white"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {d.tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Painel de informação */}
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-brand-blueSoft lg:text-left">
            {device.kicker} · {device.name}
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
            {device.hotspots.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => select(h.id, true)}
                aria-pressed={active === h.id}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active === h.id
                    ? "border-brand-blueSoft bg-brand-blue/20 text-white"
                    : "border-line bg-bg-surface/70 text-text-muted hover:border-line-strong hover:text-text"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>

          <div className="mt-5 min-h-[10.5rem] text-center lg:text-left" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={hotspot ? `${device.id}-${hotspot.id}` : `${device.id}-intro`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {hotspot ? (
                  <>
                    <h2 className="text-balance text-2xl font-semibold leading-tight text-text sm:text-3xl">
                      {hotspot.title}
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-muted sm:text-base lg:mx-0">
                      {hotspot.text}
                    </p>
                  </>
                ) : (
                  <p className="mx-auto max-w-md text-balance text-sm leading-relaxed text-text-muted sm:text-base lg:mx-0">
                    Assistência técnica especializada em celulares,
                    computadores, notebooks e consoles. Gire o aparelho e
                    toque em cada peça para ver o que consertamos nela.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              {hotspot ? "Orçar este serviço" : "Solicitar orçamento"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a href="#servicos" className="btn-ghost w-full sm:w-auto">
              Ver todos os serviços
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
