import { Order } from "@/types/order";

const KEY = "lastOrder";

export function saveLastOrder(order: Order) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Storage unavailable (e.g. private mode quota); the confirmation page just redirects.
  }
}

export function loadLastOrder(): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

export function clearLastOrder() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}