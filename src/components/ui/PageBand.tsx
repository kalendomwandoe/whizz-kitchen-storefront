import type { ReactNode } from "react";

interface PageBandProps {
  title: string;
  eyebrow?: string;
  text?: string;
  narrow?: boolean;
  children?: ReactNode;
}

export default function PageBand({ title, eyebrow, text, narrow = false, children }: PageBandProps) {
  return (
    <section className="bg-cream">
      <div
        className={`mx-auto px-4 md:px-6 py-10 md:py-14 ${narrow ? "max-w-3xl" : "max-w-6xl"}`}
      >
        {eyebrow && (
          <p className="font-sans text-sm font-semibold text-accent-text uppercase tracking-wider mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display font-bold text-title text-primary-dark">{title}</h1>
        {text && <p className="font-sans text-muted mt-2 max-w-2xl">{text}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}