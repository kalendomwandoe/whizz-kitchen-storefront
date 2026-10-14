// Brand photos used on the About page, the homepage and the page heroes.
// To add one: put the file in public/images/ and set its path here,
// for example "/images/about/chef-whizzy.jpg". Resize big phone photos to
// roughly 1600px wide first so pages load quickly.
export const SITE_IMAGES: {
  chef: string | null;
  craft: string | null;
  sauces: string | null;
  aboutHero: string | null; // wide banner photo behind the About page heading
  contactHero: string | null; // wide banner photo behind the Contact page heading
} = {
  chef: null,
  craft: null,
  sauces: null,
  aboutHero: null,
  contactHero: "/images/contact/contact-hero.jpeg",
};