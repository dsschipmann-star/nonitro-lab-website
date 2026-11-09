# Nonitro Lab — Landing page oficial

Landing page premium da **Nonitro Lab**, assistência técnica especializada em
celulares, computadores, notebooks e consoles em São José — SC.

Construída com **Next.js 14 (App Router) + TypeScript + Tailwind CSS +
Framer Motion**. Pronta para deploy na Vercel.

---

## Stack

- [Next.js 14](https://nextjs.org/) com App Router
- TypeScript (strict)
- Tailwind CSS 3
- Framer Motion
- Lucide Icons
- Google Fonts: **Inter** (corpo) e **Space Grotesk** (display)

## Estrutura

```
nonitro-lab-website/
├── app/
│   ├── layout.tsx              # Metadata global, fontes, body
│   ├── page.tsx                # Composição da landing
│   ├── globals.css             # Design tokens + utilitários
│   ├── not-found.tsx           # 404
│   ├── robots.ts               # robots.txt dinâmico
│   ├── sitemap.ts              # sitemap.xml dinâmico
│   └── politica-de-privacidade/page.tsx
├── components/
│   ├── Header.tsx              # Menu fixo + mobile hamburger
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Differentials.tsx
│   ├── HowItWorks.tsx
│   ├── Faq.tsx
│   ├── FinalCta.tsx
│   ├── Footer.tsx
│   ├── WhatsAppFloat.tsx       # Botão flutuante
│   ├── LocalBusinessJsonLd.tsx # Schema.org
│   ├── Logo.tsx                # Monograma N + wordmark
│   └── Section.tsx             # Wrapper reaproveitável
└── lib/
    ├── site-config.ts          # Todas as informações comerciais
    └── whatsapp.ts             # Links wa.me com mensagens por intenção
```

Qualquer ajuste de textos institucionais, cidade, serviços e links é feito em
`lib/site-config.ts`. Mensagens pré-preenchidas de WhatsApp em `lib/whatsapp.ts`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SITE_URL=https://nonitrolab.com.br
NEXT_PUBLIC_WHATSAPP_NUMBER=5548900000000
NEXT_PUBLIC_INSTAGRAM_HANDLE=nonitrolab
NEXT_PUBLIC_CONTACT_EMAIL=contato@nonitrolab.com.br
```

- **NEXT_PUBLIC_WHATSAPP_NUMBER**: apenas dígitos, iniciando pelo código do
  país (`55`). Se vazio, os CTAs abrem o WhatsApp com a mensagem pré-pronta,
  mas sem número vinculado — útil em preview antes do número final estar
  definido.
- **NEXT_PUBLIC_SITE_URL**: usada em `metadataBase`, `sitemap.xml`, Open Graph
  e dados estruturados.
- **NEXT_PUBLIC_INSTAGRAM_HANDLE** e **NEXT_PUBLIC_CONTACT_EMAIL**: opcionais;
  o rodapé se adapta se forem omitidos.

## Como rodar localmente

Pré-requisitos: **Node 18.17+** (recomendado 20+) e npm.

```bash
npm install
npm run dev
```

Servidor em `http://localhost:3000`.

### Scripts

| Script          | O que faz                                                      |
|-----------------|-----------------------------------------------------------------|
| `npm run dev`   | Servidor de desenvolvimento com hot reload.                     |
| `npm run build` | Gera o build de produção estático sempre que possível.          |
| `npm run start` | Serve o build de produção (`.next`) localmente.                 |
| `npm run lint`  | Roda o ESLint (configuração do Next.js core-web-vitals).        |
| `npm run typecheck` | Verifica tipos com `tsc --noEmit`.                          |

Antes de cada entrega:

```bash
npm run lint
npm run typecheck
npm run build
```

## Design system

- Fundo: `#0B0F17` (grafite); superfícies: `#151B26`.
- Azul elétrico `#168BFF`; roxo tecnológico `#7957FF`.
- Tipografia: **Space Grotesk** (títulos) e **Inter** (corpo).
- Bordas finas, sombras suaves, gradientes discretos.
- Respeita `prefers-reduced-motion`.

Tokens centralizados em `tailwind.config.ts` e `app/globals.css`.

## Acessibilidade e SEO

- `lang="pt-BR"`, estrutura semântica (`main`, `section`, `header`, `footer`,
  `nav`, `ol`, hierarquia de headings).
- `aria-label`, `aria-expanded`, `aria-controls` em componentes interativos.
- `focus-visible` com contorno de alta visibilidade.
- Meta tags completas com Open Graph e Twitter Card (`app/layout.tsx`).
- `sitemap.xml` e `robots.txt` servidos pelo Next (`app/sitemap.ts`,
  `app/robots.ts`).
- Dados estruturados Schema.org **LocalBusiness** em `LocalBusinessJsonLd`.

> ℹ️ Avaliações, certificações, número de clientes, telefone, endereço
> completo, CNPJ e prazos específicos de garantia **não** foram publicados —
> são informações que precisam ser confirmadas com o cliente antes de ir ao
> ar.

## Substituindo a logomarca

Hoje a marca é tipográfica (monograma "N" + wordmark) em
`components/Logo.tsx`. Quando a logomarca oficial em SVG for entregue:

1. Coloque o arquivo em `public/logo.svg`.
2. Substitua o conteúdo de `components/Logo.tsx` por `<img>` ou um SVG
   inline, preservando o nome do componente e o `aria-label`.

## Deploy na Vercel

1. Crie o repositório no GitHub (ver seção abaixo).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Framework: **Next.js** (detectado automaticamente).
4. Cadastre as variáveis de ambiente de `.env.example`.
5. Clique em **Deploy**. A Vercel disponibiliza um domínio provisório
   (`*.vercel.app`) imediatamente; o domínio próprio pode ser conectado
   depois em *Settings → Domains*.

Push na branch `main` dispara deploy de produção; pushes em outras branches
geram deploys de preview automáticos.

## Publicação no GitHub

A partir da raiz do projeto:

```bash
git init
git add .
git commit -m "Nonitro Lab: landing page inicial"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/nonitro-lab-website.git
git push -u origin main
```

Este repositório foi criado a partir dos requisitos do cliente e está pronto
para evolução futura (acompanhamento de ordens de serviço, agendamento de
coleta, área do cliente).

## Licença

Projeto proprietário da Nonitro Lab.
