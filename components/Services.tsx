"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Stethoscope,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Section } from "./Section";
import { whatsappLink, whatsappMessages, type WhatsAppIntent } from "@/lib/whatsapp";

type Service = {
  icon: typeof Smartphone;
  title: string;
  short: string;
  intent: WhatsAppIntent;
  /** cor de destaque do cartão (r g b) */
  accent: string;
  items: string[];
};

const services: Service[] = [
  {
    icon: Smartphone,
    title: "Smartphones",
    short: "Smartphones",
    intent: "smartphone",
    accent: "22 139 255",
    items: [
      "Troca de telas",
      "Substituição de baterias",
      "Conectores de carga",
      "Câmeras e componentes",
      "Reparos de placa",
      "Diagnósticos e software",
    ],
  },
  {
    icon: Laptop,
    title: "Computadores e notebooks",
    short: "PCs & Notebooks",
    intent: "computer",
    accent: "121 87 255",
    items: [
      "Diagnóstico de hardware",
      "Reparos e manutenção",
      "Formatação e sistemas",
      "Upgrade de SSD e RAM",
      "Limpeza técnica",
      "Recuperação de desempenho",
    ],
  },
  {
    icon: Gamepad2,
    title: "Consoles e videogames",
    short: "Consoles",
    intent: "console",
    accent: "192 75 247",
    items: [
      "PlayStation",
      "Xbox",
      "Limpeza e manutenção preventiva",
      "Reparos de HDMI",
      "Problemas de inicialização",
      "Manutenção de controles",
    ],
  },
  {
    icon: Stethoscope,
    title: "Diagnóstico especializado",
    short: "Diagnóstico",
    intent: "diagnostic",
    accent: "34 211 238",
    items: [
      "Análise técnica",
      "Identificação de defeitos",
      "Avaliação de componentes",
      "Orçamentos personalizados",
    ],
  },
];

const n = services.length;

/** Distância circular entre o cartão i e o ativo, em [-n/2, n/2). */
function offset(i: number, active: number) {
  let d = (i - active) % n;
  if (d < -n / 2) d += n;
  if (d >= n / 2) d -= n;
  return d;
}

export function Services() {
  const [active, setActive] = useState(0);
  const go = (dir: number) => setActive((a) => (a + dir + n) % n);
  const current = services[active];

  return (
    <Section
      id="servicos"
      eyebrow="Nossos serviços"
      title={<>Reparos certos para cada tipo de equipamento.</>}
      description="Gire o carrossel e escolha o seu aparelho."
    >
      {/* Carrossel 3D */}
      <div
        role="group"
        aria-roledescription="carrossel"
        aria-label="Categorias de serviço"
        tabIndex={0}
        onKeyDown={(ev) => {
          if (ev.key === "ArrowLeft") go(-1);
          if (ev.key === "ArrowRight") go(1);
        }}
        className="relative mx-auto -mt-2 h-[340px] max-w-5xl select-none sm:h-[420px]"
        style={{ perspective: "1300px" }}
      >
        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d" }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -40) go(1);
            else if (info.offset.x > 40) go(-1);
          }}
        >
          {services.map((s, i) => {
            const d = offset(i, active);
            const abs = Math.abs(d);
            const hidden = abs >= 2;
            return (
              <motion.button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                aria-label={s.title}
                aria-current={d === 0}
                tabIndex={hidden ? -1 : 0}
                initial={false}
                animate={{
                  x: `${d * 108}%`,
                  z: -abs * 150,
                  rotateY: d * -38,
                  rotateZ: d * 3,
                  scale: d === 0 ? 1 : 0.9,
                  opacity: hidden ? 0 : 1,
                  filter: d === 0 ? "brightness(1)" : "brightness(0.5)",
                }}
                transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
                style={{
                  ["--accent" as string]: s.accent,
                  zIndex: 10 - abs,
                  pointerEvents: hidden ? "none" : "auto",
                }}
                className="absolute left-1/2 top-1/2 -ml-[105px] -mt-[150px] h-[300px] w-[210px] sm:-ml-[135px] sm:-mt-[185px] sm:h-[370px] sm:w-[270px]"
              >
                <span
                  className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(165deg,rgb(var(--accent)/0.38)_0%,#111827_48%,#0a0e16_100%)] p-5 text-left shadow-[0_40px_90px_-30px_rgb(var(--accent)/0.75)] ${
                    d === 0 ? "animate-float" : ""
                  }`}
                >
                  <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/60">
                    <span className="tabular-nums">0{i + 1}</span>
                    <span>Nonitro Lab</span>
                  </span>
                  <span className="relative flex flex-1 items-center justify-center">
                    <span className="absolute size-40 rounded-full bg-[rgb(var(--accent)/0.45)] blur-3xl" />
                    <s.icon
                      className="relative size-28 text-white drop-shadow-[0_0_24px_rgb(var(--accent)/0.9)] sm:size-36"
                      strokeWidth={0.9}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
                    {s.short}
                  </span>
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,transparent_30%)]" />
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Categoria anterior"
          className="absolute left-0 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-bg/70 text-text backdrop-blur transition-colors hover:bg-bg-raised sm:left-4"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Próxima categoria"
          className="absolute right-0 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-bg/70 text-text backdrop-blur transition-colors hover:bg-bg-raised sm:right-4"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Detalhe da categoria ativa */}
      <div className="mx-auto mt-6 min-h-[17rem] max-w-3xl sm:mt-8 sm:min-h-[13rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h3 className="text-2xl font-semibold text-text sm:text-3xl">
              {current.title}
            </h3>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {current.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-bg-surface/70 px-3.5 py-1.5 text-sm text-text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink(whatsappMessages[current.intent])}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-7"
            >
              Orçar {current.short.toLowerCase()}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lista completa para leitores de tela e buscadores */}
      <div className="sr-only">
        {services.map((s) => (
          <div key={s.title}>
            <h3>{s.title}</h3>
            <ul>
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
