"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { buttonClasses, spinnerColor, type ButtonVariant } from "@/components/ui/buttonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Busy: shows a spinner and ignores clicks, but the button keeps keyboard focus. */
  loading?: boolean;
}

function Spinner({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={`absolute inset-0 m-auto size-5 animate-spin motion-reduce:animate-pulse ${className}`}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Button({
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const ariaDisabled = props["aria-disabled"] === true || props["aria-disabled"] === "true";
  const blocked = loading || ariaDisabled;
  const state = loading ? "loading" : disabled || ariaDisabled ? "inactive" : "idle";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (blocked) {
      // Also stops a type="submit" button from submitting its form
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...props}
      disabled={disabled}
      aria-disabled={blocked || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={buttonClasses(variant, state, className)}
    >
      {children}
      {loading && <Spinner className={spinnerColor[variant]} />}
    </button>
  );
}