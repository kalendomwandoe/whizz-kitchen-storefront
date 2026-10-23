import type { Metadata } from "next";

// The shop page is a client page and cannot declare its own title,
// so this layout declares it for everything under /products.
export const metadata: Metadata = { title: "Shop" };

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}