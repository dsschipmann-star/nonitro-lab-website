"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Section } from "./Section";
import { siteConfig } from "@/lib/site-config";

function Stars({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${count} de 5 estrelas`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < count
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-text-dim"
          }`}
          aria-hidden="true"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function Testimonials() {
  const { testimonials, reviews } = siteConfig;

  return (
    <Section
      id="depoimentos"
      eyebrow="Depoimentos"
      title="Confiança construída cliente por cliente."
      description="O que dizem as pessoas que confiaram seus aparelhos à nossa bancada."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-10 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-line bg-bg-surface/60 px-5 py-4 text-center backdrop-blur-sm sm:mb-12 sm:flex-row sm:gap-4 sm:px-6 sm:py-5 sm:text-left"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-gradient sm:text-4xl">
            {reviews.average.toFixed(1).replace(".", ",")}
          </span>
          <Stars count={Math.round(reviews.average)} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-text">
            {reviews.count} avaliações no {reviews.source}
          </p>
          <p className="text-xs text-text-dim">
            Média real, construída ao longo de anos de atendimento.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={`${t.name}-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.55,
              delay: Math.min(i, 5) * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="surface-card relative flex h-full flex-col"
          >
            <Quote
              className="absolute right-5 top-5 size-6 text-brand-blue/20"
              aria-hidden="true"
            />
            <Stars count={t.rating} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
              {t.text}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-raised text-xs font-semibold text-brand-blueSoft ring-1 ring-inset ring-brand-blue/30"
                aria-hidden="true"
              >
                {initialsFor(t.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">
                  {t.name}
                </p>
                <p className="text-xs text-text-dim">{t.when}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
