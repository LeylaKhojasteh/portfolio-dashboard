"use client";

import { useSyncExternalStore } from "react";

function mediaQuery(): MediaQueryList | null {
  return typeof window === "undefined"
    ? null
    : window.matchMedia("(prefers-reduced-motion: reduce)");
}

function subscribe(onStoreChange: () => void): () => void {
  const query = mediaQuery();
  if (!query) return () => {};
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return mediaQuery()?.matches ?? false;
}

function getServerSnapshot(): boolean {
  return false;
}

/** True when the user prefers reduced motion. SSR-safe and reactive. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}