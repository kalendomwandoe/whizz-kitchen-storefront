"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { showToast } from "@/lib/redux/slices/toastSlice";
import { useCreateReviewMutation } from "@/lib/redux/api/reviewApi";
import { getErrorMessage } from "@/lib/errors";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import Button from "@/components/ui/Button";

interface ReviewFormProps {
  productId: string;
  onSubmitted?: () => void;
}

const inputClass =
  "w-full px-4 py-2 rounded-lg border border-primary/20 font-sans text-sm focus:outline-none focus:border-primary";

export default function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.auth.customer);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [form, setForm] = useState({
    authorName: customer?.name ?? "",
    rating: 0,
    comment: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.rating < 1) {
      setError("Please choose a star rating");
      return;
    }

    try {
      await createReview({
        productId,
        authorName: form.authorName.trim(),
        rating: form.rating,
        comment: form.comment.trim() || undefined, // don't send an empty string
      }).unwrap();

      dispatch(showToast({ message: "Thanks for your review!", type: "success" }));
      setForm((f) => ({ ...f, rating: 0, comment: "" }));
      onSubmitted?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not post your review"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-primary/10 bg-white p-4 flex flex-col gap-4"
    >
      <h3 className="font-sans font-bold text-lg text-primary-dark">Write a review</h3>

      <div className="flex flex-col gap-1">
        <span className="font-sans text-sm font-medium text-primary-dark">Your rating</span>
        <StarRatingInput value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="review-name" className="font-sans text-sm font-medium text-primary-dark">
          Your name
        </label>
        <input
          id="review-name"
          required
          maxLength={60}
          autoComplete="name"
          className={inputClass}
          value={form.authorName}
          onChange={(e) => setForm({ ...form, authorName: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="review-comment" className="font-sans text-sm font-medium text-primary-dark">
          Comment <span className="text-primary-dark/50 font-normal">(optional)</span>
        </label>
        <textarea
          id="review-comment"
          rows={4}
          maxLength={1000}
          className={inputClass}
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
        <span className="font-sans text-xs text-primary-dark/50 text-right">
          {form.comment.length}/1000
        </span>
      </div>

      {error && <p className="font-sans text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Posting..." : "Post review"}
      </Button>
    </form>
  );
}