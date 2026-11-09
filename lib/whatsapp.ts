import { siteConfig } from "./site-config";

/**
 * Monta um link wa.me com mensagem pré-preenchida.
 *
 * Se o número ainda não foi configurado (NEXT_PUBLIC_WHATSAPP_NUMBER vazio),
 * devolve um link neutro para a tela inicial do WhatsApp — assim o site segue
 * funcional em preview antes do cliente informar o número oficial.
 */
export function whatsappLink(message: string): string {
  const number = siteConfig.contact.whatsappNumber.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);

  if (!number) {
    // Fallback: abre o WhatsApp sem número vinculado.
    return `https://wa.me/?text=${encoded}`;
  }

  return `https://wa.me/${number}?text=${encoded}`;
}

/** Mensagens padrão por intenção. */
export const whatsappMessages = {
  default:
    "Olá! Vim pelo site da Nonitro Lab e gostaria de solicitar um orçamento.",
  smartphone:
    "Olá! Gostaria de um orçamento para reparo de smartphone.",
  computer:
    "Olá! Gostaria de um orçamento para manutenção de computador ou notebook.",
  console:
    "Olá! Gostaria de um orçamento para manutenção de videogame.",
  diagnostic:
    "Olá! Gostaria de agendar um diagnóstico técnico do meu equipamento.",
  specialist:
    "Olá! Gostaria de conversar com um especialista sobre meu equipamento.",
} as const;

export type WhatsAppIntent = keyof typeof whatsappMessages;
