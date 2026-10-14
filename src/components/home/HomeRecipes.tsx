"use client";

import { useGetRecipesQuery } from "@/lib/redux/api/recipeApi";
import RecipeCard from "@/components/recipes/RecipeCard";
import SectionHeader from "@/components/home/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

export default function HomeRecipes() {
  const { data, isLoading } = useGetRecipesQuery({ limit: 3 });
  const recipes = data?.recipes ?? [];

  if (!isLoading && recipes.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-14 md:py-20">
        <SectionHeader
          title="Recipes to try"
          text="Simple ideas for bringing more flavour to your table."
          href="/recipes"
          linkLabel="All recipes"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
            : recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      </div>
    </section>
  );
}