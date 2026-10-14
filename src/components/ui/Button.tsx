import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "font-sans font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
   const variants = {
    primary: "bg-accent text-cream hover:opacity-90",
    secondary: "bg-cream text-primary border border-primary hover:bg-cream-dark",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}