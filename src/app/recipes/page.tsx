"use client";

import { useState } from "react";
import { useGetRecipesQuery } from "@/lib/redux/api/recipeApi";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getHeroImage } from "@/lib/home-content";
import RecipeGrid, { RecipeGridSkeleton } from "@/components/recipes/RecipeGrid";
import PageHero from "@/components/ui/PageHero";

const hero = getHeroImage("recipes");

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search.trim(), 300);

  const { data, isLoading, isError } = useGetRecipesQuery({
    search: query || undefined,
    limit: 50,
  });

  return (
    <>
      <PageHero
        title="Recipes"
        text="Simple ideas for bringing more flavour to your table."
        image={hero.image}
        imagePosition={hero.position}
      >
        <label htmlFor="recipe-search" className="sr-only">
          Search recipes
        </label>
        <input
          id="recipe-search"
          type="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-cream/20 bg-white px-4 py-2.5 font-sans text-sm text-primary-dark placeholder:text-primary-dark/40 focus:border-accent focus:outline-none md:w-96"
        />
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {isLoading && <RecipeGridSkeleton />}

        {isError && (
          <p className="py-16 text-center font-sans text-red-600">
            Something went wrong loading recipes.
          </p>
        )}

        {data && data.recipes.length > 0 && (
          <>
            <p className="mb-4 font-sans text-sm text-primary-dark/60">
              {data.pagination.total} recipe{data.pagination.total === 1 ? "" : "s"}
            </p>
            <RecipeGrid recipes={data.recipes} />
          </>
        )}

        {data && data.recipes.length === 0 && (
          <div className="py-16 text-center">
            <p className="mb-3 font-sans text-primary-dark/70">
              {query ? `No recipes match “${query}”.` : "No recipes yet. Check back soon."}
            </p>
            {query && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="font-sans font-semibold text-accent hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}