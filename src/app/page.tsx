import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StorySection from "@/components/home/StorySection";
import HomeRecipes from "@/components/home/HomeRecipes";
import ComingSoonSection from "@/components/home/ComingSoonSection";
import HomeCta from "@/components/home/HomeCta";

export default function Home() {
  return (
    <>
      {/* The slides use h2s, so this single hidden h1 gives the page its main heading */}
      <h1 className="sr-only">Whizz Kitchen. Bring the flavour.</h1>
      <HeroSlider />
      <FeaturedProducts />
      <StorySection />
      <HomeRecipes />
      <ComingSoonSection />
      <HomeCta />
    </>
  );
}