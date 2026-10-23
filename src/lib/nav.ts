// The site's main navigation. Header and MobileMenu both read from here,
// so adding or renaming a page only ever happens in one place.
export const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** True on the link's own page and on pages inside it (/products and /products/jerk-sauce). */
export function isActiveLink(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}