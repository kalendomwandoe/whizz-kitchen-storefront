import { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/recipes/RecipeCard";
import Skeleton from "@/components/ui/Skeleton";

const gridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6";

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5]" />
      ))}
    </div>
  );
}

export default function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className={gridClass}>
      {recipes.map((recipe, index) => (
        <RecipeCard key={recipe.id} recipe={recipe} priority={index < 3} />
      ))}
    </div>
  );
}