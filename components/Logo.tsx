import { siteConfig } from "@/lib/site-config";

type Props = {
  variant?: "full" | "mark";
  className?: string;
  /** Largura em CSS (ex.: "11rem", "180px"). Opcional — cada variante tem um default. */
  width?: string;
};

/**
 * Logomarca oficial da Nonitro Lab.
 *
 * Usa a imagem de apresentação enviada pelo cliente
 * (`/brand/nonitro-lab-source.webp`, 1448×1086) recortada via
 * `background-position` para mostrar apenas a área útil da marca:
 *
 *   • variant="mark" → somente o monograma N (com detalhe de controle)
 *   • variant="full" → monograma + wordmark NONITRO LAB + tagline
 *
 * Coordenadas de crop derivadas por análise de luminância da imagem fonte
 * (ver histórico do commit). Quando o cliente entregar os ativos exportados
 * (SVG ou PNG transparente separados), substitua o `background-*` por um
 * `<Image>` apontando para o arquivo final — o restante do site não muda.
 */
export function Logo({ variant = "full", className = "", width }: Props) {
  const common = {
    display: "inline-block",
    backgroundImage: "url(/brand/nonitro-lab-source.webp)",
    backgroundRepeat: "no-repeat",
  } as const;

  if (variant === "mark") {
    // Crop com padding: x=546..892 (w=346), y=237..488 (h=251)
    return (
      <span
        role="img"
        aria-label={siteConfig.name}
        className={`shrink-0 ${className}`}
        style={{
          ...common,
          width: width ?? "2.5rem",
          aspectRatio: "346 / 251",
          backgroundSize: "418.5% auto",
          backgroundPosition: "49.55% 28.38%",
        }}
      />
    );
  }

  // full — crop com padding: x=312..1135 (w=823), y=227..776 (h=549)
  return (
    <span
      role="img"
      aria-label={siteConfig.name}
      className={`shrink-0 ${className}`}
      style={{
        ...common,
        width: width ?? "10rem",
        aspectRatio: "823 / 549",
        backgroundSize: "175.9% auto",
        backgroundPosition: "49.92% 42.27%",
      }}
    />
  );
}
