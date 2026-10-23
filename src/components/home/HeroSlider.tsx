
"use client";

import { animate, motion, useMotionValue } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import LinkButton from "@/components/ui/LinkButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HERO_SLIDES } from "@/lib/home-content";

const AUTOPLAY_MS = 4000;
const DIRECTION_LOCK_PX = 10;
const DECELERATION_RATE = 0.998;
const RUBBER_BAND_CONSTANT = 0.55;

type PointerSample = {
  x: number;
  time: number;
};

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  baseX: number;
  axis: "horizontal" | "vertical" | null;
  samples: PointerSample[];
};

function project(velocity: number, decelerationRate = DECELERATION_RATE) {
  return (
    (velocity / 1000) *
    decelerationRate /
    (1 - decelerationRate)
  );
}

function rubberBand(overshoot: number, dimension: number) {
  if (dimension <= 0) return 0;

  return (
    (overshoot * dimension * RUBBER_BAND_CONSTANT) /
    (dimension + RUBBER_BAND_CONSTANT * Math.abs(overshoot))
  );
}

export default function HeroSlider() {
  const slides = HERO_SLIDES;
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  
  const [focusPaused, setFocusPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const reducedMotion = usePrefersReducedMotion();
  const trackX = useMotionValue(0);

  const sectionRef = useRef<HTMLElement>(null);
  const indexRef = useRef(0);
  const slideWidthRef = useRef(0);
  const dragRef = useRef<DragSession | null>(null);

  const autoplayOn = count > 1 && !reducedMotion;
  const paused = focusPaused || userPaused || isDragging;
  const goTo = useCallback(
    (target: number, velocity = 0, momentum = false) => {
      if (count === 0) return;

      // Preserve the existing wrap-around behavior for buttons and autoplay.
      const next = ((target % count) + count) % count;
      const destination = -next * slideWidthRef.current;

      indexRef.current = next;
      setIndex(next);

      if (reducedMotion || slideWidthRef.current === 0) {
        trackX.set(destination);
        return;
      }

      animate(trackX, destination, {
        type: "spring",
        visualDuration: momentum ? 0.35 : 0.4,
        bounce: momentum ? 0.2 : 0,
        velocity: momentum ? velocity : 0,
      });
    },
    [count, reducedMotion, trackX],
  );

  // Measure the hero so slide positions remain correct at every screen size.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width;
      slideWidthRef.current = nextWidth;
      setSlideWidth(nextWidth);
      trackX.set(-indexRef.current * nextWidth);
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, [trackX]);

  // Autoplay pauses whenever the visitor hovers, focuses, pauses, or drags.
  useEffect(() => {
    if (!autoplayOn || paused) return;

    const timer = window.setTimeout(() => {
      goTo(index + 1);
    }, AUTOPLAY_MS);

    return () => window.clearTimeout(timer);
  }, [index, autoplayOn, paused, goTo]);

  const recordSample = (drag: DragSession, event: ReactPointerEvent) => {
    drag.samples.push({ x: event.clientX, time: event.timeStamp });

    // Keep only a short history so old movement does not distort the flick.
    const cutoff = event.timeStamp - 100;
    drag.samples = drag.samples.filter((sample) => sample.time >= cutoff);

    if (drag.samples.length > 8) {
      drag.samples = drag.samples.slice(-8);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (count < 2 || !event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    // Do not turn clicks on the CTA or controls into a drag.
       // Do not turn clicks on buttons, links, or their SVG icons into a drag.
    if (
      event.target instanceof Element &&
      event.target.closest("button, a")
    ) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: trackX.get(),
      axis: null,
      samples: [{ x: event.clientX, time: event.timeStamp }],
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    // Wait until movement is clear enough to distinguish a swipe from a tap.
    if (drag.axis === null) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DIRECTION_LOCK_PX) {
        return;
      }

      drag.axis =
        Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";

      if (drag.axis === "vertical") {
        return;
      }

      setIsDragging(true);
    }

    if (drag.axis !== "horizontal") return;

    recordSample(drag, event);

    const width = slideWidthRef.current;
    const minX = -(count - 1) * width;
    const proposedX = drag.baseX + deltaX;

    // Resist movement beyond either end instead of allowing an endless track.
    if (proposedX > 0) {
      trackX.set(rubberBand(proposedX, width));
    } else if (proposedX < minX) {
      trackX.set(minX + rubberBand(proposedX - minX, width));
    } else {
      trackX.set(proposedX);
    }
  };

  const finishDrag = (
    event: ReactPointerEvent<HTMLElement>,
    cancelled = false,
  ) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);

    if (drag.axis !== "horizontal" || slideWidthRef.current === 0) return;

    if (!cancelled) recordSample(drag, event);

    const samples = drag.samples;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const elapsed = last.time - first.time;

    // Convert recent pointer movement into pixels per second.
    const velocity =
      !cancelled && elapsed > 0
        ? ((last.x - first.x) / elapsed) * 1000
        : 0;

    // Project where momentum would carry the track, then snap to a slide.
    const currentX = trackX.get();
    const projectedX = currentX + project(velocity);
    const maxIndex = count - 1;
    const target = Math.max(
      0,
      Math.min(maxIndex, Math.round(-projectedX / slideWidthRef.current)),
    );

    goTo(target, velocity, !cancelled);
  };

    const textVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reducedMotion
        ? { duration: 0.2 }
        : { type: "spring" as const, visualDuration: 0.7, bounce: 0 },
    },
  };

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative h-[75svh] min-h-[480px] max-h-[760px] overflow-hidden bg-primary touch-pan-y"
      
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget as Node | null,
          )
        ) {
          setFocusPaused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goTo(index - 1);
        if (event.key === "ArrowRight") goTo(index + 1);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => finishDrag(event)}
      onPointerCancel={(event) => finishDrag(event, true)}
    >
      <motion.div
        className="flex h-full w-full"
        style={{ x: trackX, touchAction: "pan-y" }}
        animate={undefined}
      >
        {slides.map((slide, i) => {
          const active = i === index;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              className="relative h-full w-full shrink-0"
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  draggable={false}
                  className="pointer-events-none object-cover"
                  style={{ objectPosition: slide.imagePosition ?? "center" }}
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(194,87,46,0.35),transparent_60%)]" />
              )}

              <div
                aria-hidden="true"
                className="hero-scrim pointer-events-none absolute inset-0"
              />

              <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4 pb-12 md:px-6 md:pb-0">
                <motion.div
                  className="max-w-xl"
                  initial={active ? "hidden" : false}
                  animate={active ? "visible" : "hidden"}
                  transition={{
                    staggerChildren: reducedMotion ? 0 : 0.16,
                    delayChildren: reducedMotion ? 0 : 0.08,
                  }}
                >
                  <motion.h2
                    variants={textVariants}
                    className="font-display text-4xl leading-tight font-bold text-cream sm:text-5xl lg:text-6xl"
                  >
                    {slide.title}
                  </motion.h2>

                  <motion.p
                    variants={textVariants}
                    className="mt-4 font-sans text-lg text-cream/90"
                  >
                    {slide.text}
                  </motion.p>

                  <motion.div variants={textVariants} className="mt-8">
                    <LinkButton href={slide.cta.href}>
                      {slide.cta.label}
                    </LinkButton>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute top-1/2 left-4 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/15 text-cream hover:bg-cream/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream md:flex"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute top-1/2 right-4 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/15 text-cream hover:bg-cream/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream md:flex"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-0 md:bottom-5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cream"
              >
                <span className="relative block h-2.5 w-7 overflow-hidden rounded-full bg-cream/40">
                  <span
                    key={`${slide.id}-${index === i ? "active" : "inactive"}`}
                    className={`absolute inset-0 origin-left rounded-full ${
                      i === index
                        ? "bg-accent"
                        : "scale-x-[0.36] bg-cream/70"
                    } ${i === index && autoplayOn ? "hero-progress-fill" : ""}`}
                      style={{
                      animationDuration: `${AUTOPLAY_MS}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                </span>
              </button>
            ))}
          </div>

          {autoplayOn && (
            <button
              type="button"
              onClick={() => setUserPaused((value) => !value)}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              className="absolute right-3 bottom-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-cream/15 text-cream hover:bg-cream/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream md:right-5 md:bottom-5"
            >
              {userPaused ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
