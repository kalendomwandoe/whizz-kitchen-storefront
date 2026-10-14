"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/types/product";
import { formatPrice } from "@/lib/format";
import StarRating from "@/components/reviews/StarRating";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [selected, setSelected] = useState<ProductVariant | undefined>(
    product.variants.find((v) => !v.isComingSoon) ?? product.variants[0],
  );

  if (!selected) return null;

  const href = `/products/${product.slug}`;
  const allComingSoon = product.variants.every((v) => v.isComingSoon);
  // Use this size's photo, or any photo the product has (some sizes have none yet)
  const image = selected.images[0] ?? product.variants.flatMap((v) => v.images)[0];

  // Products with colors toggle by color; everything else toggles by size
  const hasColors = product.variants.some((v) => v.color);
  const toggleOptions: ProductVariant[] = hasColors
    ? product.variants.filter((v, i, all) => all.findIndex((x) => x.color === v.color) === i)
    : product.variants;

  const pick = (option: ProductVariant) => {
    if (hasColors) {
      // Keep the current size when switching color, if that size exists in the new color
      setSelected(
        product.variants.find((v) => v.color === option.color && v.size === selected.size) ??
          option,
      );
    } else {
      setSelected(option);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden border border-primary/10 bg-white hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-cream overflow-hidden">
        {allComingSoon && (
          <span className="absolute top-2 right-2 z-10 rounded-full bg-primary px-3 py-1 font-sans text-xs font-bold text-cream">
            Coming Soon
          </span>
        )}
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.name}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-sans text-sm text-primary/30">
            No image
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 flex flex-col gap-2">
        <h3>
          <Link
            href={href}
            className="font-sans font-bold text-primary-dark line-clamp-1 after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>

        {product.rating.count > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating.average ?? 0} size={13} />
            <span className="font-sans text-xs text-primary-dark/60">({product.rating.count})</span>
          </div>
        )}

        {!allComingSoon &&
          (selected.isComingSoon ? (
            <p className="font-sans text-sm font-semibold text-primary-dark/50">Coming soon</p>
          ) : (
            <p className="font-sans font-semibold text-accent">{formatPrice(selected.price)}</p>
          ))}

        {toggleOptions.length > 1 && (
          <div className="relative z-10 flex flex-wrap gap-1">
            {toggleOptions.map((option) => {
              const label = hasColors ? option.color : option.size;
              const isSelected = hasColors
                ? selected.color === option.color
                : selected.id === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => pick(option)}
                  className={`rounded-full border px-2.5 py-1 font-sans text-xs font-medium ${
                    isSelected
                      ? "border-primary bg-primary text-cream"
                      : "border-primary/20 text-primary-dark hover:border-primary"
                  } ${option.isComingSoon ? "opacity-50" : ""}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}