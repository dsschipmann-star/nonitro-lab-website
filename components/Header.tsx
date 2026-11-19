"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      {/* Barra flutuante de vidro */}
      <div className="glass pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 rounded-full pl-5 pr-2">
        <Link
          href="#inicio"
          className="flex items-center"
          onClick={() => setOpen(false)}
          aria-label="Ir para o topo"
        >
          {/* No mobile só o monograma (compacto); no sm+ a horizontal completa. */}
          <span className="sm:hidden">
            <Logo variant="mark" height="2.25rem" />
          </span>
          <span className="hidden sm:inline-flex">
            <Logo variant="horizontal" height="2.25rem" />
          </span>
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-8 md:flex"
        >
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href={whatsappLink(whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-5 py-2.5 text-sm"
          >
            Solicitar orçamento
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text transition-colors hover:bg-white/10 md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Menu do celular: painel de vidro separado da barra, porque o
          desfoque não funciona dentro de outro elemento desfocado */}
      <div
        id="mobile-menu"
        className={`pointer-events-auto md:hidden ${open ? "block" : "hidden"}`}
      >
        <div className="glass glass-strong mx-auto mt-2 max-w-6xl rounded-3xl">
          <nav
            aria-label="Menu móvel"
            className="flex flex-col gap-1 p-3"
          >
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base text-text-muted transition-colors hover:bg-white/10 hover:text-text"
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappLink(whatsappMessages.default)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full justify-center"
            >
              Solicitar orçamento
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
