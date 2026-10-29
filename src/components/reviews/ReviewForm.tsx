"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { showToast } from "@/lib/redux/slices/toastSlice";
import {
  useCreateReviewMutation,
  useGetReviewEligibilityQuery,
} from "@/lib/redux/api/reviewApi";
import { getErrorMessage } from "@/lib/errors";
import { loginHref } from "@/lib/redirect";
import { useHasMounted } from "@/hooks/useHasMounted";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import Button from "@/components/ui/Button";

interface ReviewFormProps {
  productId: string;
  onSubmitted?: () => void;
}

type Warning = "guest" | "needs-purchase" | "session-expired";

const WARNING_MESSAGES: Record<Warning, string> = {
  guest: "Please log in to write a review.",
  "needs-purchase":
    "You can only review products you've purchased. Order this product to leave a review.",
  "session-expired": "Your session has expired. Please log in again to post your review.",
};

// Repeated clicks must not pile up toasts.
const TOAST_COOLDOWN_MS = 4000;
const WARNING_DURATION_MS = 7000;

const inputClass =
  "w-full px-4 py-2 rounded-lg border border-primary/20 font-sans text-sm focus:outline-none focus:border-primary";

export default function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const hasMounted = useHasMounted();
  const authStatus = useAppSelector((state) => state.auth.status);
  const customer = useAppSelector((state) => state.auth.customer);

  // Only logged-in customers can be checked. Always ask fresh, because an order
  // may have been placed or cancelled since the last visit.
  const { data: eligibility, refetch } = useGetReviewEligibilityQuery(productId, {
    skip: !customer,
    refetchOnMountOrArgChange: true,
  });

  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [form, setForm] = useState({
    rating: 0,
    comment: "",
  });
  const [error, setError] = useState<string | null>(null);
  const lastWarningAt = useRef(0);

  // Why this visitor can't review right now, or null if they can (or we don't know yet).
  // Until the page has loaded in the browser and the saved login has been checked,
  // nobody is blocked, so the server's page and the browser's first drawing match.
  const ready = hasMounted && authStatus === "ready";
  const blocked: "guest" | "needs-purchase" | null = !ready
    ? null
    : !customer
      ? "guest"
      : eligibility?.canReview === false
        ? "needs-purchase"
        : null;

  const showWarning = (kind: Warning) => {
    const now = Date.now();
    if (now - lastWarningAt.current < TOAST_COOLDOWN_MS) return;
    lastWarningAt.current = now;

    dispatch(
      showToast({
        message: WARNING_MESSAGES[kind],
        type: "error",
        duration: WARNING_DURATION_MS,
        // Guests and expired sessions get a Log in button that brings them back here.
        action:
          kind === "needs-purchase"
            ? undefined
            : { label: "Log in", href: loginHref(pathname) },
      }),
    );
  };

  // Returns true (after showing the toast) when the visitor isn't allowed to continue.
  const guard = (): boolean => {
    if (!blocked) return false;
    showWarning(blocked);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (guard()) return;

    if (form.rating < 1) {
      setError("Please choose a star rating");
      return;
    }

    try {
      await createReview({
        productId,
        rating: form.rating,
        comment: form.comment.trim() || undefined, // don't send an empty string
      }).unwrap();

      dispatch(showToast({ message: "Thanks for your review!", type: "success" }));
      setForm((f) => ({ ...f, rating: 0, comment: "" }));
      onSubmitted?.();
    } catch (err) {
      const status = (err as { status?: unknown }).status;
      if (status === 401) {
        showWarning("session-expired");
      } else if (status === 403) {
        // They no longer qualify (for example, the order was cancelled). Re-check.
        showWarning("needs-purchase");
        if (customer) refetch();
      } else {
        setError(getErrorMessage(err, "Could not post your review"));
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-primary/10 bg-white p-4 flex flex-col gap-4"
    >
      <h3 className="font-sans font-bold text-lg text-primary-dark">Write a review</h3>

      {hasMounted && customer && (
        <p className="font-sans text-sm text-primary-dark/70">
          Posting as <strong className="text-primary-dark">{customer.name}</strong>
        </p>
      )}

      <div className="flex flex-col gap-1">
        <span className="font-sans text-sm font-medium text-primary-dark">Your rating</span>
        <StarRatingInput
          value={form.rating}
          onChange={(rating) => {
            if (guard()) return;
            setForm({ ...form, rating });
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="review-comment" className="font-sans text-sm font-medium text-primary-dark">
          Comment <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          id="review-comment"
          rows={4}
          maxLength={1000}
          className={inputClass}
          value={form.comment}
          // Visitors who can't review can look, but not type. Clicking explains why.
          readOnly={blocked !== null}
          onClick={() => {
            guard();
          }}
          onKeyDown={(e) => {
            if (e.key.length === 1 || e.key === "Enter") guard();
          }}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
        <span className="font-sans text-xs text-muted text-right">
          {form.comment.length}/1000
        </span>
      </div>

      {error && (
        <p role="alert" className="font-sans text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" loading={isLoading}>
        Post review
      </Button>
    </form>
  );
}