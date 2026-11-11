"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Facebook, Instagram } from "lucide-react";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

export function SocialDock() {
  const [visible, setVisible] = useState(false);
  const { contact } = siteConfig;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const instagramUrl = contact.instagramHandle
    ? `https://instagram.com/${contact.instagramHandle.replace(/^@/, "")}`
    : null;
  const facebookUrl = contact.facebookUrl || null;

  return (
    <div
      aria-label="Canais de contato da Nonitro Lab"
      className={`fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 transition-all duration-300 sm:bottom-8 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {facebookUrl && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Facebook da Nonitro Lab"
          className="inline-flex size-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-[0_14px_30px_-10px_rgba(24,119,242,0.55)] ring-1 ring-white/10 transition-transform duration-300 will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Facebook className="size-5" aria-hidden="true" />
        </a>
      )}

      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Instagram da Nonitro Lab"
          className="inline-flex size-12 items-center justify-center rounded-full text-white shadow-[0_14px_30px_-10px_rgba(221,42,123,0.55)] ring-1 ring-white/10 transition-transform duration-300 will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          style={{
            background:
              "linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)",
          }}
        >
          <Instagram className="size-5" aria-hidden="true" />
        </a>
      )}

      <a
        href={whatsappLink(whatsappMessages.default)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir conversa no WhatsApp"
        className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-12px_rgba(22,139,255,0.6)] transition-all duration-300 will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <span className="relative flex size-6 items-center justify-center">
          <span className="absolute inset-0 animate-pulse-soft rounded-full bg-white/30" />
          <MessageCircle className="relative size-4" aria-hidden="true" />
        </span>
        <span className="hidden sm:inline">Falar no WhatsApp</span>
      </a>
    </div>
  );
}
