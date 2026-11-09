"use client";

import { motion } from "framer-motion";
import {
  Eye,
  MessagesSquare,
  Wrench,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Section } from "./Section";

const differentials = [
  {
    icon: Eye,
    title: "Transparência do início ao fim",
    text: "Etapas de recebimento, orçamento, reparo, envio e documentação fiscal registradas e compartilhadas por WhatsApp.",
  },
  {
    icon: MessagesSquare,
    title: "Atendimento organizado",
    text: "Comunicação digital, com acompanhamento das etapas do serviço em canal direto com a equipe.",
  },
  {
    icon: Wrench,
    title: "Conhecimento técnico",
    text: "Atuação especializada em diferentes categorias de eletrônicos — do smartphone ao console.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia de serviço",
    text: "Informações sobre garantia conforme o tipo de reparo, peça utilizada e condições apresentadas no orçamento.",
  },
  {
    icon: Truck,
    title: "Comodidade",
    text: "Recebimento e devolução dos aparelhos mediante logística previamente combinada com o cliente.",
  },
];

export function Differentials() {
  return (
    <Section
      id="diferenciais"
      eyebrow="Diferenciais"
      title="Processo técnico, comunicação clara."
      description="Operamos como um laboratório técnico: cada equipamento recebe um protocolo próprio, acompanhado por canal direto do começo ao fim."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {differentials.map((d, i) => (
          <motion.div
            key={d.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.55,
              delay: i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="surface-card"
          >
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-bg-raised text-brand-purpleSoft ring-1 ring-inset ring-brand-purple/30">
              <d.icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-text">{d.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {d.text}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
