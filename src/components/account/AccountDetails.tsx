"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import { showToast } from "@/lib/redux/slices/toastSlice";
import {
  useGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useChangeCustomerPasswordMutation,
  useResendVerificationEmailMutation,
} from "@/lib/redux/api/customerAuthApi";
import { getErrorMessage } from "@/lib/errors";
import { Customer } from "@/types/customer";
import Field from "@/components/ui/Field";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

function ProfileForm({ customer }: { customer: Customer }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [updateProfile, { isLoading }] = useUpdateCustomerProfileMutation();
  const [form, setForm] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(form).unwrap();
      if (token) dispatch(setCredentials({ customer: updated, token }));
      dispatch(showToast({ message: "Profile updated", type: "success" }));
    } catch (err) {
      dispatch(
        showToast({ message: getErrorMessage(err, "Could not update profile"), type: "error" }),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="font-display font-bold text-lg text-primary-dark">Profile</h3>
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
        hint="If you change your email, we'll ask you to verify the new address."
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Field
        label="Phone"
        type="tel"
        autoComplete="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading }] = useChangeCustomerPasswordMutation();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(form).unwrap();
      setForm({ currentPassword: "", newPassword: "" });
      dispatch(showToast({ message: "Password updated", type: "success" }));
    } catch (err) {
      dispatch(
        showToast({ message: getErrorMessage(err, "Could not change password"), type: "error" }),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="font-display font-bold text-lg text-primary-dark">Change password</h3>
      <Field
        label="Current password"
        type="password"
        required
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
      />
      <Field
        label="New password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        hint="At least 8 characters."
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}

export default function AccountDetails() {
  const dispatch = useAppDispatch();
  const { data: customer, isLoading } = useGetCustomerProfileQuery();
  const [resend, { isLoading: isResending }] = useResendVerificationEmailMutation();

  if (isLoading || !customer) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    );
  }

  const handleResend = async () => {
    try {
      await resend().unwrap();
      dispatch(showToast({ message: "Verification email sent", type: "success" }));
    } catch (err) {
      dispatch(showToast({ message: getErrorMessage(err, "Could not send email"), type: "error" }));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {!customer.emailVerified && (
        <div className="flex flex-col gap-3 rounded-lg border border-primary/10 bg-cream p-4">
          <p className="font-sans text-sm text-primary-dark">
            Your email isn&apos;t verified yet. Check your inbox, or request a new link.
          </p>
          <Button variant="secondary" onClick={handleResend} disabled={isResending}>
            {isResending ? "Sending..." : "Resend email"}
          </Button>
        </div>
      )}

      <ProfileForm customer={customer} />
      <PasswordForm />
    </div>
  );
}