"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { loginHref } from "@/lib/redirect";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  toggleMobileMenu,
  openAccountModal,
  closeAccountModal,
} from "@/lib/redux/slices/uiSlice";
import { openCart, closeCart } from "@/lib/redux/slices/cartSlice";
import { useAddCartItemMutation, useGetCartQuery } from "@/lib/redux/api/cartApi";
import { ADD_TO_CART_KEY } from "@/hooks/useAddToCart";
import { NAV_LINKS, isActiveLink } from "@/lib/nav";
import { pickTransition, springs } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Same two-tone keyboard ring as the buttons (see buttonStyles.ts).
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

// Round 44px tap target with the same quick press shrink as the buttons.
const iconButton =
  "relative flex size-11 items-center justify-center rounded-full text-primary " +
  "transition-[scale,background-color] duration-(--duration-quick) ease-(--ease-out) " +
  "hover:bg-primary/5 active:scale-97 active:bg-primary/10 motion-reduce:active:scale-100 " +
  focusRing;

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
  const reduced = usePrefersReducedMotion();
  const authReady = useAppSelector((state) => state.auth.status === "ready");
  // Wait until we know who is shopping, so the cart is fetched with the right identity.
  const { data: cart } = useGetCartQuery(undefined, { skip: !authReady });

    const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  // The cart icon "bumps" whenever something is added to the cart, from any page.
  // This reads the same shared request state that useAddToCart writes (same fixedCacheKey).
  const [, addState] = useAddCartItemMutation({ fixedCacheKey: ADD_TO_CART_KEY });
  const bumpKey = addState.fulfilledTimeStamp;


  const cartLabel =
    itemCount > 0 ? `Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Cart";

  // Scroll edge (skill §12): an invisible marker sits at the very top of the page.
  // While it is on screen the page has not scrolled, so the header shows no line.
  // Once it scrolls out of view, content is passing under the header and the line fades in.
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const element = sentinel.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={sentinel}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-2"
      />

      <header className="glass sticky top-0 z-(--z-header) pb-px">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link
            href="/"
            className={`relative h-14 w-[125px] rounded-md sm:h-16 sm:w-[145px] ${focusRing}`}
          >
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
          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-md px-1 font-sans font-medium underline-offset-8 transition-colors duration-(--duration-quick) ${focusRing} ${
                    active
                      ? "text-primary-dark underline decoration-accent decoration-2"
                      : "text-primary-dark hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* -mr-2.5 cancels the padding inside the 44px buttons, so the icons stay where they were */}
          <div className="-mr-2.5 flex items-center">
            {/* Logged in: open the account modal. Logged out: go to the login page. */}
            {!authReady ? (
              // Still checking for a saved login: a quiet placeholder of the same size,
              // so the icon does not jump from "Log in" to "My account".
              <span aria-hidden="true" className="flex size-11 items-center justify-center text-primary/40">
                <UserIcon />
              </span>
            ) : customer ? (
              <button
                type="button"
                onClick={() => {
                  dispatch(closeCart());
                  dispatch(openAccountModal());
                }}
                aria-label="My account"
                className={iconButton}
              >
                <UserIcon />
              </button>
            ) : (
              <Link href={loginHref(pathname)} aria-label="Log in" className={iconButton}>
                <UserIcon />
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                dispatch(closeAccountModal());
                dispatch(openCart());
              }}
              aria-label={cartLabel}
              className={iconButton}
            >
                            {/* key={bumpKey}: each successful add is a new element, so it kicks bigger and settles
                  back with a spring. Nothing happens on page load, or with Reduce Motion on. */}
              <motion.svg
                key={bumpKey}
                initial={bumpKey && !reduced ? { scale: 1.3 } : false}
                animate={{ scale: 1 }}
                transition={pickTransition(springs.sheet, reduced)}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </motion.svg>
              {itemCount > 0 && (
                // key={itemCount}: a new number is a new element, so it pops in with a small spring.
                // With Reduce Motion on, it simply appears. The label above already carries the count.
                <motion.span
                  key={itemCount}
                  aria-hidden="true"
                  initial={reduced ? false : { scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={pickTransition(springs.sheet, reduced)}
                  className="absolute top-1.5 right-1.5 bg-accent text-cream text-[10px] font-sans font-bold rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Hamburger: visible only below md */}
            <button
              type="button"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className={`${iconButton} md:hidden`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* The scroll edge: a hairline that fades in only once content scrolls under the header */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-(--glass-border) transition-opacity duration-(--duration-base) ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </header>
    </>
  );
}