"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

export const fieldInputClass =
  "w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 font-sans text-sm text-primary-dark placeholder:text-primary-dark/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

interface ExtraProps {
  label: string;
  hint?: ReactNode;
  error?: string | null;
}

function Shell({ id, label, hint, error, children }: ExtraProps & { id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-sans text-sm font-medium text-primary-dark">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-note`} className="font-sans text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-note`} className="font-sans text-xs text-primary-dark/50">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function Field({
  label,
  hint,
  error,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & ExtraProps) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-note` : undefined}
        className={`${fieldInputClass} ${className}`}
        {...props}
      />
    </Shell>
  );
}

export function TextareaField({
  label,
  hint,
  error,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & ExtraProps) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-note` : undefined}
        className={`${fieldInputClass} ${className}`}
        {...props}
      />
    </Shell>
  );
}