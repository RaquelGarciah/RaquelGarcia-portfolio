# CLAUDE.md — Raquel García · Interactive Portfolio

This file tells Claude Code exactly what to build. Read it fully before writing any code. When in doubt, prefer fewer dependencies, clean code, and restraint over flourish. The aesthetic is **minimalist, elegant, professional** — never busy.

---

## 0. What this is

A personal portfolio website that doubles as an **interactive, conversational CV**. A visitor lands on a striking minimalist hero (a near-clone of https://andagain.uk), scrolls down through a reveal animation into a video of me waving, and keeps scrolling into an **Apple-iMessage-style chat** where they "talk to me" and explore my projects and experience by choosing options.

Owner: **Raquel García Hernández** — Mathematician, AI Engineer in the making.
Purpose: job applications (AI Engineering roles). It must look like it was built by someone senior.

---

## 1. Tech stack (fixed — do not substitute)

- **Next.js (latest stable, App Router) + TypeScript**
- **Tailwind CSS** for styling
- **GSAP + ScrollTrigger** for scroll-driven and kinetic animations
- **Lenis** (`@studio-freight/lenis` / `lenis`) for smooth scrolling
- **Framer Motion** allowed for small component-level transitions (chat bubble entrance, etc.)
- No backend. The chat is fully scripted (see §6). Everything is static / client-side.
- Deploy target: **Vercel**, repo on **GitHub**.

Keep the dependency list tight. Do not add UI kits, component libraries, or animation libraries beyond the above.

---

## 2. Design language

Replicate the *feeling* of andagain.uk, not its content. **These values are verified by inspecting the live site — use them exactly:**

- **Background: pure black `#000000`. Text: pure white `#FFFFFF`.** This is a dark site, high contrast, monochrome. (My earlier draft said cream — it was wrong. It's black.)
- **Typography — ONE typeface for everything: `Spezia`** (by Zetafonts). andagain uses Spezia for both the giant name and the small labels; there is **no monospace**. The whole look is one clean grotesque at two extreme scales: enormous for the name, ~20px for the labels.
  - **If we can license Spezia:** download it from zetafonts.com and self-host via `next/font/local`. Spezia is a **commercial** typeface — only use it if properly licensed for web.
  - **Free fallback (default unless told otherwise):** the closest free grotesques are **Inter** (weight 800–900 for the name), **Hanken Grotesk**, or **Archivo**. Pick ONE, load via `next/font/google`, and commit. Use a heavy weight for the display name so it reads like Spezia's bold scaled-up look.
- **Layout:** content pinned flush to the edges with thin 1px divider rules (one horizontal under the name, one vertical splitting the label row into columns). Generous black negative space. Thin nav.
- **Motion:** smooth, weighty, never bouncy. Easing like `power3.out`/`power4.out`. Nothing flashes or spins gratuitously.
- **Accent color:** monochrome only. The single exception is the iMessage blue (`#0B93F6`) inside the chat (dark-mode iMessage — see §6).
- Fully **responsive** (mobile-first; the chat must feel native on a phone). Respect `prefers-reduced-motion`: if set, disable scroll animations and just show content.

---

## 3. Page structure (single page, scroll-driven, in this order)

```
/  (one long page)
├─ <TopNav>            fixed, minimal
├─ <Hero>             section 1 — kinetic name + tagline
├─ <VideoReveal>      section 2 — my waving video, plays on scroll-in
└─ <ChatCV>           section 3 — Apple iMessage interactive CV
   └─ <ContactCard>   reachable from nav "Nice to meet you" and from chat end
```

Lenis drives a single smooth scroll. GSAP ScrollTrigger sequences the reveals between sections.

---

## 4. Section 1 — Hero (clone of andagain.uk landing)

> ### Replication prompt for the landing (verified against the live site)
> Recreate the andagain.uk hero: a **pure-black** full-viewport screen, white text. The focal point is the name rendered as **a single inline SVG sized by its `viewBox` (the live site uses `viewBox="0 0 779 313"`) with `width:100%`** so it scales to fill the entire viewport width edge-to-edge and stays flush to the top — this is exactly how andagain makes the name huge and perfectly responsive (it is NOT a px font-size; it's a scaled SVG). The name **animates on load as a single mask reveal**: the whole word sits inside an `overflow:hidden` wrapper and slides up into view from below the clip line (translateY 100%→0). Directly under the name: a thin 1px white divider rule, then a row of ~20px labels split by a thin vertical rule into columns. One short tagline sits in the right column at mid size (~clamp(1.6rem, 3vw, 2.6rem), line-height ~1.1). Minimalist, huge black negative space below. On scroll the page moves with **smooth/virtual scrolling** (content translated in Y, not native scroll) and the name parallaxes slightly upward.

**My customizations (apply these — they differ from andagain):**

1. **The animated name is `RaquelGarcia`** (one word, capital R and G), rendered as the **full-width scaled SVG** described above, flush to the top edge, white on black. Same staggered mask-reveal animation as andagain's wordmark. This is the hero's hero.
2. **Label row layout (left to right), on the line below the name's divider rule:**
   - Left column — where andagain says "Digital agency London" → write **`Mathematician`**.
   - Center column — where andagain says "Contact ↓" → write **`Nice to meet you ↓`** (see #4).
   - **Remove the right "Local time → ..." element entirely.** No clock. (This leaves two columns instead of three — rebalance the divider rules accordingly.)
3. **`Nice to meet you ↓`** is styled as a hyperlink. It opens the contact info (see §7 ContactCard — smooth modal/overlay, or anchor-scroll to a contact block). It must surface **phone, email, and GitHub.**
4. **Replace the andagain tagline** ("Bringing together strategy, creativity and technology...") **with my intro, punchy and high-impact.** Place it in the right column, white text. Use this copy (you may tighten, do not inflate):

   > **"I turn pattern recognition into business decisions. Mathematician and statistician shipping AI from research to production — I took an algorithm from 25% to 75% detection over 10M daily events, and turned weeks of manual work into days."**

   A shorter alternative for small screens:
   > **"I turn pattern recognition into decisions. Mathematician shipping AI from research to production."**

Keep the rest of the andagain hero scaffolding (the Spezia labels in white, the ↓ cue, the thin divider rules, the spacing) but **do not** copy their projects carousel, client logos, or agency footer — those are replaced by sections 2 and 3.

### Animation & scroll — exact spec

*Structure below is verified against the live site. Durations/easings are the correct production values for this pattern (frame-level timing couldn't be captured live due to browser timer throttling — these reproduce the same feel).*

**Name reveal (on load):**
- Render the SVG name inside a wrapper with `overflow: hidden`.
- Animate the SVG from `translateY(100%)` → `translateY(0)` (it rises up from behind the clip line). Single mask reveal of the whole word — **not** per-letter.
- Duration **~0.9s–1.1s**, easing **`expo.out`** (GSAP) or cubic-bezier `(0.16, 1, 0.3, 1)` (Framer Motion `ease`/custom). Start after fonts/SVG are ready, ~100ms delay.
- The label row and tagline fade+rise in just after, with a small **~120ms** offset from the name (subtle stagger between elements, not between letters).
- If you prefer a touch more life, an optional per-letter stagger of ~50ms is acceptable, but the verified site reads as a single-word reveal — default to that.

**Smooth scroll:**
- Use **Lenis** for smooth/virtual scrolling (the reference translates content in Y rather than native scroll). Sensible config: `lerp: 0.1` (or `duration: 1.1`, `easing: easeOutExpo`), `smoothWheel: true`. This gives the weighty, slightly-delayed glide of the reference.
- Drive section transitions with **GSAP ScrollTrigger** synced to Lenis (call `ScrollTrigger.update` on Lenis `scroll`).

**Hero parallax:** as the user scrolls down, translate the giant name upward at a slightly slower rate than scroll (e.g. `yPercent: -15` across the hero's scroll range via a ScrollTrigger scrub) so it drifts up and out — matching the reference.

**Section reveals (video + chat):** each enters with a soft mask/translateY+fade (`y: 40 → 0`, opacity `0 → 1`, ~0.8s `power3.out`) triggered when ~20% into view. Keep it restrained; one move per element.

**Reduced motion:** if `prefers-reduced-motion: reduce`, skip all of the above — render final states, disable Lenis (use native scroll), no parallax.

---

## 5. Section 2 — Video reveal

- As the user scrolls past the hero, a **video of me waving / greeting** scrolls into view and **auto-plays when it enters the viewport** (IntersectionObserver or ScrollTrigger `onEnter`). Pause when it leaves.
- Video must be **muted, `playsInline`, `loop`** (autoplay only works muted). Add a small unobtrusive unmute toggle.
- Entrance animation: the video reveals with a mask/clip-path wipe or a scale-from-95%+fade as it pins briefly, matching the andagain scroll feel.
- **PLACEHOLDER:** I don't have the video yet. Put it at `public/media/raquel-wave.mp4` and reference it via a single constant. If the file is missing, render a tidy placeholder block (a rounded `16:9` frame, dark `#111` with a thin white border, centered white text `[ video coming soon ]`) so the layout never breaks. Leave a clear `// TODO: replace with real video` comment and document the expected path/format (mp4, H.264, ~1080p, <10s, <8MB) in the README.

---

## 6. Section 3 — Interactive CV (Apple iMessage style)

A faithful **iMessage** recreation, scripted (no AI, no backend). The conversation is a deterministic state machine.

**Visual fidelity (dark-mode iMessage, to sit on the black site):**
- A phone-like chat column, centered, max-width ~420px, on the black background.
- **My messages ("ME" = Raquel): blue bubbles (`#0B93F6`), white text, right-aligned.**
- **Visitor messages ("YOU"): dark-gray bubbles (`#26252C` / `#3B3B3D`), white text, left-aligned** (dark-mode iMessage style).
- Rounded bubbles with the classic iMessage tail on the last bubble of a group. Small timestamps optional.
- **Typing indicator** (three animated dots in a gray bubble) shows for ~700–1200ms before each of my messages, to feel alive.
- New bubbles animate in (slide-up + fade, Framer Motion). Auto-scroll the chat to the newest message.

**Scripted flow (state machine):**

1. Typing… → ME: **"Hi! How did you end up here? Who am I talking with?"**
2. Visitor input: a **text input** labeled like an iMessage compose bar. They type their name. (`YOU: Hey, I'm ____`)
3. Typing… → ME: **"So nice to meet you, {name}!! I'm Raquel — a mathematician who turns data into decisions and ships AI products end to end. What would you like to know about me?"**
   - (`{name}` is interpolated from their input; sanitize/escape it; if empty, fall back to "stranger".)
4. Present **option chips/buttons** as the visitor's possible replies: **`PROJECTS`** and **`EXPERIENCE`**. (Render them as tappable pill buttons in the visitor's gray style.)
5. When tapped, that choice appears as a YOU bubble, then I reply with the relevant content (see content below), delivered as a short sequence of 2–4 bubbles with typing pauses between them.
6. After answering, always re-offer the remaining option(s) plus a final **`HOW DO I REACH YOU?`** chip that reveals the ContactCard inline (phone, email, GitHub) and a closing friendly line. Let the visitor explore both branches; don't dead-end.

**Branch content — PROJECTS** (write as natural chat bubbles, first person, warm but precise):
- Anomaly detection in production: architected and deployed from scratch; runs daily flagging data inconsistencies and outliers across high-volume datasets with automated alerts. Pushed detection from **25% → 75% over 10M daily events.**
- AI image-processing tool: processed **2,000+ images**, compressing weeks of manual review into days.
- Automated cross-team validation workflows + monthly production reporting, giving developers and clients real visibility.
- Geospatial visualizations that turned mathematical models into business decisions.
- Personal builds: heavy Claude Code user; ships RAG, tool-calling agents (LangGraph), and an MCP server as side projects. (Link these to GitHub once repos exist — leave `// TODO: add repo links`.)

**Branch content — EXPERIENCE** (chat bubbles):
- **Data Scientist, Telefónica Tech (Talentum Scholarship), Madrid — 2025–present.** On Smartsteps, a leading mobility-analytics platform across Spain & UK. Technical liaison bridging engineering and clients; shipped the production work above.
- **Education:** BSc Mathematics & Data Science, Universidad Complutense de Madrid (2022–2026); MSc Technology Applied to the Organization of the Future, UNIR (2025–present).
- **Honors:** Harvard Hackathon Distinction; Lovable Hackathon Winner; Highest Distinction in Regression Models & Big Data; Amancio Ortega Foundation Scholarship; research honorable mention (AI & Big Data).
- **Stack:** Python, R, SQL, MATLAB; PySpark/Spark/Databricks, MongoDB; ML (time series, Bayesian inference, clustering, RNN, PCA); LLM tooling (RAG, MCP, agentic workflows, Claude Code).
- **Languages:** Spanish (native), English (C1), French (intermediate), German (basic).

Store all this chat content in a single typed config file (e.g. `src/data/conversation.ts`) so I can edit copy without touching components. The chat engine reads from that config — content and logic are separated.

---

## 7. ContactCard (shared)

Reusable component surfaced by the hero's "Nice to meet you ↓" link and by the chat's contact chip.
- **Phone:** +34 640 73 70 98 (`tel:` link)
- **Email:** raquelgarciahernandez04@gmail.com (`mailto:` link)
- **GitHub:** `https://github.com/RaquelGarciah`
- Optional LinkedIn slot, left as TODO.
Style: minimal, mono labels, large tappable rows. As a modal/overlay it fades in with a subtle backdrop; closes on ESC and backdrop click.

---

## 8. File structure (suggested)

```
src/
  app/
    layout.tsx        # fonts, Lenis provider, metadata/SEO
    page.tsx          # composes Hero + VideoReveal + ChatCV
    globals.css
  components/
    TopNav.tsx
    Hero.tsx
    KineticName.tsx   # the RaquelGarcia mask-reveal animation
    VideoReveal.tsx
    ChatCV.tsx        # state machine + rendering
    ChatBubble.tsx
    TypingIndicator.tsx
    OptionChips.tsx
    ContactCard.tsx
  data/
    conversation.ts   # all chat copy + branch content
    profile.ts        # contact info, name, tagline constants
  lib/
    lenis.ts
    gsap.ts
public/
  media/raquel-wave.mp4   # PLACEHOLDER
```

---

## 9. Quality bar

- TypeScript strict, no `any`. Components small and focused.
- Accessible: semantic HTML, keyboard-navigable chips, focus traps in the modal, `aria-live` for incoming chat bubbles, alt/labels everywhere.
- `prefers-reduced-motion`: skip GSAP timelines, show final states.
- Lighthouse: aim 95+ on performance & accessibility. Lazy-load the video. Use `next/font` for the chosen variable font.
- Mobile: the chat must look and feel native on a 390px-wide screen; the hero type must scale with `clamp()` and never overflow.
- SEO: real `<title>`, meta description, OpenGraph image (`public/og.png`, TODO), `lang="en"`.

---

## 10. Build order (do it in finishable milestones — commit after each)

1. Scaffold Next.js + TS + Tailwind; set fonts, colors, Lenis smooth scroll. Commit.
2. Hero with the **KineticName** `RaquelGarcia` mask-reveal + tagline + "Mathematician" label + "Nice to meet you ↓" link. No clock. Commit.
3. ContactCard modal wired to the hero link. Commit.
4. VideoReveal section with scroll-in autoplay + placeholder fallback. Commit.
5. ChatCV: bubble UI, typing indicator, name input, the full scripted state machine reading from `conversation.ts`. Commit.
6. Polish: responsive pass, reduced-motion, accessibility, Lighthouse. Commit.
7. README with run/deploy steps + list of TODO placeholders (video, GitHub handle, OG image). Commit.

After each milestone the site must run with `npm run dev` and build with `npm run build` clean.

---

## 11. Deployment

- Initialize a git repo, push to a new public GitHub repo (e.g. `raquel-portfolio`).
- Connect the repo to Vercel; deploy on push to `main`. No env vars needed (no backend).
- Document the Vercel + GitHub steps in the README.

---

## 12. Tone & copy rules

Direct, confident, warm, zero corporate filler and zero "AI" fluff. Short sentences. Real numbers over adjectives. The visitor should leave thinking *"this person is sharp and ships."* Do not overwrite the copy I provided with vaguer marketing language.

## 13. Open TODOs to leave clearly in code
- `public/media/raquel-wave.mp4` — real video.
- Repo links in PROJECTS (GitHub handle is set: RaquelGarciah).
- `public/og.png` — social share image.
- Optional LinkedIn URL.
