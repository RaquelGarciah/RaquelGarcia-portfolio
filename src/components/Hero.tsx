"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { profile } from "@/data/profile";
import KineticName from "./KineticName";

export default function Hero({ onContact }: { onContact: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reduced) return; // render final state, no motion

      // 1. Name mask reveal — single translateY(100%→0) wipe behind the clip.
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(".kinetic-name-svg", {
        yPercent: 100,
        duration: 1.0,
        ease: "expo.out",
      });

      // 2. Labels + tagline rise and fade in, just after the name.
      tl.from(
        ".hero-rise",
        {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        },
        "-=0.7",
      );

      // 3. Thin divider rule draws in.
      tl.from(
        ".hero-rule",
        { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power4.out" },
        "-=0.8",
      );

      // 4. Parallax — the giant name drifts up slightly slower than scroll.
      gsap.to(".kinetic-name-clip", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative flex min-h-svh flex-col px-4 pt-3 sm:px-6"
    >
      {/* The wordmark, flush to the top edge. */}
      <KineticName />

      {/* Thin divider rule directly under the name. */}
      <div className="hero-rule mt-2 h-px w-full bg-[var(--color-rule)]" />

      {/* Label row: two columns split by a thin vertical rule. */}
      <div className="grid grid-cols-1 gap-y-6 pt-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] sm:gap-x-8">
        {/* Left column — role label + contact cue. */}
        <div className="hero-rise flex flex-col gap-3 sm:border-r sm:border-[var(--color-rule)] sm:pr-8">
          <span className="text-[clamp(0.95rem,1.4vw,1.25rem)] tracking-tight text-white/70">
            {profile.role}
          </span>
          <button
            type="button"
            onClick={onContact}
            className="group inline-flex w-fit items-center gap-1 text-[clamp(0.95rem,1.4vw,1.25rem)] tracking-tight text-white underline-offset-4 transition-opacity hover:opacity-60 focus-visible:underline focus-visible:outline-none"
          >
            Nice to meet you
            <span className="transition-transform group-hover:translate-y-0.5" aria-hidden="true">
              ↓
            </span>
          </button>
        </div>

        {/* Right column — the tagline. Short form on small screens. */}
        <p className="hero-rise max-w-[24ch] text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.08] tracking-tight sm:max-w-none">
          <span className="hidden sm:inline">{profile.tagline}</span>
          <span className="sm:hidden">{profile.taglineShort}</span>
        </p>
      </div>

      {/* Scroll cue pinned near the bottom of the generous negative space. */}
      <div className="hero-rise mt-auto hidden items-center gap-2 pb-8 text-xs uppercase tracking-[0.25em] text-white/40 sm:flex">
        <span>Scroll</span>
        <span aria-hidden="true">↓</span>
      </div>
    </section>
  );
}
