"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function FinalCta() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/20 blur-[120px]" />
        <div className="absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-brand-blue/20 blur-[100px]" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-bg-surface via-bg-raised to-bg-surface p-6 text-center shadow-card sm:p-10 lg:p-16"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 -bottom-px h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent"
          />

          <h2
            id="cta-title"
            className="text-balance text-[1.75rem] font-semibold leading-tight text-gradient sm:text-4xl lg:text-5xl"
          >
            Seu equipamento merece um cuidado especializado.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-text-muted sm:mt-5 sm:text-lg">
            Conte com a Nonitro Lab para diagnosticar e reparar seu
            equipamento com atenção, transparência e responsabilidade.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
            <a
              href={whatsappLink(whatsappMessages.specialist)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Conversar com um especialista
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
