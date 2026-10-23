"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginCustomerMutation } from "@/lib/redux/api/customerAuthApi";
import { getErrorMessage } from "@/lib/errors";
import { getRedirectFromLocation } from "@/lib/redirect";
import AuthCard from "@/components/auth/AuthCard";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginCustomerMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form).unwrap();
      // Back to the page they came from, or the homepage
      router.push(getRedirectFromLocation());
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
    }
  };

  return (
    <AuthCard
      title="Log in"
      text="Track your orders and check out faster."
      footer={
        <>
          Don&apos;t have an account? <AuthSwitchLink to="/register">Register</AuthSwitchLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Field
          label="Password"
          type="password"
          reveal
          required
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && (
          <p role="alert" className="font-sans text-sm text-red-600">
            {error}
          </p>
        )}

                <Button type="submit" loading={isLoading}>
          Log in
        </Button>

        <Link
          href="/forgot-password"
          className="text-center font-sans text-sm font-semibold text-accent-text"
        >
          Forgot password?
        </Link>
      </form>
    </AuthCard>
  );
}