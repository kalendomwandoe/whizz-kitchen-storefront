export interface ProductImage {
  id: string;
  variantId: string;
  url: string;
  position: number;
  altText: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  isComingSoon: boolean;
  images: ProductImage[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
    rating: ProductRating;
}

export interface ProductListResponse {
  products: Product[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface ProductRating {
  average: number | null;
  count: number;

}