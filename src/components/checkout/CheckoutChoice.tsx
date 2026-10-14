"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const cardClass =
  "group flex w-full items-center justify-between gap-4 rounded-xl border border-primary/15 bg-white p-4 text-left transition hover:border-primary hover:shadow-md";

function Arrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0 text-primary/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Option({ title, text }: { title: string; text: ReactNode }) {
  return (
    <div>
      <p className="font-sans font-bold text-primary-dark">{title}</p>
      <p className="font-sans text-sm text-primary-dark/60">{text}</p>
    </div>
  );
}

export default function CheckoutChoice({ onContinueAsGuest }: { onContinueAsGuest: () => void }) {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display font-bold text-3xl text-primary-dark mb-1">Checkout</h1>
      <p className="font-sans text-primary-dark/60 mb-6">How would you like to continue?</p>

      <div className="flex flex-col gap-3">
        <button type="button" onClick={onContinueAsGuest} className={cardClass}>
          <Option
            title="Continue as guest"
            text="No account needed. Just your name, phone and delivery address."
          />
          <Arrow />
        </button>

        <Link href="/login?redirect=/checkout" className={cardClass}>
          <Option title="Log in" text="Already have an account? We'll fill in your details." />
          <Arrow />
        </Link>

        <Link href="/register?redirect=/checkout" className={cardClass}>
          <Option
            title="Create an account"
            text="Track your orders and check out faster next time."
          />
          <Arrow />
        </Link>
      </div>
    </div>
  );
}