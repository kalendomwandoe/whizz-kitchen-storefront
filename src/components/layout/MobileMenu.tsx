"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closeMobileMenu, openAccountModal } from "@/lib/redux/slices/uiSlice";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { loginHref } from "@/lib/redirect";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const itemClass =
  "block w-full rounded-lg px-4 py-3 text-left font-sans text-lg font-semibold text-primary-dark hover:bg-cream-dark";

export default function MobileMenu() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const open = useAppSelector((state) => state.ui.mobileMenuOpen);
  const customer = useAppSelector((state) => state.auth.customer);

  const close = () => dispatch(closeMobileMenu());
  useEscapeKey(open, close);

  // Any navigation closes the menu
  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [pathname, dispatch]);

  if (!open) return null;

  return (
    <div className="md:hidden">
      {/* Blurs the page behind the menu; tapping it closes the menu */}
      <div className="fixed inset-0 z-30 bg-primary/30 backdrop-blur-sm" onClick={close} />

      <nav
        aria-label="Mobile"
        className="fixed inset-x-3 top-[5.25rem] z-50 rounded-2xl border border-primary/10 bg-cream p-2 shadow-xl"
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={close} className={itemClass}>
                {link.label}
              </Link>
            </li>
          ))}

          <li className="mt-1 border-t border-primary/10 pt-1">
            {customer ? (
              <button
                type="button"
                onClick={() => {
                  close();
                  dispatch(openAccountModal());
                }}
                className={itemClass}
              >
                My account
              </button>
            ) : (
              <Link href={loginHref(pathname)} onClick={close} className={itemClass}>
                Log in
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}