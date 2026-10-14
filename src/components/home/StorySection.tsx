import ImageSlot from "@/components/about/ImageSlot";
import Prose from "@/components/ui/Prose";
import LinkButton from "@/components/ui/LinkButton";
import { SITE_IMAGES } from "@/lib/site-images";
import { STORY_SNIPPET } from "@/lib/home-content";


const IMAGES: typeof SITE_IMAGES = {
  chef: "/images/about/about-chef.jpeg",
  craft: "/images/about/about-culinary.jpeg",
  sauces: "https://res.cloudinary.com/efkyxljf/image/upload/v1791738482/homepage_beefire.jpg",
  aboutHero: "/images/about/about-hero.jpeg",
  contactHero: null,
};

export default function StorySection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-14 md:py-20 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        <ImageSlot
          src={IMAGES.craft}
          alt="Chef Whizzy in his chef's jacket"
          label="Photo of Chef Whizzy"
          className="aspect-[4/3] md:aspect-square"
        />
        <div>
          <p className="font-sans text-sm font-semibold text-accent uppercase tracking-wider mb-3">
            Our story
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-dark mb-5">
            Born from a passion for good food
          </h2>
          <Prose paragraphs={STORY_SNIPPET} />
          <LinkButton href="/about" className="mt-6">
            Read our story
          </LinkButton>
        </div>
      </div>
    </section>
  );
}