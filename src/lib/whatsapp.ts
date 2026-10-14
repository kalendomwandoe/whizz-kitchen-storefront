import { Order } from "@/types/order";
import { formatPrice } from "@/lib/format";

// Builds the pre-filled wa.me link: order number plus the key details.
export function buildOrderWhatsAppUrl(order: Order): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;

  const lines = [
    `Hi There Whizz Kitchen! I just placed order #${order.orderNumber}.`,
    "",
    "Items:",
    ...order.items.map((i) => `- ${i.quantity} × ${i.productName} (${i.variantSize})`),
    "",
    `Total: ${formatPrice(order.totalAmount)}`,
    `Delivery to: ${order.deliveryAddress}`,
    `Name: ${order.customerName}`,
  ];

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}
// A general "chat with us" link. Returns null if no WhatsApp number is configured.
export function buildWhatsAppUrl(message?: string): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;
  return message
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${number}`;
}