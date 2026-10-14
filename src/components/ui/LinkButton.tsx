import Link from "next/link";
import type { ReactNode } from "react";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean; // opens in a new tab (for WhatsApp and similar)
  className?: string;
}

export default function LinkButton({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: LinkButtonProps) {
  const base =
    "inline-block text-center font-sans font-semibold px-5 py-2.5 rounded-lg transition-colors";
  const variants = {
    primary: "bg-accent text-cream hover:opacity-90",
    secondary: "bg-cream text-primary border border-primary hover:bg-cream-dark",
  };
  const classes = `${base} ${variants[variant]} ${className}`;

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