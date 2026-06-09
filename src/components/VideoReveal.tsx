"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/useReducedMotion";

// TODO: replace with the real video.
// Expected: public/media/raquel-wave.mp4 — mp4 / H.264, ~1080p, <10s, <8MB.
const VIDEO_SRC = "/media/raquel-wave.mp4";

export default function VideoReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [missing, setMissing] = useState(false);
  const [muted, setMuted] = useState(true);

  // Entrance reveal: scale-from-95% + fade as the frame enters view.
  useIsomorphicLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(frame, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: frame, start: "top 80%" },
      });
    }, frame);

    return () => ctx.revert();
  }, [reduced]);

  // Autoplay only while in view; pause when it leaves.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || missing) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — leave paused */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [missing]);

  // Keep ScrollTrigger measurements correct once layout settles.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="video"
      className="flex min-h-svh items-center justify-center px-4 py-24 sm:px-6"
    >
      <div ref={frameRef} className="relative w-full max-w-4xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/15 bg-[#111]">
          {missing ? (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm uppercase tracking-[0.25em] text-white/50">
                [ video coming soon ]
              </span>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={VIDEO_SRC}
              muted={muted}
              loop
              playsInline
              preload="metadata"
              aria-label="Raquel waving hello"
              onError={() => setMissing(true)}
            />
          )}

          {/* Unobtrusive unmute toggle (only when a real video is playing). */}
          {!missing && (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs uppercase tracking-widest text-white/80 backdrop-blur transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
            >
              {muted ? "Sound on" : "Sound off"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
