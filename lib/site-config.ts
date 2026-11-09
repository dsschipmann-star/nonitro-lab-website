/**
 * Configuração central da Nonitro Lab.
 *
 * Tudo que é informação comercial (endereço, canais de contato, textos
 * institucionais) mora aqui. Os componentes NUNCA guardam esses dados
 * diretamente — assim um ajuste futuro é feito em um só lugar.
 *
 * Valores vazios por padrão quando não temos confirmação do cliente
 * (telefone, Instagram, CNPJ). O rodapé e os CTAs se adaptam.
 */

export type SiteConfig = typeof siteConfig;

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nonitrolab.com.br";

export const siteConfig = {
  name: "Nonitro Lab",
  shortName: "Nonitro",
  monogram: "N",
  tagline: "Tecnologia em boas mãos.",
  description:
    "Assistência técnica especializada em celulares, computadores, notebooks e consoles em São José — SC. Diagnóstico preciso, reparos profissionais e transparência em cada etapa.",
  shortDescription:
    "Assistência técnica especializada em eletrônicos. Diagnóstico, reparo e devolução com transparência do início ao fim.",

  url: rawSiteUrl.replace(/\/+$/, ""),

  location: {
    neighborhood: "Ipiranga",
    city: "São José",
    state: "SC",
    country: "BR",
    region: "Grande Florianópolis",
  },

  contact: {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  },

  nav: [
    { href: "#inicio", label: "Início" },
    { href: "#servicos", label: "Serviços" },
    { href: "#diferenciais", label: "Diferenciais" },
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#duvidas", label: "Dúvidas" },
  ],

  keywords: [
    "assistência técnica São José SC",
    "conserto de celular São José",
    "manutenção de videogame",
    "conserto de notebook São José",
    "reparo de PlayStation",
    "assistência técnica Ipiranga São José",
    "troca de tela",
    "diagnóstico de hardware",
    "upgrade de SSD",
    "Nonitro Lab",
  ],
} as const;

export const siteUrl = siteConfig.url;
