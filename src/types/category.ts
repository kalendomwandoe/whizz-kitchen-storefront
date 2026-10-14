export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  createdAt: string;
  _count?: { products: number };
}