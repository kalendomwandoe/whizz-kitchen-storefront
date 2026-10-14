"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetCategoriesQuery } from "@/lib/redux/api/categoryApi";
import { useGetProductsQuery } from "@/lib/redux/api/productApi";
import { getHeroImage } from "@/lib/home-content";
import ProductGrid, { ProductGridSkeleton } from "@/components/products/ProductGrid";
import CategoryFilter from "@/components/products/CategoryFilter";
import PageHero from "@/components/ui/PageHero";

const hero = getHeroImage("beefire");

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const activeSlug = useSearchParams().get("category") ?? undefined;

  const { data: allCategories } = useGetCategoriesQuery();
  // "coming-soon" is a leftover category that's on the cleanup list, so hide it
  const categories = allCategories?.filter((c) => c.slug !== "coming-soon") ?? [];
  const activeCategory = categories.find((c) => c.slug === activeSlug);

  // If the URL names a category, wait for the category list so we know its id
  const waitingForCategories = Boolean(activeSlug) && !allCategories;
  const { data, isLoading, isError } = useGetProductsQuery(
    { categoryId: activeCategory?.id, limit: 100 },
    { skip: waitingForCategories },
  );
  const loading = isLoading || waitingForCategories;

  const selectCategory = (slug?: string) => {
    router.replace(slug ? `${pathname}?category=${slug}` : pathname, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          activeSlug={activeCategory?.slug}
          onSelect={selectCategory}
        />
      </div>

      {loading && <ProductGridSkeleton />}
      {isError && (
        <p className="py-16 text-center font-sans text-red-600">
          Something went wrong loading products.
        </p>
      )}
      {data && !loading && <ProductGrid products={data.products} categories={categories} />}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <PageHero
        title="Shop"
        text="Sauces and merchandise from Whizz Kitchen."
        image={hero.image}
        imagePosition={hero.position}
      />
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
            <ProductGridSkeleton />
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </>
  );
}