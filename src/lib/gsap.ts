// Single place to import GSAP + ScrollTrigger so the plugin is registered
// exactly once on the client. Components import { gsap, ScrollTrigger }
// from here rather than from "gsap" directly.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
