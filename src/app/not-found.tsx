import type { Metadata } from "next";
import PageBand from "@/components/ui/PageBand";
import LinkButton from "@/components/ui/LinkButton";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PageBand
      narrow
      eyebrow="404"
      title="We couldn't find that page"
      text="The link may be old or mistyped. Try the shop or browse our recipes."
    >
      <div className="flex flex-wrap gap-3">
        <LinkButton href="/products">Shop</LinkButton>
        <LinkButton href="/recipes" variant="secondary">
          Recipes
        </LinkButton>
      </div>
    </PageBand>
  );
}