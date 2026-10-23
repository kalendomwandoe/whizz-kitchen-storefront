"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetProductQuery } from "@/lib/redux/api/productApi";
import { useAddToCart } from "@/hooks/useAddToCart";
import { formatPrice } from "@/lib/format";
import VariantPicker from "@/components/products/VariantPicker";
import ProductReviews from "@/components/reviews/ProductReviews";
import StarRating from "@/components/reviews/StarRating";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { Product, ProductVariant } from "@/types/product";

const containerClass = "mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12";

function getDefaultVariant(product: Product): ProductVariant | null {
  return (
    product.variants.find((v) => !v.isComingSoon && v.stock > 0) ?? product.variants[0] ?? null
  );
}

interface ProductDetailProps {
  slug: string;
  /** The product the server already fetched. It is null if the server could not reach the API. */
  initialProduct: Product | null;
}

export default function ProductDetail({ slug, initialProduct }: ProductDetailProps) {
  // The server's copy shows instantly. This request then quietly refreshes it in the
  // background, and keeps it fresh later (for example after a review is posted).
  // currentData (not data) so we never show the PREVIOUS product while a new one loads.
  const { currentData: fetched, isLoading } = useGetProductQuery(slug);
  const product = fetched ?? initialProduct;
  const { addToCart, isLoading: isAdding, justAdded } = useAddToCart();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!product && isLoading) {
    return (
      <div className={containerClass}>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <Skeleton className="aspect-square" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 px-4">
        <p className="font-sans text-primary-dark/70 mb-4">We couldn&apos;t find that product.</p>
        <Link href="/products" className="font-sans font-semibold text-accent-text">
          ← Back to the shop
        </Link>
      </div>
    );
  }

  const selectedVariant =
    product.variants.find((v) => v.id === selectedId) ?? getDefaultVariant(product);

  // This size's photo, or any photo on the product (some sizes have none yet)
  const image = selectedVariant?.images[0] ?? product.variants.flatMap((v) => v.images)[0];

  const comingSoon = selectedVariant?.isComingSoon ?? false;
  const outOfStock = selectedVariant?.stock === 0;
  const canAdd = !!selectedVariant && !comingSoon && !outOfStock;
  // true for 1.2 seconds after a successful add: the button turns green and says "Added"
  const showAdded = justAdded && canAdd;

  return (
    <div className={containerClass}>
      <Link href="/products" className="font-sans text-sm font-semibold text-accent-text">
        ← All products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-4">
        <div className="relative aspect-square bg-cream rounded-xl overflow-hidden">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-sans text-primary/30">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-primary-dark">
            {product.name}
          </h1>

          {product.rating.count > 0 && (
            <a href="#reviews" className="flex items-center gap-2 w-fit">
              <StarRating rating={product.rating.average ?? 0} size={18} />
              <span className="font-sans text-sm text-primary-dark/70">
                {product.rating.average?.toFixed(1)} · {product.rating.count} review
                {product.rating.count === 1 ? "" : "s"}
              </span>
            </a>
          )}

          {product.description && (
            <p className="font-sans text-primary-dark/70">{product.description}</p>
          )}

          {selectedVariant &&
            (comingSoon ? (
              <p className="font-sans font-bold text-xl text-accent-text">Coming soon</p>
            ) : (
              <p className="font-sans font-bold text-2xl text-accent-text">
                {formatPrice(selectedVariant.price)}
              </p>
            ))}

          <VariantPicker
            variants={product.variants}
            selected={selectedVariant}
            onSelect={(variant) => setSelectedId(variant.id)}
          />

          <Button
            onClick={() => selectedVariant && addToCart(selectedVariant.id)}
            variant={showAdded ? "success" : "primary"}
            loading={isAdding}
            aria-disabled={!canAdd}
            className="mt-2 w-full md:w-auto"
          >
            {/* Both labels share one grid cell, so the button is always as wide as the longer one
                and never jumps when the words swap. The hidden one is also hidden from screen readers. */}
            <span className="inline-grid">
              <span
                aria-hidden={showAdded}
                className={`col-start-1 row-start-1 transition-opacity duration-(--duration-quick) ease-(--ease-out) ${
                  showAdded ? "opacity-0" : ""
                }`}
              >
                {comingSoon ? "Coming Soon" : outOfStock ? "Out of stock" : "Add to Cart"}
              </span>
              <span
                aria-hidden={!showAdded}
                className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 transition-opacity duration-(--duration-quick) ease-(--ease-out) ${
                  showAdded ? "" : "opacity-0"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Added
              </span>
            </span>
          </Button>

          <p className="font-sans text-xs text-muted">
            Order online, and we&apos;ll confirm everything with you on WhatsApp.
          </p>
        </div>
      </div>

      <section id="reviews" className="mt-12 md:mt-16 pt-8 border-t border-primary/10 scroll-mt-24">
        <ProductReviews productId={product.id} />
      </section>
    </div>
  );
}