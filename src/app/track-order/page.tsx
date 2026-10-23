"use client";

import { useState } from "react";
import { useTrackOrderMutation } from "@/lib/redux/api/orderApi";
import { normalizeKenyanPhone } from "@/lib/phone";
import { getErrorMessage } from "@/lib/errors";
import { Order } from "@/types/order";
import OrderDetails from "@/components/orders/OrderDetails";
import PageBand from "@/components/ui/PageBand";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

export default function TrackOrderPage() {
  const [trackOrder, { isLoading }] = useTrackOrderMutation();
  const [form, setForm] = useState({ orderNumber: "", phone: "" });
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrder(null);

    // Accept "1042" or "#1042"
    const orderNumber = Number(form.orderNumber.trim().replace(/^#/, ""));
    if (!Number.isInteger(orderNumber) || orderNumber < 1) {
      setError("Enter a valid order number, e.g. 1042");
      return;
    }

    const phone = normalizeKenyanPhone(form.phone);
    if (!phone) {
      setError("Enter a valid Kenyan mobile number, e.g. 0712 345 678");
      return;
    }

    try {
      const found = await trackOrder({ orderNumber, customerPhone: phone }).unwrap();
      setOrder(found);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      setError(
        status === 404
          ? "We couldn't find an order with those details. Check the order number and the phone number you used at checkout."
          : getErrorMessage(err, "Something went wrong. Please try again."),
      );
    }
  };

  const reset = () => {
    setOrder(null);
    setError(null);
    setForm({ orderNumber: "", phone: "" });
  };

  return (
    <>
      <PageBand
        narrow
        title="Track your order"
        text={
          order
            ? "Here's the latest on your order."
            : "Enter your order number and the phone number you used at checkout."
        }
      />

      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-10">
        {order ? (
          <>
            <OrderDetails order={order} />
            <div className="mt-6">
              <Button variant="secondary" onClick={reset}>
                Track another order
              </Button>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex max-w-md flex-col gap-5 rounded-xl border border-primary/10 bg-white p-5 md:p-6"
          >
            <Field
              label="Order number"
              inputMode="numeric"
              required
              placeholder="1042"
              value={form.orderNumber}
              onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
            />
            <Field
              label="Phone number"
              type="tel"
              required
              autoComplete="tel"
              placeholder="0712 345 678"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            {error && (
              <p role="alert" className="font-sans text-sm text-red-600">
                {error}
              </p>
            )}

                        <Button type="submit" loading={isLoading}>
              Track order
            </Button>
          </form>
        )}
      </div>
    </>
  );
}