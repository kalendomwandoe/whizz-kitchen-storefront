"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/lib/redux/api/customerAuthApi";
import AuthCard from "@/components/auth/AuthCard";

function VerifyEmailContent() {
  const token = useSearchParams().get("token");
  const [verifyEmail] = useVerifyEmailMutation();
  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const calledRef = useRef(false);

  useEffect(() => {
    // Tokens are single-use. React dev mode runs effects twice, so without
    // this guard the second call would fail and show an error.
    if (!token || calledRef.current) return;
    calledRef.current = true;

    verifyEmail({ token })
      .unwrap()
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token, verifyEmail]);

  if (status === "loading") {
    return <p className="font-sans text-primary-dark/70">Verifying your email...</p>;
  }

  if (status === "success") {
    return (
      <p className="font-sans text-primary-dark/70">
        Your email is verified. Thank you!{" "}
        <Link href="/" className="font-semibold text-accent">
          Back to the shop
        </Link>
      </p>
    );
  }

  return (
    <p className="font-sans text-red-600">
      This verification link is invalid or has expired. Log in and request a new one from your
      account details.
    </p>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Email verification">
      <Suspense fallback={null}>
        <VerifyEmailContent />
      </Suspense>
    </AuthCard>
  );
}