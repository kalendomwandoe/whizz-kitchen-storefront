import Image from "next/image";
import { CartItem } from "@/types/cart";
import { formatPrice } from "@/lib/format";

export default function OrderSummary({ items }: { items: CartItem[] }) {
  // Prices arrive as strings from the API, so convert before doing math
  const total = items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);

  return (
    <div className="rounded-xl bg-cream p-5">
      <h2 className="font-display font-bold text-xl text-primary-dark mb-2">Order summary</h2>

      <div className="divide-y divide-primary/10">
        {items.map((item) => {
          const image = item.variant.images[0];
          return (
            <div key={item.id} className="flex gap-3 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                {image && (
                  <Image
                    src={image.url}
                    alt={item.variant.product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-bold text-primary-dark line-clamp-1">
                  {item.variant.product.name}
                </p>
                <p className="font-sans text-xs text-primary-dark/60">
                  {item.variant.size}
                  {item.variant.color ? ` – ${item.variant.color}` : ""} · Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 font-sans text-sm font-semibold text-primary-dark">
                {formatPrice(Number(item.variant.price) * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between border-t border-primary/10 pt-3 font-sans font-bold text-primary-dark">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <p className="mt-2 font-sans text-xs text-primary-dark/60">
        Delivery fees and payment are confirmed with you on WhatsApp after you order.
      </p>
    </div>
  );
}