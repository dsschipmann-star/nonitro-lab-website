const words = [
  "Celulares",
  "Notebooks",
  "Computadores",
  "PlayStation",
  "Xbox",
  "Controles",
];

/** Faixa de texto gigante em movimento contínuo, só decorativa. */
export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={w} className="flex items-center">
          <span
            className={`px-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-none tracking-tight sm:px-10 ${
              i % 2 === 0
                ? "text-gradient"
                : "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]"
            }`}
          >
            {w}
          </span>
          <span className="block size-3 rotate-45 bg-brand-gradient sm:size-4" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-line py-8 sm:py-10 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
