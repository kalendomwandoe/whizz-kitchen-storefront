const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

function isAuthPath(path: string): boolean {
  return AUTH_PATHS.some((p) => path === p || path.startsWith(`${p}?`) || path.startsWith(`${p}/`));
}

// Only ever allow redirecting to a path inside this site, and never back to an auth page.
export function getSafeRedirect(raw: string | null, fallback = "/"): string {
  if (
    raw &&
    raw.startsWith("/") &&
    !raw.startsWith("//") &&
    !raw.startsWith("/\\") &&
    !isAuthPath(raw)
  ) {
    return raw;
  }
  return fallback;
}

export function getRedirectFromLocation(fallback = "/"): string {
  if (typeof window === "undefined") return fallback;
  return getSafeRedirect(new URLSearchParams(window.location.search).get("redirect"), fallback);
}

// A login link that brings the visitor back to `currentPath` afterwards.
export function loginHref(currentPath: string): string {
  if (currentPath === "/" || isAuthPath(currentPath)) return "/login";
  return `/login?redirect=${encodeURIComponent(currentPath)}`;
}