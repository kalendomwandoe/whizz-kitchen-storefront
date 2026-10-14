import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  text?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ title, text, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-[60svh] bg-cream/60">
      <div className="mx-auto max-w-md px-4 py-10 md:py-16">
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm md:p-8">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-primary-dark">{title}</h1>
          {text && <p className="mt-2 font-sans text-sm text-primary-dark/60">{text}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <div className="mt-6 text-center font-sans text-sm text-primary-dark/60">{footer}</div>
        )}
      </div>
    </div>
  );
}