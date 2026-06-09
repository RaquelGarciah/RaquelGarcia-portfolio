"use client";

import { motion } from "framer-motion";
import type { OptionId } from "@/data/conversation";
import { conversation } from "@/data/conversation";

/** Tappable pill buttons in the visitor's gray style — the visitor's possible
 * replies. Left-aligned, keyboard-navigable. */
export default function OptionChips({
  options,
  onSelect,
  disabled = false,
}: {
  options: OptionId[];
  onSelect: (id: OptionId) => void;
  disabled?: boolean;
}) {
  return (
    <motion.div
      className="flex flex-wrap justify-end gap-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {options.map((id) => (
        <button
          key={id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(id)}
          className="rounded-full border border-[var(--color-imessage-blue)] px-4 py-2 text-sm font-medium tracking-wide text-[var(--color-imessage-blue)] transition-colors hover:bg-[var(--color-imessage-blue)] hover:text-white focus-visible:bg-[var(--color-imessage-blue)] focus-visible:text-white focus-visible:outline-none disabled:opacity-40"
        >
          {conversation.options[id].label}
        </button>
      ))}
    </motion.div>
  );
}
