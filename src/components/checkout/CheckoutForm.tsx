"use client";

import { useState } from "react";
import { normalizeKenyanPhone } from "@/lib/phone";
import { CheckoutInput } from "@/types/order";
import Field, { TextareaField } from "@/components/ui/Field";
import Button from "@/components/ui/Button";

interface CheckoutFormProps {
  initialName: string;
  initialPhone: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (data: CheckoutInput) => void;
}

export default function CheckoutForm({
  initialName,
  initialPhone,
  isSubmitting,
  error,
  onSubmit,
}: CheckoutFormProps) {
  const [form, setForm] = useState({ name: initialName, phone: initialPhone, address: "" });
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phone = normalizeKenyanPhone(form.phone);
    if (!phone) {
      setPhoneError("Enter a valid Kenyan mobile number, e.g. 0712 345 678");
      return;
    }
    setPhoneError(null);

    onSubmit({
      customerName: form.name.trim(),
      customerPhone: phone,
      deliveryAddress: form.address.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-xl border border-primary/10 bg-white p-5 md:p-6"
    >
      <h2 className="font-display font-bold text-xl text-primary-dark">Delivery details</h2>

      <Field
        label="Full name"
        required
        autoComplete="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Field
        label="Phone (WhatsApp)"
        type="tel"
        required
        autoComplete="tel"
        placeholder="0712 345 678"
        hint="We'll message you here to confirm your order."
        error={phoneError}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <TextareaField
        label="Delivery address"
        required
        rows={3}
        placeholder="Building, street, estate / area, nearest landmark"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      {error && (
        <p role="alert" className="font-sans text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Placing order..." : "Place order"}
      </Button>
    </form>
  );
}