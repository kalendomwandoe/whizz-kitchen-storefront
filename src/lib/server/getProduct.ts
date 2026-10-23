import { cache } from "react";
import type { Product } from "@/types/product";

/** The three things that can happen when the server asks the API for a product. */
export type ProductResult =
  | { status: "ok"; product: Product }
  | { status: "not-found" } // the API says there is no such product (a real 404)
  | { status: "error" }; // the API was unreachable or failed: not the same as "not found"

/**
 * Fetches one product on the server. Wrapped in React's cache(), so generateMetadata and the
 * page itself can both call it during the same page load without repeating the work.
 */
export const getProduct = cache(async (slug: string): Promise<ProductResult> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${encodeURIComponent(slug)}`,
      // Keep the answer for up to a minute, so a busy product page does not hit the API every time
      { next: { revalidate: 60 } },
    );
    if (res.status === 404) return { status: "not-found" };
    if (!res.ok) return { status: "error" };
    const body = (await res.json()) as { data: Product };
    return { status: "ok", product: body.data };
  } catch {
    return { status: "error" };
  }
});