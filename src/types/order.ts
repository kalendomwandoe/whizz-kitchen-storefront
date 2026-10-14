export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantSize: string;
  unitPrice: string; // Decimal arrives as a string
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderListResponse {
  orders: Order[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
}

export interface TrackOrderInput {
  orderNumber: number;
  customerPhone: string;
}