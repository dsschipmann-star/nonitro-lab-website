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
    // Número no formato internacional (DDI 55 + DDD + número), só dígitos.
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5548999743950",
    instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "@nonitrolab",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  },

  /**
   * Agregado das avaliações reais dos clientes. Fonte: Google.
   * Atualizar manualmente conforme a ficha for recebendo novas avaliações.
   */
  reviews: {
    average: 5.0,
    count: 93,
    source: "Google",
  },

  /**
   * Depoimentos reais exibidos no site. Transcritos do Google quase
   * na íntegra. Edições mínimas:
   *   • Remoção de nomes de ex-colaboradores quando citados.
   *   • Pequenas correções ortográficas, mantendo o tom do cliente.
   */
  testimonials: [
    {
      name: "Alessandro Carvalho",
      rating: 5,
      text: "O atendimento foi excepcional. Nível de atenção e educação muito acima da média, prestatividade e competência.",
      when: "há 4 meses",
    },
    {
      name: "João Pedro Nunes Barbieri",
      rating: 5,
      text: "Realizei troca de vidro da câmera (estava em péssimo estado pois quebrou há muitos meses) e reparo no conector de carregamento. Câmera ficou perfeita e celular voltou a carregar rapidinho como era antes. Serviço efetuado bem rápido e com valor justo e condizente.",
      when: "há 3 meses",
    },
    {
      name: "Henrique Mendonça Alves Vieira",
      rating: 5,
      text: "Deixei meu notebook para a troca de pasta térmica com o Mateus. Além do procedimento ter sido MUITO rápido, pessoal super acolhedor e receptivo. Limparam todo o note e me devolveram brilhando! Aplicaram uma pasta térmica nova de qualidade.",
      when: "há 4 meses",
    },
    {
      name: "Yasmim Santos",
      rating: 5,
      text: "Ótima assistência, diria perfeita na verdade. Me ajudaram muito — comprei um celular e 1 hora depois foi bloqueado, achei que nem teria mais solução, até que achei essa assistência e eles me deram todo o suporte necessário.",
      when: "há 4 meses",
    },
    {
      name: "Churrascaria Braza",
      rating: 5,
      text: "Saio de longe só pra fazer serviços com vocês. Qualidade e preço bate de frente com qualquer loja de alto padrão.",
      when: "há 8 meses",
    },
    {
      name: "Valdir Batista",
      rating: 5,
      text: "Serviço pra relógio de corrida que recomendo. Ótimo atendimento! Pensei que meu relógio era placa; após avaliação o técnico me ofereceu uma troca de bateria pra ver se não era a causa do problema. Após a troca, resultado positivo e preço justo.",
      when: "há 1 ano",
    },
    {
      name: "Marilene Schutz da Silva",
      rating: 5,
      text: "Satisfeita com o serviço, Mateus foi muito atencioso e prestativo, super indico a empresa!",
      when: "há 1 ano",
    },
    {
      name: "Natan Marçal",
      rating: 5,
      text: "São muito empenhados e atenciosos, estou extremamente satisfeito.",
      when: "há 1 ano",
    },
    {
      name: "Eloy Luchtenberg",
      rating: 5,
      text: "Apenas uma palavra para definir esta empresa: HONESTIDADE.",
      when: "há 1 ano",
    },
  ] as ReadonlyArray<{
    name: string;
    rating: 1 | 2 | 3 | 4 | 5;
    text: string;
    when: string;
  }>,

  nav: [
    { href: "#inicio", label: "Início" },
    { href: "#servicos", label: "Serviços" },
    { href: "#diferenciais", label: "Diferenciais" },
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#depoimentos", label: "Depoimentos" },
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
