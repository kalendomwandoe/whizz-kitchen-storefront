"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import PageBand from "@/components/ui/PageBand";

const LINKS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/details", label: "Details" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const customer = useAuthRedirect();
  const pathname = usePathname();

  if (!customer) return null;

  return (
    <>
      <PageBand narrow title="My account" text={`Signed in as ${customer.email}`} />

      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
        <nav className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {LINKS.map((link) => {
            const active =
              link.href === "/account" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-sans text-sm font-medium ${
                  active ? "bg-primary text-cream" : "bg-cream text-primary-dark"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </>
  );
}