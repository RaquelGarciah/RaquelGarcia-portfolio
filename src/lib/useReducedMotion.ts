"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false; // assume motion on the server / first paint

/**
 * SSR-safe `prefers-reduced-motion` hook built on useSyncExternalStore — the
 * idiomatic way to subscribe to an external store (matchMedia) without
 * setState-in-effect. Returns `false` on the server, then the real value after
 * hydration. Use it to gate GSAP/Lenis timelines.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
