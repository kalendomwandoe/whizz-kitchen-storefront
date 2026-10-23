import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonStyles";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  external?: boolean; // opens in a new tab (for WhatsApp and similar)
  className?: string;
  /** Looks and reads as unavailable. It stays focusable so keyboard users can find it. */
  disabled?: boolean;
}

export default function LinkButton({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
  disabled = false,
}: LinkButtonProps) {
  const classes = buttonClasses(
    variant,
    disabled ? "inactive" : "idle",
    `inline-block text-center ${className}`,
  );

  if (disabled) {
    // No href, so it cannot be followed; role + aria-disabled tell assistive tech why.
    return (
      <a role="link" aria-disabled="true" tabIndex={0} className={classes}>
        {children}
      </a>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}