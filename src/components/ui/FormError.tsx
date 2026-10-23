import type { ReactNode } from "react";

interface FormErrorProps {
  children?: ReactNode;
  className?: string;
}

// A page-level error ("Wrong password", "Could not place your order").
// Renders nothing when there is no message, so it can always be written as
//   <FormError>{error}</FormError>
export default function FormError({ children, className = "" }: FormErrorProps) {
  if (!children) return null;
  return (
    <p role="alert" className={`font-sans text-sm text-danger ${className}`}>
      {children}
    </p>
  );
}