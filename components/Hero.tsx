"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Cpu } from "lucide-react";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.06 * i },
  }),
};

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-24 lg:pb-32"
      aria-labelledby="hero-title"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="absolute inset-x-0 top-0 h-[480px] bg-dots mask-fade-b opacity-60" />
        <div className="absolute left-1/2 top-16 -z-10 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-[120px]" />
        <div className="absolute left-[15%] top-40 -z-10 h-[320px] w-[320px] rounded-full bg-brand-purple/25 blur-[100px]" />
      </div>

      <div className="container relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.span
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="eyebrow"
          >
            <Sparkles className="size-3.5 text-brand-blueSoft" aria-hidden="true" />
            Laboratório técnico · {siteConfig.location.city} — {siteConfig.location.state}
          </motion.span>

          <motion.h1
            id="hero-title"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="mt-5 sm:mt-6 text-balance text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-gradient sm:text-6xl lg:text-7xl"
          >
            Tecnologia em boas mãos.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-2xl text-balance text-base text-text-muted sm:text-lg"
          >
            Assistência técnica especializada em celulares, computadores,
            notebooks e consoles. Diagnóstico preciso, reparos profissionais
            e transparência em cada etapa.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-8 sm:mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <a
              href={whatsappLink(whatsappMessages.default)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              Solicitar orçamento
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a href="#servicos" className="btn-ghost w-full sm:w-auto">
              Conhecer nossos serviços
            </a>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUp}
            className="mt-10 sm:mt-14 grid w-full max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3"
          >
            {[
              { icon: ShieldCheck, label: "Processo transparente" },
              { icon: Cpu, label: "Diagnóstico técnico" },
              { icon: Sparkles, label: "Comunicação digital" },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-line bg-bg-surface/60 px-4 py-3 text-sm text-text-muted"
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-raised text-brand-blueSoft">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>{label}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Decorative tech panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
          className="relative mx-auto mt-14 sm:mt-20 w-full max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-surface/50 p-1.5 shadow-card">
            <div className="rounded-xl bg-gradient-to-b from-bg-raised/60 to-bg-surface/60 p-5 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 lg:gap-10">
                {[
                  { k: "Celulares", v: "Troca de tela · Bateria · Placa" },
                  { k: "PCs & Notebooks", v: "Hardware · Upgrade · Sistema" },
                  { k: "Consoles", v: "PlayStation · Xbox · Controles" },
                ].map((item) => (
                  <div key={item.k}>
                    <p className="text-[11px] sm:text-xs uppercase tracking-widest text-text-dim">
                      {item.k}
                    </p>
                    <p className="mt-2 text-sm text-text">{item.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent" />
              <div className="mt-5 sm:mt-6 flex flex-col gap-3 text-xs text-text-dim sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 animate-pulse-soft rounded-full bg-brand-blueSoft" />
                  Sistema de acompanhamento
                </span>
                <span>Comunicação via WhatsApp</span>
                <span>{siteConfig.location.neighborhood} · {siteConfig.location.city}/{siteConfig.location.state}</span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-x-10 -bottom-10 h-40 bg-gradient-to-t from-bg to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
