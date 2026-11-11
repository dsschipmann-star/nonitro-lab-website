"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Section } from "./Section";

type QA = { q: string; a: React.ReactNode };

const faqs: QA[] = [
  {
    q: "A Nonitro Lab possui atendimento presencial?",
    a: (
      <>
        Não. Nosso laboratório opera sem atendimento presencial ao público.
        Todo o processo — da primeira conversa à devolução — é organizado
        digitalmente, pelo WhatsApp, com logística de envio ou coleta
        previamente combinada.
      </>
    ),
  },
  {
    q: "Como envio meu aparelho para conserto?",
    a: (
      <>
        Entre em contato pelo WhatsApp informando o equipamento e o defeito.
        Nossa equipe orienta o procedimento de envio ou coleta mais adequado
        ao seu caso. Para condições específicas de logística, consulte a
        equipe antes do envio.
      </>
    ),
  },
  {
    q: "O orçamento é gratuito?",
    a: (
      <>
        As condições de orçamento variam conforme o tipo de equipamento e a
        complexidade do defeito. Antes de qualquer serviço, apresentamos a
        proposta por escrito e aguardamos sua aprovação. Entre em contato
        pelo WhatsApp para confirmar as condições do seu caso.
      </>
    ),
  },
  {
    q: "Quanto tempo demora um reparo?",
    a: (
      <>
        O prazo depende do tipo de equipamento, do defeito identificado e da
        disponibilidade de peças. Após o diagnóstico, informamos a previsão
        de conclusão junto do orçamento.
      </>
    ),
  },
  {
    q: "Quais equipamentos vocês consertam?",
    a: (
      <>
        Atendemos smartphones, computadores, notebooks e consoles
        (PlayStation e Xbox), incluindo serviços de diagnóstico, troca de
        peças, upgrades e manutenção preventiva. Em caso de dúvida sobre o
        seu modelo, consulte a equipe.
      </>
    ),
  },
  {
    q: "Os serviços possuem garantia?",
    a: (
      <>
        Sim — a garantia é informada no orçamento e varia conforme o tipo de
        reparo, a peça utilizada e as condições apresentadas no momento da
        aprovação do serviço.
      </>
    ),
  },
  {
    q: "Posso acompanhar o andamento do conserto?",
    a: (
      <>
        Sim. O acompanhamento é feito pelo WhatsApp: você recebe atualizações
        das etapas de recebimento, diagnóstico, reparo e devolução em um
        canal direto com a equipe.
      </>
    ),
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: (
      <>
        As formas de pagamento aceitas são informadas junto do orçamento.
        Para confirmar as opções disponíveis para o seu caso, fale com a
        equipe pelo WhatsApp.
      </>
    ),
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="duvidas"
      eyebrow="Dúvidas frequentes"
      title="Respostas diretas para quem vai nos enviar um equipamento."
      description="Se a sua dúvida não estiver aqui, fale com a nossa equipe pelo WhatsApp."
    >
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-bg-surface/50">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-bg-raised/40 sm:gap-4 sm:px-6 sm:py-5"
                >
                  <span className="text-sm font-medium text-text sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-bg-raised/60 text-text-muted transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-brand-blueSoft" : ""
                    }`}
                  >
                    <Plus className="size-4" />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 pr-6 text-sm leading-relaxed text-text-muted sm:px-6 sm:pb-6 sm:pr-8 sm:text-base">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
