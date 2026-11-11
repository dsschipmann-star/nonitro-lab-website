"use client";

import { motion } from "framer-motion";
import {
  MessageSquareText,
  PackageCheck,
  ClipboardList,
  Hammer,
  Truck,
  Info,
} from "lucide-react";
import { Section } from "./Section";
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

export function HowItWorks() {
  return (
    <Section
      id="como-funciona"
      eyebrow="Como funciona"
      title="Um fluxo simples, cinco etapas claras."
      description="Da primeira mensagem à devolução do aparelho, você acompanha cada passo."
    >
      <ol className="relative mx-auto max-w-4xl">
        {/* Linha vertical (desktop) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-brand-blue/40 via-brand-purple/30 to-transparent md:block"
        />
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.55,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mb-3 flex gap-4 rounded-2xl border border-line bg-bg-surface/60 p-4 last:mb-0 sm:mb-4 sm:gap-5 sm:p-5 md:gap-6 md:p-6"
          >
            <div className="relative shrink-0">
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-[0_10px_30px_-10px_rgba(22,139,255,0.6)] sm:size-12">
                <step.icon className="size-5" aria-hidden="true" />
              </div>
              <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full border border-line bg-bg text-[10px] font-semibold text-text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-text sm:text-lg">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">
                {step.text}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="mx-auto mt-8 max-w-4xl sm:mt-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 via-bg-surface/50 to-brand-purple/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <Info
              className="mt-0.5 size-5 shrink-0 text-brand-blueSoft"
              aria-hidden="true"
            />
            <p className="text-sm text-text">
              Nosso laboratório opera{" "}
              <strong className="font-semibold text-white">
                sem atendimento presencial ao público
              </strong>
              . Todo o processo é organizado digitalmente, oferecendo
              comodidade, segurança e transparência.
            </p>
          </div>
          <a
            href={whatsappLink(whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full shrink-0 sm:w-auto"
          >
            Iniciar atendimento
          </a>
        </div>
      </div>
    </Section>
  );
}
