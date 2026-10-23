"use client";

import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import { ProductVariant } from "@/types/product";
import { pickTransition, springs } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface VariantPickerProps {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

const isUnavailable = (v: ProductVariant) => v.isComingSoon || v.stock === 0;
// Placeholder sizes are hidden until real ones are set
const isPlaceholderSize = (size: string) => size.trim().toUpperCase() === "TBD";

interface OptionButtonProps {
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
  /** Buttons in the same row share this name, so the dark highlight can slide between them. */
  group: string;
  reduced: boolean;
  children: ReactNode;
}

function OptionButton({ isSelected, disabled, onClick, group, reduced, children }: OptionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSelected}
      onClick={onClick}
      className={`relative min-h-11 rounded-lg border px-4 py-2 font-sans text-sm font-medium transition-[scale,color,border-color] duration-(--duration-quick) ease-(--ease-out) enabled:active:scale-97 motion-reduce:enabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
        isSelected
          ? // the cream text waits a moment (the 0.12s), so it does not turn cream while the dark
            // highlight is still sliding in and the background behind it is still white
            "border-primary text-cream [transition-delay:0s,0.12s,0s]"
          : "border-primary/20 bg-white text-primary-dark enabled:hover:border-primary"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {/* The dark highlight. With a layoutId, motion slides it from the old choice to the new
          one. With Reduce Motion on there is no layoutId, so it simply appears. */}
      {isSelected && (
        <motion.span
          layoutId={reduced ? undefined : group}
          transition={pickTransition(springs.default, reduced)}
          // borderRadius goes in style so motion keeps the corners round while it stretches
          style={{ borderRadius: 7 }}
          className="absolute inset-0 bg-primary"
          aria-hidden="true"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

export default function VariantPicker({ variants, selected, onSelect }: VariantPickerProps) {
  const uid = useId();
  const reduced = usePrefersReducedMotion();

  const colors = [
    ...new Set(variants.map((v) => v.color).filter((c): c is string => Boolean(c))),
  ];
  const hasColors = colors.length > 0;
  const activeColor = selected?.color ?? null;

  // With colors, the size row shows only the sizes of the chosen color
  const sizeVariants = hasColors ? variants.filter((v) => v.color === activeColor) : variants;
  const showSizes = sizeVariants.some((v) => !isPlaceholderSize(v.size));

  const pickColor = (color: string) => {
    const inColor = variants.filter((v) => v.color === color);
    const sameSize = inColor.find((v) => v.size === selected?.size && !isUnavailable(v));
    const target = sameSize ?? inColor.find((v) => !isUnavailable(v)) ?? inColor[0];
    if (target) onSelect(target);
  };

  return (
    <div className="flex flex-col gap-4">
      {hasColors && (
        <div>
          <p className="font-sans text-sm font-semibold text-primary-dark mb-2">
            Color: <span className="font-normal">{activeColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const disabled = variants.filter((v) => v.color === color).every(isUnavailable);
              return (
                <OptionButton
                  key={color}
                  group={`${uid}-color`}
                  reduced={reduced}
                  disabled={disabled}
                  isSelected={color === activeColor}
                  onClick={() => pickColor(color)}
                >
                  {color}
                </OptionButton>
              );
            })}
          </div>
        </div>
      )}

      {showSizes && (
        <div>
          <p className="font-sans text-sm font-semibold text-primary-dark mb-2">
            Size: <span className="font-normal">{selected?.size}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((variant) => (
              <OptionButton
                key={variant.id}
                // Each colour has its own size row, so the highlight slides within a row and
                // does not fly across when the colour changes.
                group={`${uid}-size-${activeColor ?? "all"}`}
                reduced={reduced}
                disabled={isUnavailable(variant)}
                isSelected={selected?.id === variant.id}
                onClick={() => onSelect(variant)}
              >
                {variant.size}
                {variant.isComingSoon ? " (Coming soon)" : variant.stock === 0 ? " (Out of stock)" : ""}
              </OptionButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}