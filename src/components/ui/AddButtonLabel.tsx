interface AddButtonLabelProps {
  /** What the button says normally, e.g. "Add to Cart" or "Out of stock". */
  idle: string;
  /** True for a moment after a successful add: the label becomes a tick and "Added". */
  showAdded: boolean;
  /** Show a small cart icon before the idle words. */
  icon?: boolean;
}

/**
 * The words inside an add-to-cart button. Both labels share one grid cell, so the button is
 * always as wide as the longer one and never changes width when the words swap. The hidden
 * label is also hidden from screen readers.
 */
export default function AddButtonLabel({ idle, showAdded, icon = false }: AddButtonLabelProps) {
  const fade = "transition-opacity duration-(--duration-quick) ease-(--ease-out)";
  return (
    <span className="inline-grid">
      <span
        aria-hidden={showAdded}
        className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2 ${fade} ${
          showAdded ? "opacity-0" : ""
        }`}
      >
        {icon && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        )}
        {idle}
      </span>
      <span
        aria-hidden={!showAdded}
        className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 ${fade} ${
          showAdded ? "" : "opacity-0"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Added
      </span>
    </span>
  );
}