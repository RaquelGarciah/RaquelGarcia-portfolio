// The hero wordmark, split into two equal halves — "Raquel" + "Garcia" — that
// roll into place with a stagger, mirroring andagain.uk's two-piece reveal
// (their "And" + "Again"). Together the halves read as one word, edge-to-edge.
//
// SIZE: each half fills a band of height `NAME_BAND`. The SVG uses
// preserveAspectRatio="none" so the glyphs fill that band — the cap height
// occupies almost all of the available height and the descenders reach the
// bottom (just above the divider rule), heavy and full-bleed.
//
// ROLL: each half is a clip exactly one band tall, holding a vertical column
// of identical copies. On load the column spins up through the copies and
// decelerates onto the final one (slot-machine / departure board). Hero drives
// the roll + scale settle (load) and the scroll zoom.

const VIEW_W = 600;
const VIEW_H = 196; // tight to glyph bounds: cap top ≈ 0, descender ≈ bottom

// Name band height. min(40vh, …vw) hits ~40% of the viewport on desktop while
// staying proportional (not absurdly tall) on narrow screens.
export const NAME_BAND = "max(96px, min(40vh, 30vw))";

// How many stacked copies spin past before settling. More = longer spin.
export const ROLL_COPIES = 5;
// yPercent (of the column) that rests on the final copy.
export const ROLL_REST_YPERCENT = -100 * ((ROLL_COPIES - 1) / ROLL_COPIES);

function Word({ text }: { text: string }) {
  return (
    <span
      className="kn-word-clip relative block flex-1 overflow-hidden"
      style={{ height: "var(--name-h)" }}
    >
      <span className="kn-roll absolute inset-x-0 top-0 flex flex-col">
        {Array.from({ length: ROLL_COPIES }).map((_, i) => (
          <svg
            key={i}
            className="block w-full"
            style={{ height: "var(--name-h)" }}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <text
              x="0"
              y="151"
              textLength={VIEW_W}
              lengthAdjust="spacingAndGlyphs"
              fill="#000000"
              className="font-sans"
              style={{ fontWeight: 900, letterSpacing: "-0.04em" }}
              fontSize="196"
            >
              {text}
            </text>
          </svg>
        ))}
      </span>
    </span>
  );
}

export default function KineticName() {
  return (
    <div
      className="kinetic-name-inner flex w-full"
      style={{ height: "var(--name-h)" }}
      role="img"
      aria-label="Raquel García"
    >
      <Word text="Raquel" />
      <Word text="Garcia" />
    </div>
  );
}
