"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

// text-base is 16px. iOS Safari zooms the whole page when you focus a field with
// smaller text, so 16px is the smallest size that does not trigger that zoom.
export const fieldInputClass =
  "w-full min-h-11 rounded-lg border border-primary/20 bg-white px-4 py-2.5 font-sans text-base text-primary-dark placeholder:text-primary-dark/60 " +
  // The transparent outline is what Windows High Contrast mode turns into a visible ring
  "focus:border-primary focus:outline-2 focus:outline-transparent focus:ring-2 focus:ring-primary/10 " +
  "aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus:ring-danger/15";

interface ExtraProps {
  label: string;
  hint?: ReactNode;
  /** An error that comes from outside (the server, or a check on submit). Always shown. */
  error?: string | null;
  /** Checked when the person leaves the field. Return a message, or nothing if the value is fine. */
  validate?: (value: string) => string | null | undefined;
}

// Shared by Field and TextareaField. "Touched" means the person has left the field:
// we only run validate on blur, and we clear the message as soon as they type again.
function useInlineValidation<E extends HTMLInputElement | HTMLTextAreaElement>(
  validate: ExtraProps["validate"],
  onBlur: ((event: FocusEvent<E>) => void) | undefined,
  onChange: ((event: ChangeEvent<E>) => void) | undefined,
) {
  const [inlineError, setInlineError] = useState<string | null>(null);

  const handleBlur = (event: FocusEvent<E>) => {
    if (validate) setInlineError(validate(event.target.value) || null);
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<E>) => {
    setInlineError(null);
    onChange?.(event);
  };

  return { inlineError, handleBlur, handleChange };
}

function describedBy(id: string, hint: ReactNode) {
  return [hint ? `${id}-hint` : null, `${id}-error`].filter(Boolean).join(" ");
}

function Shell({
  id,
  label,
  required,
  hint,
  message,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  message?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 font-sans text-sm font-medium text-primary-dark">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 font-sans text-xs text-muted">
          {hint}
        </p>
      )}
      {/* This region is ALWAYS in the page, even when empty. Screen readers only announce
          changes to a live region they already know about, so we swap the text, never the element. */}
      <p
        id={`${id}-error`}
        aria-live="polite"
        className={`font-sans text-sm text-danger ${message ? "mt-1" : ""}`}
      >
        {message}
      </p>
    </div>
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {crossed ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <path d="M1 1l22 22" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export default function Field({
  label,
  hint,
  error,
  validate,
  reveal = false,
  className = "",
  type,
  onBlur,
  onChange,
  ...props
}: InputHTMLAttributes<HTMLInputElement> &
  ExtraProps & {
    /** For password fields: adds a show/hide button. */
    reveal?: boolean;
  }) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const { inlineError, handleBlur, handleChange } = useInlineValidation<HTMLInputElement>(
    validate,
    onBlur,
    onChange,
  );

  const message = error || inlineError;
  const canReveal = reveal && type === "password";

  const input = (
    <input
      id={id}
      type={canReveal && shown ? "text" : type}
      aria-invalid={message ? true : undefined}
      aria-describedby={describedBy(id, hint)}
      // A revealed password is plain text: stop the phone from capitalising or "fixing" it
      {...(canReveal ? { autoCapitalize: "none", spellCheck: false } : {})}
      className={`${fieldInputClass} ${canReveal ? "pr-12" : ""} ${className}`}
      onBlur={handleBlur}
      onChange={handleChange}
      {...props}
    />
  );

  return (
    <Shell id={id} label={label} required={props.required} hint={hint} message={message}>
      {canReveal ? (
        <div className="relative">
          {input}
          <button
            type="button"
            aria-label="Show password"
            aria-pressed={shown}
            onClick={() => setShown((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-lg text-muted hover:text-primary-dark focus-visible:text-primary-dark focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-dark"
          >
            <EyeIcon crossed={shown} />
          </button>
        </div>
      ) : (
        input
      )}
    </Shell>
  );
}

export function TextareaField({
  label,
  hint,
  error,
  validate,
  className = "",
  onBlur,
  onChange,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & ExtraProps) {
  const id = useId();
  const { inlineError, handleBlur, handleChange } = useInlineValidation<HTMLTextAreaElement>(
    validate,
    onBlur,
    onChange,
  );
  const message = error || inlineError;

  return (
    <Shell id={id} label={label} required={props.required} hint={hint} message={message}>
      <textarea
        id={id}
        aria-invalid={message ? true : undefined}
        aria-describedby={describedBy(id, hint)}
        className={`${fieldInputClass} ${className}`}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
    </Shell>
  );
}