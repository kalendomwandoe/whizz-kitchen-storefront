"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false on the server and while React attaches to the server's HTML, then true.
// Use it when something depends on browser-only state (like the saved login), so the
// first drawing in the browser matches what the server drew.
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // in the browser, once hydrated
    () => false, // on the server, and during hydration
  );
}