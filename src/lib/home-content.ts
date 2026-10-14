export interface HeroSlide {
  id: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
  image: string | null; // null shows a plain espresso background with a soft glow
  imagePosition?: string; // CSS object-position, e.g. "center" or "70% 50%"
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "beefire",
    title: "Signature Sauces",
    text: "Our signature sauce with a serious kick.",
    cta: { label: "Shop Now", href: "/products?category=sauces" },
    image:
      "https://res.cloudinary.com/efkyxljf/image/upload/v1791738482/homepage_beefire.jpg",
    imagePosition: "center",
  },
  {
    id: "recipes",
    title: "Make something delicious",
    text: "Discover simple recipes using Whizz Kitchen products.",
    cta: { label: "Explore Recipes", href: "/recipes" },
    image: "https://res.cloudinary.com/efkyxljf/image/upload/v1791738483/homepage_recipe.jpg",
    imagePosition: "center",
  },
  {
    id: "story",
    title: "Made with flavour in mind",
    text: "Discover the story behind Whizz Kitchen.",
    cta: { label: "Our Story", href: "/about" },
    image:  "https://res.cloudinary.com/efkyxljf/image/upload/v1791738479/homepage_about_whizz.jpg"
  },
];

export const STORY_SNIPPET = [
  "Founded in late 2024 by Chef Whizzy, Whizz Kitchen was born from a lifelong love of good food, culinary creativity, and the belief that every meal deserves something extraordinary.",
  "With experience as an Executive Chef at prestigious hospitality establishments, including JW Marriott and St. Regis, Chef Whizzy brings professional culinary expertise, creativity, and a deep appreciation for exceptional food to the brand.",
];

// Lets other pages reuse a homepage slide's photo for their own hero
export function getHeroImage(slideId: string): { image: string | null; position: string } {
  const slide = HERO_SLIDES.find((s) => s.id === slideId);
  return { image: slide?.image ?? null, position: slide?.imagePosition ?? "center" };
}