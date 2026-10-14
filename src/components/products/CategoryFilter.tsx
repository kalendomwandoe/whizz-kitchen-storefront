import { Category } from "@/types/category";

interface CategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
  onSelect: (slug: string | undefined) => void;
}

const pill = "shrink-0 rounded-full px-4 py-2 font-sans text-sm font-medium whitespace-nowrap";
const categoryOrder = ["sauces", "snacks", "merchandise"];


export default function CategoryFilter({ categories, activeSlug, onSelect }: CategoryFilterProps) {

const sortedCategories = [...categories].sort((a, b) => { const aIndex = categoryOrder.indexOf(a.slug.toLowerCase()); const bIndex = categoryOrder.indexOf(b.slug.toLowerCase()); 
  // Categories not listed above appear after the preferred categories. 
  return ( (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex) ); });

  
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
      <button
        type="button"
        aria-pressed={!activeSlug}
        onClick={() => onSelect(undefined)}
        className={`${pill} ${!activeSlug ? "bg-primary text-cream" : "bg-cream text-primary-dark"}`}
      >
        All
      </button>
      {sortedCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          aria-pressed={activeSlug === category.slug}
          onClick={() => onSelect(category.slug)}
          className={`${pill} ${
            activeSlug === category.slug ? "bg-primary text-cream" : "bg-cream text-primary-dark"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}