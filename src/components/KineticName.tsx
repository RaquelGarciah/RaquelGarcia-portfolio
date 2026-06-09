import { profile } from "@/data/profile";

/**
 * The hero wordmark. Rendered as a single inline SVG sized purely by its
 * viewBox with width:100%, so it scales edge-to-edge and stays perfectly
 * responsive (it is NOT a px font-size — same trick andagain.uk uses).
 *
 * `textLength` + `lengthAdjust` force the word to span the full viewBox width
 * regardless of the loaded font's metrics, guaranteeing flush edges and giving
 * the tight, condensed grotesque look of Spezia scaled up.
 *
 * The outer `.kinetic-name-clip` has overflow:hidden so the inner
 * `.kinetic-name-svg` can be revealed with a single translateY(100%→0) mask
 * wipe. Hero drives that animation (and the scroll parallax) via GSAP.
 */
const VIEW_W = 1200;
const VIEW_H = 232;

export default function KineticName() {
  return (
    <div className="kinetic-name-clip overflow-hidden leading-[0]">
      <svg
        className="kinetic-name-svg block w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        role="img"
        aria-label="Raquel García"
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          x="0"
          y="190"
          textLength={VIEW_W}
          lengthAdjust="spacingAndGlyphs"
          fill="#ffffff"
          className="font-sans"
          style={{ fontWeight: 900, letterSpacing: "-0.03em" }}
          fontSize="210"
        >
          {profile.name}
        </text>
      </svg>
    </div>
  );
}
