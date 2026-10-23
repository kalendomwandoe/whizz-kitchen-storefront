"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closeMobileMenu, openAccountModal } from "@/lib/redux/slices/uiSlice";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { loginHref } from "@/lib/redirect";
import { NAV_LINKS, isActiveLink } from "@/lib/nav";
import { pickTransition, springs } from "@/lib/motion";
import Skeleton from "@/components/ui/Skeleton";

// A menu row: big touch target, quick press shrink, same keyboard ring as the buttons.
const itemClass =
  "block w-full rounded-lg px-4 py-3 text-left font-sans text-lg font-semibold text-primary-dark " +
  "transition-[scale,background-color] duration-(--duration-quick) ease-(--ease-out) " +
  "hover:bg-cream-dark active:scale-97 active:bg-cream-dark motion-reduce:active:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-dark";

export default function MobileMenu() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const open = useAppSelector((state) => state.ui.mobileMenuOpen);
  const customer = useAppSelector((state) => state.auth.customer);
  const authReady = useAppSelector((state) => state.auth.status === "ready");
  const reduced = usePrefersReducedMotion();

  const close = () => dispatch(closeMobileMenu());
  useEscapeKey(open, close);

  // Any navigation closes the menu
  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [pathname, dispatch]);

  const spring = pickTransition(springs.default, reduced);

  // The panel "materializes" from the hamburger: it grows from its top-right corner while
  // the blur clears (skill §12). Closing plays the same thing backwards (skill §7).
  // With Reduce Motion on, only the opacity changes (skill §14).
  const panel: Variants = {
    closed: {
      ...(reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(8px)" }),
      transition: { ...spring, staggerChildren: reduced ? 0 : 0.02, staggerDirection: -1 },
    },
    open: {
      ...(reduced ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }),
      transition: {
        ...spring,
        filter: { type: "tween", duration: 0.25, ease: "easeOut" },
        delayChildren: reduced ? 0 : 0.05,
        staggerChildren: reduced ? 0 : 0.03,
      },
    },
  };

  // Each row fades up a few pixels, one after another.
  const row: Variants = {
    closed: reduced ? { opacity: 0 } : { opacity: 0, y: -6 },
    open: { opacity: 1, y: 0, transition: spring },
  };

  return (
    <div className="md:hidden">
      {/* AnimatePresence keeps an element on screen while its exit animation plays,
          then removes it. That is why the menu is no longer "if (!open) return null". */}
      <AnimatePresence>
        {open && (
          // Blurs the page behind the menu; tapping it closes the menu.
          // z-30 puts it UNDER the header (z-40), so the hamburger stays visible and usable.
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={pickTransition({ type: "tween", duration: 0.25, ease: "easeOut" }, reduced)}
            className="scrim fixed inset-0 z-30"
            onClick={close}
          />
        )}

        {open && (
          // A solid panel: always heavier than the glass header above it, so two see-through
          // layers never stack on top of each other. It sits just below the header.
          <motion.nav
            key="panel"
            id="mobile-menu"
            aria-label="Mobile"
            variants={panel}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-x-3 top-[calc(var(--header-h)+0.25rem)] z-(--z-sheet) origin-top-right rounded-2xl border border-primary/10 bg-cream p-2 shadow-xl"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(pathname, link.href);
                return (
                  <motion.li key={link.href} variants={row}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={itemClass}
                    >
                      <span
                        className={
                          active ? "underline decoration-accent decoration-2 underline-offset-8" : ""
                        }
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}

              <motion.li variants={row} className="mt-1 border-t border-primary/10 pt-1">
                {!authReady ? (
                  // Still checking for a saved login: a placeholder as tall as a menu row.
                  <div className="px-4 py-3" aria-hidden="true">
                    <Skeleton className="h-7 w-24" />
                  </div>
                ) : customer ? (
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
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}