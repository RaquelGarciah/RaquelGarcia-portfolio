# Raquel García — Interactive Portfolio

A personal portfolio that doubles as an **interactive, conversational CV**. A
minimalist black hero reveals a kinetic wordmark, scrolls into a waving video, and then into an
**Apple-iMessage-style chat** where visitors "talk" to me and explore my work by
tapping options.

Single page, scroll-driven, fully static — no backend.

## Demo

![Demo of the interactive portfolio: kinetic hero, video reveal, and iMessage-style chat CV](docs/demo.gif)

## Tech stack

- **Next.js 16** (App Router) + **TypeScript** (strict)
- **Tailwind CSS v4**
- **GSAP + ScrollTrigger** — kinetic name reveal, parallax, section reveals
- **Lenis** — smooth/virtual scrolling, synced to ScrollTrigger
- **Framer Motion** — chat bubble + modal micro-transitions
- Typeface: **Inter** (variable, via `next/font/google`) — free stand-in for
  Spezia, weight 900 for the giant wordmark

## Run locally

```bash
npm install          # if the npm cache complains about root-owned files, see Troubleshooting
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint
```

Requires Node 18.18+ (developed on Node 26).

## Project structure

```
src/
  app/
    layout.tsx          # Inter font, SEO metadata, SmoothScrollProvider
    page.tsx            # composes Hero + VideoReveal + ChatCV + ContactModal
    globals.css         # tokens (black/white + iMessage colors), reduced-motion
  components/
    TopNav.tsx          # fixed minimal nav
    Hero.tsx            # GSAP load reveal + scroll parallax
    KineticName.tsx     # full-width SVG wordmark (sized by viewBox)
    VideoReveal.tsx     # scroll-in autoplay video + placeholder fallback
    ChatCV.tsx          # iMessage state machine + rendering
    ChatBubble.tsx      # one bubble (blue = me, gray = you)
    TypingIndicator.tsx # animated dots
    OptionChips.tsx     # tappable reply pills
    ContactCard.tsx     # shared contact rows + modal overlay
    SmoothScrollProvider.tsx
  data/
    profile.ts          # name, tagline, contact info
    conversation.ts     # all chat copy + branch content (edit copy here)
  lib/
    gsap.ts             # registers ScrollTrigger once
    useReducedMotion.ts
    useIsomorphicLayoutEffect.ts
public/
  media/raquel-wave.mp4 # PLACEHOLDER — see TODOs
```

**Edit chat copy** in `src/data/conversation.ts` and identity/contact details in
`src/data/profile.ts` — no need to touch components.

## Accessibility & motion

- Honors `prefers-reduced-motion`: GSAP timelines and Lenis are skipped, final
  states render, native scrolling is used.
- Keyboard-navigable chips, focus-trapped contact modal (ESC + backdrop close),
  `aria-live` chat region, labels throughout.

## Open TODOs (placeholders left in code)

- **`public/media/raquel-wave.mp4`** — the real waving video.
  Expected format: **mp4 / H.264, ~1080p, <10s, <8MB**. Until it exists, the
  video section shows a tidy `[ video coming soon ]` placeholder automatically.
  Referenced via `VIDEO_SRC` in `src/components/VideoReveal.tsx`.
- **Repo links** for the personal builds — `// TODO` in
  `src/data/conversation.ts` (PROJECTS branch). GitHub handle is set to
  `RaquelGarciah`.
- **`public/og.png`** — social share image (1200×630). Referenced in
  `src/app/layout.tsx`.
- **LinkedIn URL** (optional) — `profile.contact.linkedin` in
  `src/data/profile.ts`; add a row in `ContactCard.tsx` once set.
- **Production domain** — `SITE_URL` in `src/app/layout.tsx` (used for OG
  `metadataBase`).

## Deployment (Vercel + GitHub)

1. Create a public GitHub repo (e.g. `raquel-portfolio`) and push:
   ```bash
   git add -A && git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/RaquelGarciah/raquel-portfolio.git
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com): **Add New → Project**, import the repo.
   Framework preset **Next.js** is detected automatically — no env vars needed.
3. Deploy. Every push to `main` redeploys.

## Troubleshooting

- **`npm install` fails with `EACCES` / "root-owned files" in `~/.npm`:** an old
  npm bug left root-owned cache files. Either run
  `sudo chown -R $(id -u):$(id -g) ~/.npm`, or install against a fresh cache:
  `npm install --cache /tmp/npm-cache --legacy-peer-deps`.
