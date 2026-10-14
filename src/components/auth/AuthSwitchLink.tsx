"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Inner({ to, children }: { to: string; children: React.ReactNode }) {
  const redirect = useSearchParams().get("redirect");
  const href = redirect ? `${to}?redirect=${encodeURIComponent(redirect)}` : to;
  return (
    <Link href={href} className="text-accent font-semibold">
      {children}
    </Link>
  );
}

// Carries the ?redirect= value across the login <-> register switch, so
// someone who clicks "Register" from checkout still ends up back there.
export default function AuthSwitchLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Suspense fallback={<span className="text-accent font-semibold">{children}</span>}>
      <Inner to={to}>{children}</Inner>
    </Suspense>
  );
}