"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/profile";

const { contact } = profile;

interface Row {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const ROWS: Row[] = [
  { label: "Phone", value: contact.phone, href: contact.phoneHref },
  { label: "Email", value: contact.email, href: contact.emailHref },
  {
    label: "GitHub",
    value: contact.githubLabel,
    href: contact.github,
    external: true,
  },
  // TODO: optional LinkedIn row — add when profile.contact.linkedin is set.
];

/**
 * The contact rows themselves. Used both inline inside the chat and within
 * the modal overlay below. Large, tappable, mono-label rows.
 */
export function ContactCard({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-col ${className}`}>
      {ROWS.map((row) => (
        <li key={row.label} className="border-t border-[var(--color-rule)] last:border-b">
          <a
            href={row.href}
            {...(row.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group flex items-baseline justify-between gap-4 py-4 transition-opacity hover:opacity-60 focus-visible:opacity-60 focus-visible:outline-none"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">
              {row.label}
            </span>
            <span className="text-right text-base sm:text-lg">{row.value}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Modal overlay version: fades in over a backdrop, traps focus, closes on ESC
 * and backdrop click, and restores focus to the trigger on close.
 */
export function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    // Focus the close button once mounted.
    const id = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Simple focus trap within the panel.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      // Restore focus to whatever opened the modal.
      (triggerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="relative w-full max-w-md border border-[var(--color-rule)] bg-black p-7 sm:p-9"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 flex items-start justify-between">
              <h2
                id="contact-modal-title"
                className="text-2xl font-bold tracking-tight"
              >
                Nice to meet you.
              </h2>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close contact card"
                className="-mr-1 -mt-1 p-1 text-2xl leading-none text-white/60 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                ×
              </button>
            </div>
            <ContactCard />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
