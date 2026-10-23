"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetRecipeQuery } from "@/lib/redux/api/recipeApi";
import { groupIngredients, splitSteps } from "@/lib/recipe";
import Skeleton from "@/components/ui/Skeleton";
import LinkButton from "@/components/ui/LinkButton";

const containerClass = "mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12";

export default function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: recipe, isLoading, isError } = useGetRecipeQuery(slug);

  if (isLoading) {
    return (
      <div className={containerClass}>
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-5 w-full max-w-xl mb-8" />
        <Skeleton className="aspect-[16/9] mb-10" />
        <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-12">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="text-center py-24 px-4">
        <p className="font-sans text-primary-dark/70 mb-4">We couldn&apos;t find that recipe.</p>
        <Link href="/recipes" className="font-sans font-semibold text-accent-text">
          ← Back to recipes
        </Link>
      </div>
    );
  }

  const groups = groupIngredients(recipe.ingredients);
  const { method, tips } = splitSteps(recipe.steps);

  return (
    <div className={containerClass}>
      <Link href="/recipes" className="font-sans text-sm font-semibold text-accent-text">
        ← All recipes
      </Link>

      <header className="mt-4 mb-6 max-w-3xl">
        <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-dark">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="font-sans text-lg text-primary-dark/70 mt-3">{recipe.description}</p>
        )}
      </header>

      {recipe.imageUrl && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-cream mb-10">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      )}

      <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-12 items-start">
        <aside className="rounded-xl bg-cream p-5 md:p-6 md:sticky md:top-24 md:max-h-[calc(100svh-7rem)] md:overflow-y-auto">
          <h2 className="font-display font-bold text-xl text-primary-dark mb-4">Ingredients</h2>

          <div className="flex flex-col gap-5">
            {groups.map((group, i) => (
              <div key={`${group.heading ?? "ingredients"}-${i}`}>
                {group.heading && (
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-accent-text mb-2">
                    {group.heading}
                  </h3>
                )}
                <ul className="flex flex-col gap-2 font-sans text-primary-dark/85">
                  {group.items.map((item, j) => (
                    <li key={j} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <section>
          <h2 className="font-display font-bold text-xl text-primary-dark mb-4">Method</h2>

          <ol className="flex flex-col gap-6">
            {method.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-sans text-sm font-bold text-cream">
                  {i + 1}
                </span>
                <p className="font-sans text-primary-dark/85 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>

          {tips.length > 0 && (
            <div className="mt-8 rounded-xl border-l-4 border-accent bg-cream p-4">
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-accent-text mb-1">
                {tips.length === 1 ? "Chef's tip" : "Chef's tips"}
              </p>
              {tips.map((tip, i) => (
                <p key={i} className="font-sans text-primary-dark/85">
                  {tip}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-14 rounded-2xl bg-primary px-6 py-10 text-center">
        <h2 className="font-display font-bold text-2xl text-cream mb-2">
          Bring more flavour to the dish
        </h2>
        <p className="font-sans text-cream/80 mb-6">Take a look at our sauces.</p>
        <LinkButton href="/products?category=sauces">Shop sauces</LinkButton>
      </div>
    </div>
  );
}