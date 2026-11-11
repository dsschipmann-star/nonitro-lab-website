import { siteConfig } from "@/lib/site-config";

type Variant = "mark" | "wordmark" | "full" | "horizontal";

type Props = {
  variant?: Variant;
  className?: string;
  /** Altura em CSS (ex.: "2.25rem"). Opcional — cada variante tem um default. */
  height?: string;
  /** "horizontal" apenas: mostra a tagline sob o wordmark. Default: false. */
  withTagline?: boolean;
};

/**
 * Logomarca oficial da Nonitro Lab.
 *
 * Ativos vetoriais entregues pelo cliente:
 *   • /brand/nonitro-mark.svg      — só o monograma N (353×317)
 *   • /brand/nonitro-wordmark.svg  — só o texto NONITRO LAB (736×167)
 *
 * Variantes:
 *   • "mark"       → só o monograma N
 *   • "wordmark"   → só o texto NONITRO LAB
 *   • "full"       → monograma + wordmark lado a lado (sem divisor)
 *   • "horizontal" → monograma | divisor | wordmark (+ tagline opcional)
 */
export function Logo({
  variant = "mark",
  className = "",
  height,
  withTagline = false,
}: Props) {
  if (variant === "mark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/brand/nonitro-mark.svg"
        alt={siteConfig.name}
        width={353}
        height={317}
        className={`block w-auto shrink-0 ${className}`}
        style={{ height: height ?? "2.25rem" }}
      />
    );
  }

  if (variant === "wordmark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/brand/nonitro-wordmark.svg"
        alt={siteConfig.name}
        width={736}
        height={167}
        className={`block w-auto shrink-0 ${className}`}
        style={{ height: height ?? "2rem" }}
      />
    );
  }

  if (variant === "horizontal") {
    const h = height ?? "2.25rem";
    return (
      <span
        className={`inline-flex items-center ${className}`}
        aria-label={siteConfig.name}
        role="img"
        style={{ gap: `calc(${h} * 0.32)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/nonitro-mark.svg"
          alt=""
          width={353}
          height={317}
          className="block w-auto shrink-0"
          style={{ height: h }}
          aria-hidden="true"
        />
        <span
          aria-hidden="true"
          className="block shrink-0 bg-gradient-to-b from-brand-blue/40 via-brand-blueSoft to-brand-purple/40"
          style={{ height: `calc(${h} * 0.85)`, width: "1px" }}
        />
        <span className="flex flex-col justify-center" style={{ gap: `calc(${h} * 0.08)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/nonitro-wordmark.svg"
            alt=""
            width={736}
            height={167}
            className="block w-auto shrink-0"
            style={{ height: `calc(${h} * 0.55)` }}
            aria-hidden="true"
          />
          {withTagline && (
            <span
              className="whitespace-nowrap font-light uppercase text-text-dim"
              style={{
                fontSize: `calc(${h} * 0.16)`,
                letterSpacing: "0.28em",
                lineHeight: 1,
              }}
            >
              Celulares · Informática · Games
            </span>
          )}
        </span>
      </span>
    );
  }

  // full → mark + wordmark lado a lado
  const h = height ?? "2.5rem";
  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={siteConfig.name}
      role="img"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/nonitro-mark.svg"
        alt=""
        width={353}
        height={317}
        className="block w-auto shrink-0"
        style={{ height: h }}
        aria-hidden="true"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/nonitro-wordmark.svg"
        alt=""
        width={736}
        height={167}
        className="block w-auto shrink-0"
        style={{ height: `calc(${h} * 0.62)` }}
        aria-hidden="true"
      />
    </span>
  );
}
