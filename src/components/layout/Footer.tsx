import Link from "next/link";
import { SITE, formatPhoneDisplay } from "@/lib/site";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/products?category=sauces", label: "Sauces" },
      { href: "/products?category=merchandise", label: "Merchandise" },
      { href: "/recipes", label: "Recipes" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/track-order", label: "Track order" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-primary text-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:px-6">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display font-bold text-2xl">Whizz Kitchen</p>
          <p className="mt-1 font-sans text-cream/70">Bring the flavour.</p>

          <div className="mt-4 flex flex-col gap-1 font-sans text-sm text-cream/80">
            {SITE.email && (
              <a href={`mailto:${SITE.email}`} className="hover:text-cream">
                {SITE.email}
              </a>
            )}
            {SITE.phone && (
              <a href={`tel:+${SITE.phone}`} className="hover:text-cream">
                {formatPhoneDisplay(SITE.phone)}
              </a>
            )}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="mb-3 font-sans text-xs font-bold uppercase tracking-wider text-cream/50">
              {column.title}
            </p>
            <ul className="flex flex-col gap-2 font-sans text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/80 hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-4 py-5 font-sans text-xs text-cream/50 md:px-6">
          © {new Date().getFullYear()} Whizz Kitchen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}