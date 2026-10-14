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

export interface CreateReviewInput {
  productId: string;
  authorName: string;
  rating: number;
  comment?: string;
}