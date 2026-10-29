"use client";

import { motion } from "motion/react";

/**
 * A spinner in the middle of the page, for when a whole page is on its way.
 * It waits a moment (0.2s) before appearing, so a page that arrives instantly never flashes it.
 */
export default function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.2 }}
      // Centred in the space below the header. dvh follows the phone's real visible height.
      className="flex min-h-[calc(100dvh-var(--header-h))] items-center justify-center"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        fill="none"
        className="size-14 animate-spin motion-reduce:animate-pulse"
      >
        {/* The faint full ring, then a bright arc that travels round it */}
        <circle
          cx="24"
          cy="24"
          r="19"
          strokeWidth="4"
          className="stroke-primary/15 contrast-more:stroke-primary/40"
        />
        <path d="M24 5a19 19 0 0 1 19 19" strokeWidth="4" strokeLinecap="round" className="stroke-accent-text" />
      </svg>
      <span className="sr-only">{label}</span>
    </motion.div>
  );
}