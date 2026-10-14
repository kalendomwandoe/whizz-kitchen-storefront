"use client";

import { useState } from "react";
import { useGetProductReviewsQuery } from "@/lib/redux/api/reviewApi";
import StarRating from "@/components/reviews/StarRating";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import Button from "@/components/ui/Button";

const PAGE_SIZE = 5;

export default function ProductReviews({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetProductReviewsQuery({
    productId,
    page,
    limit: PAGE_SIZE,
  });

  const count = data?.pagination.total ?? 0;

  return (
    <div>
      <h2 className="font-sans font-black text-xl md:text-2xl text-primary-dark mb-6">
        Customer reviews
      </h2>

      <div className="grid md:grid-cols-[3fr_2fr] gap-8 md:gap-10 items-start">
        <div>
          {isLoading && <p className="font-sans text-primary/60">Loading reviews...</p>}
          {isError && <p className="font-sans text-red-600">Could not load reviews.</p>}

          {data && count === 0 && (
            <p className="font-sans text-primary-dark/60">
              No reviews yet. Be the first to share what you think.
            </p>
          )}

          {data && count > 0 && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-sans font-black text-3xl text-primary-dark">
                  {data.averageRating?.toFixed(1)}
                </span>
                <div>
                  <StarRating rating={data.averageRating ?? 0} size={18} />
                  <p className="font-sans text-xs text-primary-dark/60">
                    Based on {count} review{count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <ReviewList reviews={data.reviews} />

              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="font-sans text-sm text-primary-dark/60">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Always shown, even if the list failed to load */}
        <ReviewForm productId={productId} onSubmitted={() => setPage(1)} />
      </div>
    </div>
  );
}