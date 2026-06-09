"use client";

import { motion } from "framer-motion";

export type Sender = "me" | "you";

/**
 * One iMessage bubble. `me` = Raquel (blue, right). `you` = visitor (gray,
 * left). `tail` marks the last bubble of a sender group, which gets the
 * classic pointed corner; grouped bubbles above it use a softer corner.
 */
export default function ChatBubble({
  from,
  text,
  tail = true,
}: {
  from: Sender;
  text: string;
  tail?: boolean;
}) {
  const isMe = from === "me";

  return (
    <motion.div
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={[
          "max-w-[80%] whitespace-pre-wrap break-words px-4 py-2.5 text-[15px] leading-snug rounded-3xl",
          isMe
            ? "bg-[var(--color-imessage-blue)] text-white"
            : "bg-[var(--color-imessage-gray)] text-white",
          // Tail corner on the last bubble of a group.
          isMe ? (tail ? "rounded-br-md" : "") : tail ? "rounded-bl-md" : "",
        ].join(" ")}
      >
        {text}
      </div>
    </motion.div>
  );
}
