import Link from "next/link";
import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

const servicesCols = [
  "Troca de telas",
  "Reparos de placa",
  "Upgrade de SSD e RAM",
  "Manutenção de consoles",
  "Diagnóstico técnico",
];

export function Footer() {
  const year = new Date().getFullYear();
  const { contact, location } = siteConfig;

  return (
    <footer className="relative border-t border-line bg-bg-soft/60">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-muted">
              {siteConfig.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {contact.whatsappNumber && (
                <a
                  href={whatsappLink(whatsappMessages.default)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-surface/60 px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-line-strong hover:text-text"
                >
                  <MessageCircle className="size-3.5" aria-hidden="true" />
                  WhatsApp
                </a>
              )}
              {contact.instagramHandle && (
                <a
                  href={`https://instagram.com/${contact.instagramHandle.replace(
                    /^@/,
                    "",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-surface/60 px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-line-strong hover:text-text"
                >
                  <Instagram className="size-3.5" aria-hidden="true" />
                  Instagram
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-surface/60 px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-line-strong hover:text-text"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  {contact.email}
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-dim">
              Serviços
            </p>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              {servicesCols.map((s) => (
                <li key={s}>
                  <a
                    href="#servicos"
                    className="transition-colors hover:text-text"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-dim">
              Nonitro Lab
            </p>
            <ul className="mt-4 space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-brand-blueSoft"
                  aria-hidden="true"
                />
                <span>
                  {location.neighborhood}, {location.city} — {location.state}
                </span>
              </li>
              <li>
                <Link
                  href="#duvidas"
                  className="transition-colors hover:text-text"
                >
                  Dúvidas frequentes
                </Link>
              </li>
              <li>
                <Link
                  href="#como-funciona"
                  className="transition-colors hover:text-text"
                >
                  Como funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="transition-colors hover:text-text"
                >
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider my-10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-text-dim sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <p>
            Feito com atenção técnica em {location.city}, {location.state}.
          </p>
        </div>
      </div>
    </footer>
  );
}
