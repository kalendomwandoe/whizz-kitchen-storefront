export interface CartItemProductSummary {
  id: string;
  name: string;
  isActive: boolean;
  slug: string;
}

export interface CartItemImage {
  id: string;
  url: string;
  position: number;
  altText: string | null;
}

export interface CartItemVariant {
  id: string;
  productId: string;
  size: string;
  color: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  isComingSoon: boolean;
  images: CartItemImage[];
  product: CartItemProductSummary;
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: CartItemVariant;
}

export interface Cart {
  id: string;
  customerId: string | null;
  sessionToken: string | null;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface AddCartItemInput {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}