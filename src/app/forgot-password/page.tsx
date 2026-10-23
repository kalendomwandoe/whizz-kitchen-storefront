"use client";

import { useState } from "react";
import Link from "next/link";
import { useRequestPasswordResetMutation } from "@/lib/redux/api/customerAuthApi";
import { getErrorMessage } from "@/lib/errors";
import AuthCard from "@/components/auth/AuthCard";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await requestReset({ email: email.trim() }).unwrap();
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      text={sent ? undefined : "Enter your email and we'll send you a link to choose a new password."}
      footer={
        <Link href="/login" className="font-semibold text-accent-text">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        // Same message whether or not the email has an account, on purpose
        <p className="font-sans text-primary-dark/70">
          If that email is registered, a reset link is on its way. It expires in 30 minutes.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label="Email"
            type="email"
             reveal
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p role="alert" className="font-sans text-sm text-red-600">
              {error}
            </p>
          )}
                    <Button type="submit" loading={isLoading}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}