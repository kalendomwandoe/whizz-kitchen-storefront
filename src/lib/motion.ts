import type { Transition } from "motion/react";

// ---------------------------------------------------------------------------
// Motion constants. Components import from here instead of inventing numbers,
// so every animation on the site feels like it belongs to the same family.
// CSS timing lives in globals.css (--duration-*, --ease-out); this file is the
// JavaScript twin of it, for animations driven by the motion library.
// ---------------------------------------------------------------------------

// How a spring is described here (skill section 4):
//   visualDuration = how long the movement *looks* like it takes, in seconds
//                    (close to Apple's "response")
//   bounce         = 0 means no overshoot (damping ratio 1.0);
//                    0.2 means a small, friendly overshoot (damping ratio ~0.8)

export const springs = {
  /** Default for almost everything: cards, menus, popovers, toasts. No overshoot. */
  default: { type: "spring", visualDuration: 0.35, bounce: 0 },
  /** Sheets and drawers: a touch quicker, with a small settle so they feel physical. */
  sheet: { type: "spring", visualDuration: 0.3, bounce: 0.2 },
  /** Press feedback on buttons and cards: very quick, never bouncy. */
  press: { type: "spring", visualDuration: 0.18, bounce: 0 },
} as const satisfies Record<string, Transition>;

/** With Reduce Motion on, every spring becomes this short cross-fade (matches --duration-base). */
export const calmFade = { type: "tween", duration: 0.2, ease: "easeOut" } as const satisfies Transition;

/** Pick the right transition for the person's setting.
 *  Usage: transition={pickTransition(springs.sheet, reduced)} */
export function pickTransition(spring: Transition, reduceMotion: boolean): Transition {
  return reduceMotion ? calmFade : spring;
}

/** How much a pressed button shrinks (skill section 1: respond on pointer-down). */
export const PRESS_SCALE = 0.97;