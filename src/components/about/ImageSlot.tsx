import Image from "next/image";

interface ImageSlotProps {
  src: string | null;
  alt: string;
  label: string; // shown in the placeholder until a real photo is added
  className?: string; // sets the shape, e.g. "aspect-[4/5]"
  priority?: boolean;
}

export default function ImageSlot({
  src,
  alt,
  label,
  className = "aspect-[4/5]",
  priority = false,
}: ImageSlotProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-cream ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6 text-center font-sans text-sm text-primary/40">
          {label}
        </div>
      )}
    </div>
  );
}