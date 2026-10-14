import Image from "next/image";
import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  eyebrow?: string;
  text?: string;
  image?: string | null;
  imagePosition?: string;
  children?: ReactNode;
}

export default function PageHero({
  title,
  eyebrow,
  text,
  image = null,
  imagePosition = "center",
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: imagePosition }}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(194,87,46,0.35),transparent_60%)]" />
      )}

      {/* Same darkening as the homepage slider, so the text reads on any photo */}
      <div className="absolute inset-0 bg-primary/55" />
      <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/50 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[280px] max-w-6xl flex-col justify-center px-4 py-12 md:min-h-[360px] md:px-6 md:py-16">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-cream/80">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display font-bold text-4xl leading-tight text-cream md:text-5xl">
            {title}
          </h1>
          {text && <p className="mt-4 font-sans text-lg text-cream/85">{text}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}