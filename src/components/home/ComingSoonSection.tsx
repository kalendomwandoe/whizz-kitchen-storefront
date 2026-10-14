"use client";

import { useHomeProducts } from "@/hooks/useHomeProducts";
import ProductCard from "@/components/products/ProductCard";
import SectionHeader from "@/components/home/SectionHeader";

export default function ComingSoonSection() {
  const { comingSoon } = useHomeProducts();

  if (comingSoon.length === 0) return null;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-14 md:py-20">
        <SectionHeader title="Coming soon" text="A peek at what we're working on next." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {comingSoon.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}