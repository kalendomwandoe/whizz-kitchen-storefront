import { Order } from "@/types/order";
import { formatPrice } from "@/lib/format";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrderProgress from "@/components/orders/OrderProgress";

export default function OrderDetails({ order }: { order: Order }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-sans font-black text-xl text-primary-dark">
            Order #{order.orderNumber}
          </h2>
          <p className="font-sans text-xs text-primary-dark/60">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-5">
        <OrderProgress status={order.status} />
      </div>

      <div className="rounded-xl border border-primary/10 bg-white divide-y divide-primary/10">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="font-sans font-bold text-sm text-primary-dark">{item.productName}</p>
              <p className="font-sans text-xs text-primary-dark/60">
                {item.variantSize} · Qty {item.quantity} · {formatPrice(item.unitPrice)} each
              </p>
            </div>
            <p className="font-sans font-semibold text-sm text-primary-dark shrink-0">
              {formatPrice(item.subtotal)}
            </p>
          </div>
        ))}
        <div className="flex justify-between p-4 font-sans font-bold text-primary-dark">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-4 font-sans text-sm text-primary-dark/80 space-y-1">
        <p>
          <span className="font-semibold">Delivering to:</span> {order.deliveryAddress}
        </p>
        <p>
          <span className="font-semibold">Contact:</span> {order.customerName} ·{" "}
          {order.customerPhone}
        </p>
      </div>
    </div>
  );
}