"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { showToast } from "@/lib/redux/slices/toastSlice";
import { useRegisterCustomerMutation } from "@/lib/redux/api/customerAuthApi";
import { getErrorMessage } from "@/lib/errors";
import { getRedirectFromLocation } from "@/lib/redirect";
import AuthCard from "@/components/auth/AuthCard";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterCustomerMutation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      }).unwrap();
      dispatch(
        showToast({
          message: "Account created. Check your email to verify your address.",
          type: "success",
        }),
      );
      router.push(getRedirectFromLocation());
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));
    }
  };

  return (
    <AuthCard
      title="Create an account"
      text="Track your orders and check out faster next time."
      footer={
        <>
          Already have an account? <AuthSwitchLink to="/login">Log in</AuthSwitchLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Full name"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Field
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Field
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Field
          label="Password"
          type="password"
            reveal
          required
          minLength={8}
          autoComplete="new-password"
          hint="At least 8 characters."
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && (
          <p role="alert" className="font-sans text-sm text-red-600">
            {error}
          </p>
        )}

                <Button type="submit" loading={isLoading}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}