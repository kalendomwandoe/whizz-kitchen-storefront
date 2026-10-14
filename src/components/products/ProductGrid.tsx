import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductCard from "@/components/products/ProductCard";
import Skeleton from "@/components/ui/Skeleton";

const gridClass = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";


interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

const categoryOrder = ["sauces", "snacks", "merchandise"];

const isAllComingSoon = (product: Product) =>
  product.variants.length > 0 && product.variants.every((v) => v.isComingSoon);

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4]" />
      ))}
    </div>
  );
}


export default function ProductGrid({
  products,
  categories,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center font-sans text-primary/60">
        No products here yet.
      </p>
    );
  }

  const categoryById = new Map(
    categories.map((category) => [
      category.id,
      category.slug.toLowerCase(),
    ]),
  );

  const ordered = [...products].sort((a, b) => {
    // Coming-soon products always go last.
    const availabilityDifference =
      Number(isAllComingSoon(a)) - Number(isAllComingSoon(b));

    if (availabilityDifference !== 0) {
      return availabilityDifference;
    }

    // Match each product's category ID to the fetched category.
    const aSlug = categoryById.get(a.categoryId ?? "") ?? "";
    const bSlug = categoryById.get(b.categoryId ?? "") ?? "";

    const aOrder = categoryOrder.indexOf(aSlug);
    const bOrder = categoryOrder.indexOf(bSlug);

    const safeAOrder = aOrder === -1 ? Infinity : aOrder;
    const safeBOrder = bOrder === -1 ? Infinity : bOrder;

    return safeAOrder - safeBOrder;
  });

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {ordered.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}