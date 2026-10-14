import type { Metadata } from "next";
import ImageSlot from "@/components/about/ImageSlot";
import Prose from "@/components/ui/Prose";
import LinkButton from "@/components/ui/LinkButton";
import { SITE_IMAGES  } from "@/lib/site-images";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Whizz Kitchen and Chef Whizzy: a passion for flavour, built on professional culinary excellence.",
};

// To add a photo: put the file in public/images/about/ and set its path here,
// for example "/images/about/chef-whizzy.jpg". Resize big phone photos to
// roughly 1600px wide first so the page loads quickly.
const IMAGES: typeof SITE_IMAGES = {
  chef: "/images/about/about-chef.jpeg",
  craft: "/images/about/about-culinary.jpeg",
  sauces: "https://res.cloudinary.com/efkyxljf/image/upload/v1791738482/homepage_beefire.jpg",
  aboutHero: "/images/about/about-hero.jpeg",
  contactHero: null,
};

const INTRO = [
  "Every great meal begins with a passion for flavour. At Whizz Kitchen, that passion has always been at the heart of everything we do.",
  "Founded in late 2024 by Chef Whizzy, Whizz Kitchen was born from a lifelong love of good food, culinary creativity, and the belief that every meal deserves something extraordinary.",
  "With experience as an Executive Chef at prestigious hospitality establishments, including JW Marriott and St. Regis, Chef Whizzy brings professional culinary expertise, creativity, and a deep appreciation for exceptional food to the brand.",
  "But Whizz Kitchen is more than a business. It's an extension of the culinary magic that earned its founder a name of his own.",
];

const NAME_STORY = [
  "Long before Whizz Kitchen became a brand, there was Chef Whizzy.",
  "The nickname came from the people who worked alongside him and witnessed his culinary magic firsthand. They saw the creativity, skill, and passion he brought into the kitchen — and the name stuck.",
  "When it came time to build a brand of his own, Whizz Kitchen felt natural. It was a way to bring that same spirit, personality, and love for great food beyond the professional kitchen and into people's everyday lives.",
];

const CRAFT = [
  "Since its beginnings in 2024, Whizz Kitchen has provided professional culinary services to high-profile clients who value quality, creativity, and attention to detail.",
  "That experience continues to shape our approach to food today. We believe great flavour comes from understanding ingredients, respecting the craft, and never settling for ordinary.",
];

const SAUCES = [
  "Through our signature Beefire Sauce, food inspiration, and recipes, we're bringing a little of that professional kitchen experience into everyday cooking.",
  "Whether you're preparing a quick meal at home, hosting friends, or experimenting with something new, we want Whizz Kitchen to inspire you to make every bite count.",
];

const BRAND = [
  "Our journey started with a passion for good food, but our vision reaches further.",
  "We're building Whizz Kitchen into a brand that celebrates flavour, creativity, and the experiences that bring people together around food. From sauces and recipes to merchandise and future creations, everything we do is guided by the same founding passion.",
  "We're here for the curious cooks, the adventurous eaters, the food lovers, and everyone who believes that ordinary meals can become extraordinary.",
];

const WELCOME = [
  "We're Whizz Kitchen — founded by Chef Whizzy, inspired by the craft of cooking, and driven by a passion for great food.",
  "We're glad you're here.",
];

export default function AboutPage() {
  return (
    <div>
           <PageHero
        eyebrow="About Whizz Kitchen"
        title="Born from a Passion for Good Food. Built on Culinary Excellence."
        image={IMAGES.aboutHero}
      />

      {/* 1. Intro, led by Chef Whizzy's photo */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:gap-14 md:px-6 md:py-16">
        <Prose paragraphs={INTRO} />
        <ImageSlot
          src={IMAGES.chef}
          alt="Chef Whizzy in his chef's jacket"
          label="Photo of Chef Whizzy"
          className="aspect-[4/5] order-first md:order-none"
          priority
        />
      </section>

      {/* 2. The story behind the name */}
      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-4 md:px-6 py-12 md:py-16">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-dark text-center mb-6">
            The Story Behind the Name
          </h2>
          <Prose paragraphs={NAME_STORY} />
          <p className="font-display font-bold text-xl text-primary text-center mt-8">
            A name inspired by a chef. A brand driven by flavour.
          </p>
        </div>
      </section>

      {/* 3a. The craft behind the brand */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        <ImageSlot
          src={IMAGES.craft}
          alt="Chef Whizzy at work in a professional kitchen"
          label="Photo of the kitchen and culinary craft"
          className="aspect-[4/3]"
        />
        <div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-dark mb-4">
            From Professional Kitchens to Your Table
          </h2>
          <Prose paragraphs={CRAFT} />
        </div>
      </section>

      {/* 3b. From the chef's expertise to the sauces at home */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 pb-10 md:pb-14 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        <div>
          <Prose paragraphs={SAUCES} />
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <LinkButton href="/products">Shop our sauces</LinkButton>
            <LinkButton href="/recipes" variant="secondary">
              Explore recipes
            </LinkButton>
          </div>
        </div>
        <ImageSlot
          src={IMAGES.sauces}
          alt="A dish made with Whizz Kitchen sauce"
          label="Photo of the sauces used in a real dish"
          className="aspect-[4/3]"
        />
      </section>

      {/* 4. A growing food brand */}
      <section className="mx-auto max-w-3xl px-4 md:px-6 py-10 md:py-14">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-dark text-center mb-6">
          More Than a Kitchen. A Growing Food Brand.
        </h2>
        <Prose paragraphs={BRAND} />
      </section>

      {/* 5. Welcome */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-14 md:py-20 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-cream mb-6">
            Welcome to Our World.
          </h2>
          <Prose paragraphs={WELCOME} tone="light" />
          <p className="font-display font-bold text-xl text-cream mt-8">
            Whizz Kitchen. Bring the flavour.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <LinkButton href="/products">Shop now</LinkButton>
            <LinkButton href="/recipes" variant="secondary">
              Explore recipes
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}