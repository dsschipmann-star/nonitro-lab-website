import { siteConfig } from "@/lib/site-config";

/**
 * Dados estruturados Schema.org — LocalBusiness.
 *
 * Mantém apenas os campos que podemos afirmar com segurança sobre a
 * Nonitro Lab. Telefone, endereço completo e horário NÃO são publicados
 * aqui enquanto não confirmados pelo cliente.
 */
export function LocalBusinessJsonLd() {
  const { name, description, url, location, contact, reviews } = siteConfig;

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    areaServed: [
      {
        "@type": "City",
        name: location.city,
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: location.state,
        },
      },
      "Grande Florianópolis",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city,
      addressRegion: location.state,
      addressCountry: location.country,
    },
  };

  if (contact.whatsappNumber) {
    payload.contactPoint = [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: `+${contact.whatsappNumber.replace(/\D/g, "")}`,
        availableLanguage: ["pt-BR"],
        contactOption: "WhatsApp",
      },
    ];
  }

  if (contact.instagramHandle) {
    payload.sameAs = [
      `https://instagram.com/${contact.instagramHandle.replace(/^@/, "")}`,
    ];
  }

  if (reviews.count > 0) {
    payload.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviews.average.toFixed(1),
      reviewCount: reviews.count,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
