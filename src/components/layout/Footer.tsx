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

// Every footer link: 12px of padding above and below the text (a taller tap area),
// a quick press shrink, and a keyboard ring that shows on the dark background.
const linkClass =
  "inline-block origin-left rounded-md py-1.5 " +
  "transition-[scale,color] duration-(--duration-quick) ease-(--ease-out) " +
  "hover:text-cream active:scale-97 active:text-cream motion-reduce:active:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-primary text-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:px-6">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display font-bold text-2xl">Whizz Kitchen</p>
          <p className="mt-1 font-sans text-cream/70">Bring the flavour.</p>

          <div className="mt-3 flex flex-col items-start font-sans text-sm text-cream/80">
            {SITE.email && (
              <a href={`mailto:${SITE.email}`} className={linkClass}>
                {SITE.email}
              </a>
            )}
            {SITE.phone && (
              <a href={`tel:+${SITE.phone}`} className={linkClass}>
                {formatPhoneDisplay(SITE.phone)}
              </a>
            )}
          </div>
        </div>

        {/* One navigation landmark for all three columns. On wide screens it spans the three
            right-hand columns of the grid above; on phones it spans the full width. */}
        <nav
          aria-label="Footer"
          className="col-span-2 grid grid-cols-2 gap-10 md:col-span-3 md:grid-cols-3"
        >
          {COLUMNS.map((column) => (
            <div key={column.title}>
              {/* A real heading, so screen-reader users can jump between footer sections */}
              <h2 className="mb-2 font-sans text-xs font-bold uppercase tracking-wider text-cream/50">
                {column.title}
              </h2>
              <ul className="flex flex-col items-start font-sans text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${linkClass} text-cream/80`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-4 py-5 font-sans text-xs text-cream/50 md:px-6">
          © {new Date().getFullYear()} Whizz Kitchen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}