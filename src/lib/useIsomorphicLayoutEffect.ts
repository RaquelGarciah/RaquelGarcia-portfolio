import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client (runs before paint → no animation flash),
 * useEffect on the server (avoids the SSR warning). Standard GSAP pattern.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
