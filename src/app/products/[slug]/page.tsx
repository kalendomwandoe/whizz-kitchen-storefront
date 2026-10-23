import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { getProduct } from "@/lib/server/getProduct";
import ProductDetail from "@/components/products/ProductDetail";

// A short description for search results and link previews: the product's own text, trimmed
// to a sentence-sized length. If it has none, a plain line made from the product name.
function describe(name: string, description: string | null): string {
  const text = description?.replace(/\s+/g, " ").trim();
  if (!text) return `${name} from ${SITE.name}. ${SITE.tagline}`;
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text;
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProduct(slug);

  // No product to describe: a plain title (the page itself shows the 404 or the error)
  if (result.status !== "ok") {
    return { title: result.status === "not-found" ? "Product not found" : "Product" };
  }

  const { product } = result;
  const photo = product.variants.flatMap((v) => v.images)[0];
  const description = describe(product.name, product.description);
  const url = `${SITE.url}/products/${product.slug}`;
  const images = photo ? [{ url: photo.url, alt: photo.altText ?? product.name }] : undefined;

  return {
    title: product.name, // the layout adds " | Whizz Kitchen"
    description,
    alternates: { canonical: url },
    openGraph: { title: product.name, description, url, siteName: SITE.name, type: "website", images },
    twitter: {
      card: photo ? "summary_large_image" : "summary",
      title: product.name,
      description,
      images: photo ? [photo.url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const result = await getProduct(slug);

  // A real "no such product" shows the site's 404 page
  if (result.status === "not-found") notFound();

  // key={slug}: going from one product to another starts the page fresh
  return (
    <ProductDetail
      key={slug}
      slug={slug}
      initialProduct={result.status === "ok" ? result.product : null}
    />
  );
}