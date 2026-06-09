"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Wraps the app in Lenis smooth scrolling and wires it to GSAP ScrollTrigger,
 * matching the weighty, slightly-delayed glide of andagain.uk.
 *
 * Under prefers-reduced-motion we skip Lenis entirely and fall back to native
 * scrolling — ScrollTrigger still works against the native scroller.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Touch devices keep native momentum scrolling; only smooth the wheel.
      syncTouch: false,
    });

    // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both share one RAF loop.
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
