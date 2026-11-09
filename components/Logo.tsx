import { siteConfig } from "@/lib/site-config";

type Variant = "mark" | "wordmark" | "full";

type Props = {
  variant?: Variant;
  className?: string;
  /** Altura em CSS (ex.: "2.25rem"). Opcional — cada variante tem um default. */
  height?: string;
};

/**
 * Logomarca oficial da Nonitro Lab.
 *
 * Ativos vetoriais entregues pelo cliente:
 *   • /brand/nonitro-mark.svg      — só o monograma N (353×317)
 *   • /brand/nonitro-wordmark.svg  — só o texto NONITRO LAB (736×167)
 *
 * Variantes:
 *   • "mark"     → só o monograma N
 *   • "wordmark" → só o texto NONITRO LAB
 *   • "full"     → monograma + wordmark lado a lado
 */
export function Logo({ variant = "mark", className = "", height }: Props) {
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
