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
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          {/* ONE scrim, darkest where the text sits. On phones the text spans the full width,
              so it is an even top-to-bottom shade; from tablet up the text is on the left,
              so it fades out towards the right and lets the photo show. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-primary/70 to-primary/70 md:bg-linear-to-r md:from-primary/85 md:via-primary/60 md:via-55% md:to-primary/0 contrast-more:from-primary/90 contrast-more:to-primary/90 md:contrast-more:from-primary/95 md:contrast-more:via-primary/80 md:contrast-more:to-primary/30"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(194,87,46,0.35),transparent_60%)]" />
      )}

      <div className="relative z-10 mx-auto flex min-h-70 max-w-6xl flex-col justify-center px-4 py-12 md:min-h-90 md:px-6 md:py-16">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-cream/80">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display font-bold text-display text-cream">{title}</h1>
          {text && <p className="mt-4 font-sans text-lg text-cream/85">{text}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}