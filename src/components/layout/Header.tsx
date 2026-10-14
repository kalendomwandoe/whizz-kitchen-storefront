"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { loginHref } from "@/lib/redirect";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  toggleMobileMenu,
  openAccountModal,
  closeAccountModal,
} from "@/lib/redux/slices/uiSlice";
import { openCart, closeCart } from "@/lib/redux/slices/cartSlice";
import { useGetCartQuery } from "@/lib/redux/api/cartApi";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Header() {
  const dispatch = useAppDispatch();
  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const customer = useAppSelector((state) => state.auth.customer);
  const pathname = usePathname();
  const { data: cart } = useGetCartQuery();
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-cream border-b border-primary/10">
      <div className="mx-auto max-w-6xl px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="relative h-14 w-[125px] sm:h-16 sm:w-[145px]">
          <Image
            src="/logo.png"
            alt="Whizz Kitchen"
            fill
            priority
            sizes="145px"
            className="object-contain"
          />
        </Link>

        {/* Desktop nav: visible from md (iPad portrait) upward */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans font-medium text-primary-dark hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Logged in: open the account modal. Logged out: go to the login page. */}
          {customer ? (
            <button
              onClick={() => {
                dispatch(closeCart());
                dispatch(openAccountModal());
              }}
              aria-label="My account"
              className="text-primary"
            >
              <UserIcon />
            </button>
          ) : (
            <Link href={loginHref(pathname)} aria-label="Log in" className="text-primary">
                  <UserIcon />
            </Link>
          )}

          <button
            onClick={() => {
              dispatch(closeAccountModal());
              dispatch(openCart());
            }}
            aria-label="Cart"
            className="relative text-primary"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-cream text-[10px] font-sans font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Hamburger: visible only below md */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Toggle menu"
            className="md:hidden text-primary"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}