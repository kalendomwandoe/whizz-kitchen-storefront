"use client";

import { ProductVariant } from "@/types/product";

interface VariantPickerProps {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

const isUnavailable = (v: ProductVariant) => v.isComingSoon || v.stock === 0;
// Placeholder sizes are hidden until real ones are set
const isPlaceholderSize = (size: string) => size.trim().toUpperCase() === "TBD";

const optionClass = (isSelected: boolean, disabled: boolean) =>
  `px-4 py-2 rounded-lg border font-sans text-sm font-medium transition-colors ${
    isSelected
      ? "bg-primary text-cream border-primary"
      : "bg-white text-primary-dark border-primary/20 hover:border-primary"
  } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`;

export default function VariantPicker({ variants, selected, onSelect }: VariantPickerProps) {
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
                <button
                  key={color}
                  type="button"
                  disabled={disabled}
                  aria-pressed={color === activeColor}
                  onClick={() => pickColor(color)}
                  className={optionClass(color === activeColor, disabled)}
                >
                  {color}
                </button>
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
            {sizeVariants.map((variant) => {
              const disabled = isUnavailable(variant);
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected?.id === variant.id}
                  onClick={() => onSelect(variant)}
                  className={optionClass(selected?.id === variant.id, disabled)}
                >
                  {variant.size}
                  {variant.isComingSoon ? " (Coming soon)" : variant.stock === 0 ? " (Out of stock)" : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}