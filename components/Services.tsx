"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Stethoscope,
  ArrowUpRight,
} from "lucide-react";
import { Section } from "./Section";
import { whatsappLink, whatsappMessages, type WhatsAppIntent } from "@/lib/whatsapp";

type Service = {
  icon: typeof Smartphone;
  title: string;
  intent: WhatsAppIntent;
  items: string[];
};

const services: Service[] = [
  {
    icon: Smartphone,
    title: "Smartphones",
    intent: "smartphone",
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
    intent: "computer",
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
    intent: "console",
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
    intent: "diagnostic",
    items: [
      "Análise técnica",
      "Identificação de defeitos",
      "Avaliação de componentes",
      "Orçamentos personalizados",
    ],
  },
];

export function Services() {
  return (
    <Section
      id="servicos"
      eyebrow="Nossos serviços"
      title={<>Reparos certos para cada tipo de equipamento.</>}
      description="Atendemos as principais categorias de eletrônicos de consumo com atenção técnica individualizada por tipo de aparelho."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((service, i) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="surface-card group flex flex-col"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-gradient/20 text-brand-blueSoft ring-1 ring-inset ring-brand-blue/30">
                <service.icon className="size-6" aria-hidden="true" />
              </div>
              <a
                href={whatsappLink(whatsappMessages[service.intent])}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-line bg-bg-raised/60 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-line-strong hover:text-text"
                aria-label={`Solicitar orçamento para ${service.title}`}
              >
                Orçar
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-text">
              {service.title}
            </h3>

            <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {service.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-brand-blueSoft/80"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex-1" />

            <a
              href={whatsappLink(whatsappMessages[service.intent])}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 self-start text-sm font-medium text-brand-blueSoft transition-colors hover:text-white"
            >
              Falar sobre {service.title.toLowerCase()}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>

            {/* Subtle glow on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
