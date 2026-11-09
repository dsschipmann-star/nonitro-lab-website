import { siteConfig } from "@/lib/site-config";

type Props = {
  variant?: "full" | "mark";
  className?: string;
};

/**
 * Marca da Nonitro Lab.
 *
 * Esta é uma representação tipográfica inicial (monograma "N" dentro de um
 * container com gradiente e o wordmark ao lado). Quando a logomarca oficial
 * for entregue em SVG, basta substituir este componente mantendo o mesmo nome.
 */
export function Logo({ variant = "full", className }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label={siteConfig.name}
    >
      <span
        aria-hidden="true"
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(121,87,255,0.6)]"
      >
        {siteConfig.monogram}
        <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/15" />
      </span>
      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-text">
            {siteConfig.name}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-dim">
            Tech Lab
          </span>
        </span>
      )}
    </span>
  );
}
