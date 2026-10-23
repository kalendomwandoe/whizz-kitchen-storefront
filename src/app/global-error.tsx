"use client";

// This screen REPLACES the whole layout, so it cannot rely on it:
// it brings its own <html>, <body> and styles.
import "./globals.css";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center bg-cream px-4 text-center font-sans text-primary-dark">
        <title>Something went wrong | Whizz Kitchen</title>
        <div role="alert">
          <h1 className="font-display font-bold text-title">Something went wrong</h1>
          <p className="mt-2 text-muted">The site didn&apos;t load properly. Please try again.</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-lg bg-accent-text px-5 py-2.5 font-semibold text-cream transition-colors hover:bg-[#9f4220]"
          >
            Try again
          </button>
          {/* A plain link on purpose: the app's router may be what broke */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="rounded-lg border border-primary bg-cream px-5 py-2.5 font-semibold text-primary transition-colors hover:bg-cream-dark"
          >
            Go to the home page
          </a>
        </div>
      </body>
    </html>
  );
}