"use client";

import { useHomeProducts } from "@/hooks/useHomeProducts";
import ProductCard from "@/components/products/ProductCard";
import SectionHeader from "@/components/home/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

export default function FeaturedProducts() {
  const { available, isLoading } = useHomeProducts();

  if (!isLoading && available.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-14 md:py-20">
        <SectionHeader
          title="Shop our products"
          text="Sauces and merchandise from Whizz Kitchen."
          href="/products"
          linkLabel="View all products"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4]" />)
            : available.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}