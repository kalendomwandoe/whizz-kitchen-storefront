import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { groupIngredients, splitSteps } from "@/lib/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  priority?: boolean;
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export default function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  const ingredientCount = groupIngredients(recipe.ingredients).reduce(
    (sum, group) => sum + group.items.length,
    0,
  );
  const stepCount = splitSteps(recipe.steps).method.length;

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-primary/10 bg-white hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-cream overflow-hidden">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-sans text-sm text-primary/30">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-sans font-bold text-lg text-primary-dark line-clamp-2">{recipe.title}</h3>
        {recipe.description && (
          <p className="font-sans text-sm text-primary-dark/60 line-clamp-2">{recipe.description}</p>
        )}
        <p className="font-sans text-xs font-semibold uppercase tracking-wide text-accent-text mt-1">
          {plural(ingredientCount, "ingredient")} · {plural(stepCount, "step")}
        </p>
      </div>
    </Link>
  );
}