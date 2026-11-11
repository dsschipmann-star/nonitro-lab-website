import type { ReactNode } from "react";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = "center",
}: Props) {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <section
      id={id}
      className={`relative py-16 sm:py-24 lg:py-28 ${className ?? ""}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="container">
        {(eyebrow || title || description) && (
          <header className={`mx-auto mb-10 sm:mb-14 flex max-w-2xl flex-col gap-4 ${alignCls}`}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && (
              <h2
                id={id ? `${id}-title` : undefined}
                className="text-3xl font-semibold text-gradient sm:text-4xl lg:text-5xl"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-balance text-base text-text-muted sm:text-lg">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
