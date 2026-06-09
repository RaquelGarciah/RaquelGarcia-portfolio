"use client";

import { motion } from "framer-motion";

/** Three animated dots in a gray iMessage bubble, left-aligned (it's "me"
 * about to speak). The dot bounce is pure CSS so reduced-motion disables it. */
export default function TypingIndicator() {
  return (
    <motion.div
      className="flex justify-start"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      aria-label="Raquel is typing"
    >
      <div className="flex items-center gap-1 rounded-3xl rounded-bl-md bg-[var(--color-imessage-gray)] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot inline-block h-2 w-2 rounded-full bg-white/60"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
