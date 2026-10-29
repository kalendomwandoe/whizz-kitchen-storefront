export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  averageRating: number | null;
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

// The reviewer's name comes from their account, so it is not sent.
export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
}

export interface ReviewEligibility {
  canReview: boolean;
}