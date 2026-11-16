"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  MessageSquareText,
  PackageCheck,
  ClipboardList,
  Hammer,
  Truck,
  Info,
} from "lucide-react";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

const steps = [
  {
    icon: MessageSquareText,
    title: "Entre em contato",
    text: "Informe o equipamento e o defeito pelo WhatsApp. Nossa equipe orienta os próximos passos.",
  },
  {
    icon: PackageCheck,
    title: "Combine o envio",
    text: "Orientamos sobre a entrega ou coleta do aparelho, conforme a logística previamente acordada.",
  },
  {
    icon: ClipboardList,
    title: "Diagnóstico e orçamento",
    text: "Nossa equipe analisa o equipamento e apresenta a proposta com clareza sobre peças e serviço.",
  },
  {
    icon: Hammer,
    title: "Reparo autorizado",
    text: "O serviço é executado somente após a aprovação do cliente, com acompanhamento das etapas.",
  },
  {
    icon: Truck,
    title: "Devolução",
    text: "O equipamento é devolvido conforme o procedimento combinado, com toda a documentação do serviço.",
  },
];

/**
 * "Como funciona" em trilho horizontal: a seção fica presa na tela e o
 * scroll vertical desliza os cartões para o lado. Com movimento reduzido,
 * vira uma lista vertical comum.
 */
export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  const distance = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduce(mq.matches);
      const track = trackRef.current;
      if (track) {
        distance.set(Math.max(0, track.scrollWidth - window.innerWidth));
      }
    };
    sync();
    const ro = new ResizeObserver(sync);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", sync);
    mq.addEventListener("change", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      mq.removeEventListener("change", sync);
    };
  }, [distance]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  const x = useTransform(() => -p.get() * distance.get());
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  const header = (
    <header className="container flex flex-col gap-3">
      <span className="eyebrow self-start">Como funciona</span>
      <h2
        id="como-funciona-title"
        className="max-w-3xl text-balance text-4xl font-semibold leading-[1.02] text-gradient sm:text-5xl lg:text-6xl"
      >
        Um fluxo simples, cinco etapas claras.
      </h2>
      <p className="max-w-xl text-base text-text-muted sm:text-lg">
        Da primeira mensagem à devolução do aparelho, você acompanha cada passo.
      </p>
    </header>
  );

  const cards = (
    <>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative flex w-[78vw] max-w-[380px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-bg-surface/70 p-6 backdrop-blur-sm sm:w-[380px] sm:p-7"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-6 font-display text-[9rem] font-semibold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.13)]"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-[0_10px_30px_-10px_rgba(22,139,255,0.6)]">
            <step.icon className="size-5" aria-hidden="true" />
          </div>
          <div className="mt-10 sm:mt-16">
            <h3 className="text-xl font-semibold text-text sm:text-2xl">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
              {step.text}
            </p>
          </div>
        </li>
      ))}
      <li className="flex w-[78vw] max-w-[380px] shrink-0 flex-col justify-between rounded-3xl border border-brand-blue/30 bg-gradient-to-br from-brand-blue/15 via-bg-surface/60 to-brand-purple/15 p-6 sm:w-[380px] sm:p-7">
        <Info className="size-6 text-brand-blueSoft" aria-hidden="true" />
        <div className="mt-8">
          <p className="text-sm leading-relaxed text-text sm:text-base">
            Nosso laboratório opera{" "}
            <strong className="font-semibold text-white">
              sem atendimento presencial ao público
            </strong>
            . Todo o processo é organizado digitalmente, oferecendo
            comodidade, segurança e transparência.
          </p>
          <a
            href={whatsappLink(whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 w-full"
          >
            Iniciar atendimento
          </a>
        </div>
      </li>
    </>
  );

  if (reduce) {
    return (
      <section
        id="como-funciona"
        aria-labelledby="como-funciona-title"
        className="relative py-16 sm:py-24"
      >
        {header}
        <ol className="container mt-10 flex flex-wrap gap-4">{cards}</ol>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      aria-labelledby="como-funciona-title"
      className="relative h-[340vh]"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-8 overflow-hidden pt-16 sm:gap-12">
        {header}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="w-max will-change-transform"
        >
          <ol className="flex gap-4 px-4 sm:gap-6 sm:px-6 lg:px-[max(2rem,calc((100vw-1280px)/2+2rem))]">
            {cards}
          </ol>
        </motion.div>
        <div className="container">
          <div className="h-px w-full bg-line">
            <motion.div style={{ width: bar }} className="h-px bg-brand-gradient" />
          </div>
        </div>
      </div>
    </section>
  );
}
