// The look shared by Button and LinkButton, so the two can never drift apart.

// success = a brief "done" confirmation (the Add to Cart button says "Added" in this colour)
export type ButtonVariant = "primary" | "secondary" | "success";

// idle     = ready to use
// inactive = switched off (disabled / aria-disabled)
// loading  = busy: shows a spinner, ignores clicks
export type ButtonState = "idle" | "inactive" | "loading";

const base =
  "relative min-h-11 rounded-lg px-5 py-2.5 font-sans font-semibold " +
  // Only the properties that actually change, never "all"
  "transition-[scale,background-color,color,box-shadow,opacity] duration-(--duration-quick) ease-(--ease-out) " +
  // Focus ring: a dark ring with a cream gap, so it shows on light AND dark backgrounds.
  // The transparent outline is what Windows High Contrast mode turns into a visible ring.
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent " +
  "focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const fill: Record<ButtonVariant, string> = {
  primary: "bg-accent-text",
  secondary: "border border-primary bg-cream",
  // The success colour from globals.css. Cream text on it is 5.8:1.
  success: "bg-success",
};

const text: Record<ButtonVariant, string> = {
  primary: "text-cream",
  secondary: "text-primary",
  success: "text-cream",
};

// Hover, then a darker press colour, plus a small shrink on press (skill sections 1 and 13).
// With Reduce Motion on, the shrink is removed and the colour change alone gives feedback.
const interactive: Record<ButtonVariant, string> = {
  primary:
    "hover:bg-[#9f4220] active:bg-[#8a3919] active:scale-97 motion-reduce:active:scale-100",
  secondary:
    "hover:bg-cream-dark active:bg-[#e6d8bf] active:scale-97 motion-reduce:active:scale-100",
  success:
    "hover:bg-[#185730] active:bg-[#134a28] active:scale-97 motion-reduce:active:scale-100",
};

/** Colour of the loading spinner: the same as the label it replaces. */
export const spinnerColor: Record<ButtonVariant, string> = text;

export function buttonClasses(variant: ButtonVariant, state: ButtonState, extra = ""): string {
  return [
    base,
    fill[variant],
    // While loading the label turns invisible but stays in place, so the width cannot change
    state === "loading" ? "cursor-progress text-transparent" : text[variant],
    state === "idle" ? interactive[variant] : "",
    state === "inactive" ? "cursor-not-allowed opacity-50" : "",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}