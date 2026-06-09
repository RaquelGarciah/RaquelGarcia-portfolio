"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { conversation, type OptionId } from "@/data/conversation";
import { useReducedMotion } from "@/lib/useReducedMotion";
import ChatBubble, { type Sender } from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import OptionChips from "./OptionChips";
import { ContactCard } from "./ContactCard";

type ChatItem =
  | { kind: "msg"; id: number; from: Sender; text: string }
  | { kind: "contact"; id: number };

type Mode = "idle" | "name" | "options";

const CONTENT_OPTIONS: OptionId[] = ["PROJECTS", "EXPERIENCE"];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function sanitizeName(raw: string): string {
  const cleaned = raw.replace(/[<>]/g, "").trim().slice(0, 40);
  return cleaned.length > 0 ? cleaned : conversation.fallbackName;
}

export default function ChatCV() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const [items, setItems] = useState<ChatItem[]>([]);
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [chips, setChips] = useState<OptionId[]>([]);
  const [draft, setDraft] = useState("");

  // Mutable flow state (read inside async sequences without stale closures).
  const idRef = useRef(0);
  const startedRef = useRef(false);
  const cancelledRef = useRef(false);
  const visitedRef = useRef<Set<OptionId>>(new Set());
  const closingSaidRef = useRef(false);
  const nameRef = useRef(conversation.fallbackName);

  const nextId = () => ++idRef.current;

  const pushMsg = useCallback((from: Sender, text: string) => {
    setItems((prev) => [...prev, { kind: "msg", id: nextId(), from, text }]);
  }, []);

  // Bot speaks a sequence of bubbles, with a typing indicator before each.
  const botSay = useCallback(async (texts: string[]) => {
    for (const text of texts) {
      if (cancelledRef.current) return;
      const think = reducedRef.current
        ? 200
        : 700 + Math.floor(((idRef.current * 137) % 500)); // 700–1200ms, deterministic
      setTyping(true);
      await delay(think);
      if (cancelledRef.current) return;
      setTyping(false);
      pushMsg("me", text);
      await delay(reducedRef.current ? 60 : 280);
    }
  }, [pushMsg]);

  const offerOptions = useCallback(() => {
    const remaining = CONTENT_OPTIONS.filter((o) => !visitedRef.current.has(o));
    setChips([...remaining, "CONTACT"]); // CONTACT always available, never dead-ends
    setMode("options");
  }, []);

  // Visitor picks a branch.
  const handleSelect = useCallback(
    async (id: OptionId) => {
      const opt = conversation.options[id];
      setMode("idle");
      setChips([]);
      pushMsg("you", opt.label);
      await delay(reducedRef.current ? 60 : 350);

      await botSay(opt.reply);
      if (cancelledRef.current) return;

      if (opt.revealsContact) {
        setItems((prev) => [...prev, { kind: "contact", id: nextId() }]);
        await delay(reducedRef.current ? 60 : 300);
      }
      if (id !== "CONTACT") visitedRef.current.add(id);

      const contentLeft = CONTENT_OPTIONS.filter(
        (o) => !visitedRef.current.has(o),
      );
      if (contentLeft.length === 0 && !closingSaidRef.current) {
        closingSaidRef.current = true;
        await botSay([
          conversation.closing.replace("{name}", nameRef.current),
        ]);
      } else {
        await botSay([conversation.reprompt]);
      }
      if (cancelledRef.current) return;
      offerOptions();
    },
    [botSay, offerOptions, pushMsg],
  );

  // Visitor submits their name.
  const handleNameSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (mode !== "name") return;
      const name = sanitizeName(draft);
      nameRef.current = name;
      setDraft("");
      setMode("idle");
      pushMsg("you", `Hey, I'm ${name}`);
      await delay(reducedRef.current ? 60 : 350);

      const greeting = conversation.greeting.map((t) =>
        t.replace("{name}", name),
      );
      await botSay(greeting);
      if (cancelledRef.current) return;
      offerOptions();
    },
    [botSay, draft, mode, offerOptions, pushMsg],
  );

  // Kick off the conversation when the chat first scrolls into view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    cancelledRef.current = false;

    const start = async () => {
      if (startedRef.current) return;
      startedRef.current = true;
      await botSay(conversation.intro);
      if (cancelledRef.current) return;
      setMode("name");
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          void start();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(section);

    return () => {
      cancelledRef.current = true;
      io.disconnect();
    };
  }, [botSay]);

  // Focus the compose input when it appears.
  useEffect(() => {
    if (mode === "name") inputRef.current?.focus();
  }, [mode]);

  // Auto-scroll the chat to the newest content.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [items, typing, mode, chips, reduced]);

  return (
    <section
      ref={sectionRef}
      id="chat"
      className="flex min-h-svh items-center justify-center px-4 py-24 sm:px-6"
    >
      {/* Phone-like chat column. */}
      <div className="flex h-[min(78svh,640px)] w-full max-w-[420px] flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-black">
        {/* Header bar — mimics the iMessage contact header. */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-imessage-blue)] text-sm font-bold">
            R
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Raquel García</p>
            <p className="text-xs text-white/45">iMessage</p>
          </div>
        </div>

        {/* Messages — internal scroll; data-lenis-prevent so the page's smooth
            scroll doesn't hijack wheel events inside the chat. */}
        <div
          ref={scrollRef}
          data-lenis-prevent
          className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-4"
          aria-live="polite"
          aria-label="Conversation with Raquel"
        >
          {items.map((item, i) => {
            if (item.kind === "contact") {
              return (
                <div key={item.id} className="my-2">
                  <ContactCard />
                </div>
              );
            }
            // Tail on the last bubble of a same-sender group.
            const next = items[i + 1];
            const tail = !(
              next &&
              next.kind === "msg" &&
              next.from === item.from
            );
            return (
              <ChatBubble
                key={item.id}
                from={item.from}
                text={item.text}
                tail={tail}
              />
            );
          })}

          <AnimatePresence>{typing && <TypingIndicator />}</AnimatePresence>
        </div>

        {/* Footer — either the compose bar (name step) or option chips. */}
        <div className="border-t border-white/10 px-4 py-3">
          {mode === "name" && (
            <form onSubmit={handleNameSubmit} className="flex items-center gap-2">
              <label htmlFor="chat-name" className="sr-only">
                Your name
              </label>
              <input
                ref={inputRef}
                id="chat-name"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={conversation.namePlaceholder}
                maxLength={40}
                autoComplete="off"
                className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-2 text-[15px] text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-imessage-blue)] text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                disabled={draft.trim().length === 0}
              >
                ↑
              </button>
            </form>
          )}

          {mode === "options" && (
            <OptionChips options={chips} onSelect={handleSelect} />
          )}

          {mode === "idle" && (
            <p className="py-2 text-center text-xs text-white/30">
              {items.length === 0 ? "Scroll into the chat to say hi" : "…"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
