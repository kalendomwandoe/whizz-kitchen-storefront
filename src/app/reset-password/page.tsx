"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { showToast } from "@/lib/redux/slices/toastSlice";
import { useResetPasswordMutation } from "@/lib/redux/api/customerAuthApi";
import { getErrorMessage } from "@/lib/errors";
import AuthCard from "@/components/auth/AuthCard";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useSearchParams().get("token");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <p className="font-sans text-primary-dark/70">
        This reset link is invalid.{" "}
        <Link href="/forgot-password" className="font-semibold text-accent-text">
          Request a new one
        </Link>
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConfirmError(null);

    if (form.newPassword !== form.confirm) {
      setConfirmError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ token, newPassword: form.newPassword }).unwrap();
      dispatch(showToast({ message: "Password updated. Please log in.", type: "success" }));
      router.push("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Could not reset password"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="New password"
        type="password"
        reveal
        required
        minLength={8}
        autoComplete="new-password"
        hint="At least 8 characters."
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
      />
      <Field
        label="Confirm new password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        error={confirmError}
        value={form.confirm}
        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
      />
      {error && (
        <p role="alert" className="font-sans text-sm text-red-600">
          {error}
        </p>
      )}
            <Button type="submit" loading={isLoading}>
        Set new password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Choose a new password">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}