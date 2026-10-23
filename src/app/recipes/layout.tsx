import type { Metadata } from "next";

// The recipes page is a client page and cannot declare its own title,
// so this layout declares it for everything under /recipes.
export const metadata: Metadata = { title: "Recipes" };

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}