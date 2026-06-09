"use client";

export default function TopNav({ onContact }: { onContact: () => void }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 mix-blend-difference sm:px-6">
      <a
        href="#hero"
        className="text-sm font-semibold tracking-tight text-white transition-opacity hover:opacity-60"
      >
        Raquel García
      </a>
      <button
        type="button"
        onClick={onContact}
        className="text-sm tracking-tight text-white underline-offset-4 transition-opacity hover:opacity-60 focus-visible:underline focus-visible:outline-none"
      >
        Nice to meet you ↓
      </button>
    </nav>
  );
}
