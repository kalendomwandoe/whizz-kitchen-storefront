"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useAddToCart } from "@/hooks/useAddToCart";
import StarRating from "@/components/reviews/StarRating";
import Button from "@/components/ui/Button";
import AddButtonLabel from "@/components/ui/AddButtonLabel";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [selected, setSelected] = useState<ProductVariant | undefined>(
    product.variants.find((v) => !v.isComingSoon) ?? product.variants[0],
  );
  const { addToCart, isLoading: isAdding, justAdded } = useAddToCart();

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

  const canAdd = !selected.isComingSoon && selected.stock > 0;
  const showAdded = justAdded && canAdd;
  const idleLabel = selected.isComingSoon
    ? "Not available yet"
    : selected.stock === 0
      ? "Out of stock"
      : "Add to Cart";

  return (
    // The whole card shrinks a little while the stretched link is pressed (and only then, so
    // pressing a size chip or the Add button does not squash the card too). No shrink with
    // Reduce Motion on.
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-primary/10 bg-white transition-[box-shadow,scale] duration-(--duration-quick) ease-(--ease-out) hover:shadow-md motion-safe:has-[a:active]:scale-[0.98]">
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
           className="object-cover transition-transform duration-300 ease-(--ease-out) motion-safe:group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-sans text-sm text-primary/30">
            No image
          </div>
        )}
      </div>

            <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
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
            <p className="font-sans text-sm font-semibold text-muted">Coming soon</p>
          ) : (
            <p className="font-sans font-semibold text-accent-text">{formatPrice(selected.price)}</p>
          ))}

        {toggleOptions.length > 1 && (
          <div className="relative z-10 flex flex-wrap gap-1.5">
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
                  // 36px tall with a mouse, 44px tall (and at least 44px wide) on a touch screen
                  className={`inline-flex min-h-9 items-center justify-center rounded-full border px-3 font-sans text-xs font-medium transition-[scale,background-color,border-color,color] duration-(--duration-quick) ease-(--ease-out) active:scale-97 motion-reduce:active:scale-100 pointer-coarse:min-h-11 pointer-coarse:min-w-11 ${
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

               {!allComingSoon && (
          // mt-auto pushes this to the bottom of the card, so every Add button lines up.
          // relative + z-10 lifts the button above the card's stretched link, so it can be
          // pressed on its own. It uses the same add-to-cart code as the product page.
          <div className="mt-auto pt-1">
            <Button
              onClick={() => addToCart(selected.id)}
              variant={showAdded ? "success" : "primary"}
              loading={isAdding}
              aria-disabled={!canAdd}
              aria-label={`${showAdded ? "Added" : idleLabel}, ${product.name}`}
              className="relative z-10 w-full"
            >
              <AddButtonLabel idle={idleLabel} showAdded={showAdded} icon={canAdd} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}