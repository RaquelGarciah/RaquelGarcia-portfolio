// All chat copy + branch content lives here. The chat engine in ChatCV.tsx
// reads from this config — content and logic are separated, so you can edit
// wording without touching components. Use {name} where the visitor's name
// should be interpolated (it is escaped before rendering).

export type OptionId = "PROJECTS" | "EXPERIENCE" | "CONTACT";

export interface ChatOption {
  id: OptionId;
  /** Pill text + the YOU bubble shown when tapped. */
  label: string;
  /** Raquel's reply, delivered as a sequence of bubbles with typing pauses. */
  reply: string[];
  /** When true, the ContactCard is rendered inline after the reply. */
  revealsContact?: boolean;
}

const options: Record<OptionId, ChatOption> = {
  PROJECTS: {
    id: "PROJECTS",
    label: "PROJECTS",
    reply: [
      "Where to start 😄 My favourite is an anomaly-detection system I architected and deployed from scratch — it runs daily over high-volume data, flagging inconsistencies and outliers with automated alerts.",
      "It pushed detection from 25% to 75% — across 10M events a day. That one's live in production.",
      "I also built an AI image-processing tool that handled 2,000+ images, compressing weeks of manual review into days. Plus automated cross-team validation workflows and monthly production reporting, so devs and clients finally had real visibility.",
      "And I love turning maths into something you can see — geospatial visualizations that took our models and made them business decisions. On the side I'm a heavy Claude Code user: RAG pipelines, tool-calling agents with LangGraph, and an MCP server. Repos are landing on my GitHub soon.",
    ],
    // TODO: add repo links once the side-project repos are public.
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    label: "EXPERIENCE",
    reply: [
      "Right now I'm a Data Scientist at Telefónica Tech in Madrid, on the Talentum Scholarship — working on Smartsteps, a leading mobility-analytics platform across Spain and the UK.",
      "I'm the technical liaison between engineering and clients, and I shipped the production work I just told you about. 🚀",
      "On paper: BSc in Mathematics & Data Science at Universidad Complutense de Madrid (2022–2026), and an MSc in Technology Applied to the Organization of the Future at UNIR. Stack: Python, R, SQL, MATLAB, PySpark/Databricks, MongoDB — ML across time series, Bayesian inference, clustering, RNNs and PCA — plus LLM tooling (RAG, MCP, agentic workflows, Claude Code).",
      "A few things I'm proud of: Harvard Hackathon distinction, Lovable Hackathon winner, highest distinction in Regression Models & Big Data, and the Amancio Ortega Foundation scholarship. Languages: Spanish (native), English (C1), French (intermediate), German (basic).",
    ],
  },
  CONTACT: {
    id: "CONTACT",
    label: "HOW DO I REACH YOU?",
    reply: ["Of course — here's the best way to find me 👇"],
    revealsContact: true,
  },
};

export const conversation = {
  /** Fallback if the visitor submits an empty name. */
  fallbackName: "stranger",

  /** Compose-bar placeholder for the name step. */
  namePlaceholder: "Hey, I'm…",

  /** Step 1 — opening message(s) before the name input. */
  intro: ["Hi! How did you end up here? Who am I talking with?"],

  /** Step 3 — greeting after the visitor types their name. Supports {name}. */
  greeting: [
    "So nice to meet you, {name}!! I'm Raquel — a mathematician who turns data into decisions and ships AI products end to end.",
    "What would you like to know about me?",
  ],

  /** Shown each time options are re-offered after a branch. */
  reprompt: "Anything else you'd like to dig into?",

  /** Friendly closer once everything has been explored. */
  closing: "Loved chatting, {name}. Don't be a stranger — reach out any time! 👋",

  options,
};
