"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { profile } from "@/data/profile";
import KineticName, { NAME_BAND, ROLL_REST_YPERCENT } from "./KineticName";

// Tunables for the scroll zoom.
const PIN_DISTANCE = 1.1; // pin length in viewport heights (~110vh of scroll)
const ZOOM_SCALE = 5; // final scale of the wordmark
const ZOOM_ORIGIN = "50% 50%"; // grow from the name's center → overflows all edges

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reduced) return; // reduced motion → final states, no roll, no zoom

      // ── 1. Load reveal (once, time-based, independent of scroll) ──
      // Each half is a vertical ROLL — a column of copies that spins up through
      // the clip and decelerates onto the final one (slot-machine), staggered
      // between the two halves. Meanwhile the assembled word eases down from
      // oversized to final size. Labels + tagline appear AFTER the name lands.
      // Hidden start states set synchronously (before first paint) so the
      // reveal can never be skipped or flash the wrong frame.
      gsap.set(".kn-roll", { yPercent: 0 });
      gsap.set(".kinetic-name-inner", {
        scale: 1.22,
        transformOrigin: "50% 50%",
      });

      const load = gsap.timeline({ delay: 0.15 });
      load
        .to(
          ".kn-roll",
          {
            yPercent: ROLL_REST_YPERCENT,
            duration: 1.15,
            ease: "power4.out",
            stagger: 0.13,
          },
          0,
        )
        .to(
          ".kinetic-name-inner",
          { scale: 1, duration: 1.25, ease: "expo.out" },
          0,
        )
        .from(
          ".hero-rule",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "power4.out",
          },
          1.05,
        )
        .from(
          ".hero-rise",
          {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
          },
          1.15,
        );

      // ── 2. Scroll zoom (the star effect, scrubbed to scroll) ──
      gsap.set(".hero-name-zoom", { transformOrigin: ZOOM_ORIGIN });

      const zoom = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + window.innerHeight * PIN_DISTANCE,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      zoom
        .to(".hero-fade", { opacity: 0, ease: "none", duration: 0.3 }, 0)
        .to(
          ".hero-name-zoom",
          { scale: ZOOM_SCALE, ease: "power2.out", duration: 1 },
          0,
        );
    }, root);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative h-svh min-h-[640px] w-full overflow-hidden bg-[var(--color-bg)]"
      style={
        {
          "--name-h": NAME_BAND,
          // rule sits just below the name band (8px top inset + band + small gap)
          "--rule-top": "calc(8px + var(--name-h) + 6px)",
          "--side": "24px",
        } as React.CSSProperties
      }
    >
      {/* The wordmark — full bleed within the side margins, flush to the top. */}
      <div className="hero-name-zoom absolute left-[var(--side)] right-[var(--side)] top-2 will-change-transform">
        <KineticName />
      </div>

      {/* Everything below fades out as the scroll zoom takes over. */}
      <div className="hero-fade absolute inset-0">
        {/* Horizontal divider rule, full width, just under the name. */}
        <div
          className="hero-rule absolute left-[var(--side)] right-[var(--side)] h-px bg-[var(--color-rule)]"
          style={{ top: "var(--rule-top)" }}
        />

        {/* Vertical divider at ~40%, from the rule downward. */}
        <div
          className="hero-rise absolute bottom-0 w-px bg-[var(--color-rule)]"
          style={{ left: "40%", top: "var(--rule-top)" }}
        />

        {/* Left column — tease line + contact CTA, aligned to the name's left
            edge (left of the vertical divider). */}
        <div
          className="hero-rise absolute left-[var(--side)]"
          style={{ top: "calc(var(--rule-top) + 18px)" }}
        >
          <span className="text-[clamp(1.05rem,1.8vw,1.5rem)] font-normal text-black/75">
            Easy problems bore me.
          </span>
        </div>

        {/* Tagline — right zone, aligned to the divider, placed low with a big
            black gap above it and some breathing room below. */}
        <p
          className="hero-rise absolute right-[var(--side)] left-[40%] max-w-[28ch] pl-4 text-[clamp(1.6rem,3.3vw,2.6rem)] font-normal leading-[1.12] tracking-tight sm:max-w-[32ch]"
          style={{ top: "66vh" }}
        >
          <span className="hidden sm:inline">{profile.tagline}</span>
          <span className="sm:hidden">{profile.taglineShort}</span>
        </p>
      </div>
    </section>
  );
}
