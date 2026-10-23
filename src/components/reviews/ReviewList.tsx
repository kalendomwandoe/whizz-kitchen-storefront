import { Review } from "@/types/review";
import StarRating from "@/components/reviews/StarRating";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="divide-y divide-primary/10">
      {reviews.map((review) => (
        <li key={review.id} className="py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <StarRating rating={review.rating} size={14} />
              <span className="font-sans font-semibold text-sm text-primary-dark truncate">
                {review.authorName}
              </span>
            </div>
            <span className="font-sans text-xs text-muted shrink-0">
              {new Date(review.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {review.comment && (
            <p className="font-sans text-sm text-primary-dark/80 mt-2 whitespace-pre-line break-words">
              {review.comment}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}