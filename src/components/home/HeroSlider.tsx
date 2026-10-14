"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LinkButton from "@/components/ui/LinkButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HERO_SLIDES } from "@/lib/home-content";

const AUTOPLAY_MS = 4000;
const SWIPE_THRESHOLD_PX = 50;

export default function HeroSlider() {
  const slides = HERO_SLIDES;
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const goTo = (target: number) => setIndex(((target % count) + count) % count);
  const autoplayOn = count > 1 && !reducedMotion;

  // Each slide stays for AUTOPLAY_MS; any manual change restarts the timer.
  useEffect(() => {
    if (!autoplayOn || hoverPaused || userPaused) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, autoplayOn, hoverPaused, userPaused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative overflow-hidden bg-primary h-[75svh] min-h-[480px] max-h-[760px] touch-pan-y"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setHoverPaused(true)}
      onBlurCapture={() => setHoverPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goTo(index - 1);
        if (e.key === "ArrowRight") goTo(index + 1);
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) > SWIPE_THRESHOLD_PX) goTo(index + (delta < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, i) => {
        const active = i === index;

        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            inert={!active}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.image ? (
              <Image
                src={slide.image}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: slide.imagePosition ?? "center" }}
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(194,87,46,0.35),transparent_60%)]" />
            )}

            {/* Darken the photo so the text stays readable whatever the picture is */}
            <div className="absolute inset-0 bg-primary/55" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/50 to-transparent" />

            <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4 pb-12 md:px-6 md:pb-0">
              <div className="max-w-xl">
                <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-cream">
                  {slide.title}
                </h2>
                <p className="font-sans text-lg text-cream/85 mt-4">{slide.text}</p>
                <LinkButton href={slide.cta.href} className="mt-8">
                  {slide.cta.label}
                </LinkButton>
              </div>
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-cream/15 text-cream hover:bg-cream/30"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-cream/15 text-cream hover:bg-cream/30"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-3 md:bottom-5 inset-x-0 z-20 flex justify-center">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className="p-2"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all ${
                    i === index ? "w-7 bg-accent" : "w-2.5 bg-cream/50"
                  }`}
                />
              </button>
            ))}
          </div>

          {autoplayOn && (
            <button
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              className="absolute bottom-3 right-3 md:bottom-5 md:right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-cream/15 text-cream hover:bg-cream/30"
            >
              {userPaused ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
}