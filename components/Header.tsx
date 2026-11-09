"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link
          href="#inicio"
          className="flex items-center"
          onClick={() => setOpen(false)}
          aria-label="Ir para o topo"
        >
          <Logo variant="mark" height="2.25rem" />
          <span className="ml-2.5 hidden text-sm font-semibold tracking-tight text-text sm:inline">
            Nonitro Lab
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
            className="btn-primary text-sm"
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
          className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-bg-surface/60 text-text transition-colors hover:border-line-strong md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden ${open ? "block" : "hidden"}`}
      >
        <div className="border-t border-line bg-bg/95 backdrop-blur-xl">
          <nav
            aria-label="Menu móvel"
            className="container flex flex-col gap-1 py-6"
          >
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-text-muted transition-colors hover:bg-bg-surface hover:text-text"
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappLink(whatsappMessages.default)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3 w-full justify-center"
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
