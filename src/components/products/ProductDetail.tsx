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
import LinkButton from "@/components/ui/LinkButton";
import { Product, ProductVariant } from "@/types/product";

// The API answered "no such product" (a 404), as opposed to failing for some other reason
const isNotFound = (error: unknown) =>
  typeof error === "object" && error !== null && "status" in error && error.status === 404;

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
  const { currentData: fetched, isError, error, refetch } = useGetProductQuery(slug);
  const product = fetched ?? initialProduct;
  const { addToCart, isLoading: isAdding, justAdded } = useAddToCart();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  // "Try again": ask the API once more, and keep the error view on screen (with a spinner on
  // the button) until the answer comes back.
  const retry = async () => {
    setRetrying(true);
    try {
      await refetch().unwrap();
    } catch {
      // Still failing: the error view simply stays
    } finally {
      setRetrying(false);
    }
  };

    // Loading boxes only while we are still waiting for the first answer
  if (!product && !isError && !retrying) {
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
    // Two different problems, two different messages:
    // "not found" means the product does not exist, so trying again would not help.
    // Anything else (no connection, the server having a bad moment) is worth another go.
    if (isNotFound(error)) {
      return (
        <div className="px-4 py-24 text-center">
          <h1 className="mb-2 font-display text-2xl font-bold text-primary-dark">
            We couldn&apos;t find that product
          </h1>
          <p className="mb-6 font-sans text-primary-dark/70">
            It may have been removed, or the link may be mistyped.
          </p>
          <LinkButton href="/products">Back to the shop</LinkButton>
        </div>
      );
    }
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold text-primary-dark">
          We couldn&apos;t load this product
        </h1>
        <p role="alert" className="mb-6 font-sans text-primary-dark/70">
          This is usually a connection problem. Please try again.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Button onClick={retry} loading={retrying}>
            Try again
          </Button>
          <Link href="/products" className="font-sans text-sm font-semibold text-accent-text">
            ← Back to the shop
          </Link>
        </div>
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
                       <>
              {/* Backdrop: the same photo, tiny, enlarged and blurred. It fills the space beside a
                  tall or wide photo with its own colours. A square photo covers it completely. */}
              <Image
                src={image.url}
                alt=""
                aria-hidden="true"
                fill
                sizes="64px"
                className="scale-125 object-cover opacity-70 blur-2xl"
              />
              <Image
                src={image.url}
                alt={image.altText ?? product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </>
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