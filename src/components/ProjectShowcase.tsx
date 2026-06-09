"use client";

import { motion } from "framer-motion";
import { conversation } from "@/data/conversation";

const { projects, worklink } = conversation.options.PROJECTS;

/**
 * A selected-work bubble from Raquel ("me" → gray, left-aligned): three linked
 * GitHub projects, each a readable title + short blurb, with a smaller
 * "See selected work" link to the full GitHub profile at the bottom.
 */
export default function ProjectShowcase() {
  if (!projects?.length) return null;

  return (
    <motion.div
      className="flex justify-start"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-[88%] rounded-3xl rounded-bl-md bg-[var(--color-imessage-gray)] px-4 py-3.5 text-white">
        <ul className="flex flex-col gap-3.5">
          {projects.map((p) => (
            <li key={p.url}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-semibold leading-snug underline decoration-white/50 underline-offset-2 transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
              >
                {p.name}
              </a>
              <p className="mt-1 text-[13px] leading-snug text-white/85">
                {p.blurb}
              </p>
            </li>
          ))}
        </ul>

        {worklink && (
          <a
            href={worklink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs font-medium text-white/70 underline underline-offset-2 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
          >
            {worklink.label} →
          </a>
        )}
      </div>
    </motion.div>
  );
}
