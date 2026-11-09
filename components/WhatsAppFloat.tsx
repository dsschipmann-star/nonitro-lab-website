"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappLink(whatsappMessages.default)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir conversa no WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-12px_rgba(22,139,255,0.6)] transition-all duration-300 will-change-transform hover:-translate-y-0.5 sm:bottom-8 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="relative flex size-6 items-center justify-center">
        <span className="absolute inset-0 animate-pulse-soft rounded-full bg-white/30" />
        <MessageCircle className="relative size-4" aria-hidden="true" />
      </span>
      <span className="hidden sm:inline">Falar no WhatsApp</span>
    </a>
  );
}
