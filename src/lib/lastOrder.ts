import { Order } from "@/types/order";

const KEY = "lastOrder";

export function saveLastOrder(order: Order) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Storage unavailable (e.g. private mode quota); the confirmation page just says it has no order to show.
  }
}

/**
 * The saved order exactly as it is stored (a piece of text), or null if there is none.
 * Text is compared by value, so React can tell whether it changed.
 */
export function readLastOrderRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Turns the stored text back into an order. Anything unreadable counts as no order. */
export function parseLastOrder(raw: string | null): Order | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

export function loadLastOrder(): Order | null {
  return parseLastOrder(readLastOrderRaw());
}

export function clearLastOrder() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}