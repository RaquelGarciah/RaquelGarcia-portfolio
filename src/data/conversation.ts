// All chat copy + branch content lives here. The chat engine in ChatCV.tsx
// reads from this config — content and logic are separated, so you can edit
// wording without touching components. Use {name} where the visitor's name
// should be interpolated (it is escaped before rendering).

import { profile } from "./profile";

export type OptionId = "ABOUT" | "PROJECTS" | "EXPERIENCE" | "CONTACT";

/** A single linked project in the PROJECTS showcase. */
export interface ProjectLink {
  /** Human-readable title (no slugs/hyphens). */
  name: string;
  url: string;
  blurb: string;
}

/** A small standalone hyperlink rendered after a branch (e.g. LinkedIn). */
export interface ChatLink {
  label: string;
  url: string;
}

export interface ChatOption {
  id: OptionId;
  /** Pill text + the YOU bubble shown when tapped. */
  label: string;
  /** Raquel's reply, delivered as a sequence of bubbles with typing pauses. */
  reply: string[];
  /** When true, the ContactCard is rendered inline after the reply. */
  revealsContact?: boolean;
  /** When set, a selected-projects bubble is rendered inline after the reply. */
  projects?: ProjectLink[];
  /** Footer link under the projects showcase ("See selected work"). */
  worklink?: ChatLink;
  /** A single CTA hyperlink rendered inline after the reply (e.g. LinkedIn). */
  cta?: ChatLink;
}


const options: Record<OptionId, ChatOption> = {
  ABOUT: {
    id: "ABOUT",
    label: "ABOUT",
    reply: [
      "My eye is trained to spot what breaks so I can't ship something without understanding why.",
      "My purpose is to develop tools to make my life and everyone's life easier",
      "My hobby is looking always for gaps where AI can drive the next move wherever the business is",
      "I absolutely love new things. Taking tools I haven't mastered yet and turning a model into a real decision is the part I'm here for.",
      "I pick hard problems on purpose and learn obsessively fast. If something scares me a little, that's usually where I'm heading next.",
    ],
    cta: { label: "Click here to know more about me", url: profile.contact.linkedin },
  },
  PROJECTS: {
    id: "PROJECTS",
    label: "PROJECTS",
    reply: [
      "I can't stop still I'm building something in my head all day, and the good ones I actually ship.",
      "The one I'm proudest of is an alarm system built on anomaly detection that I architected and deployed from scratch to catch failures the moment they happen. It runs daily over 20 billion events, flagging outliers and firing automated alerts.",
      "Beyond validation, I also worked on model development itself and took detection precision from 25% to 75%. Live in production now and used daily.",
      "I also built an AI image-processing tool that handled 2,000+ images and compressed weeks of manual review into days, automated cross-team validation workflows, and shipped monthly production reporting with key KPIs so devs and clients finally had real visibility and could notice fast when something is failing.",
      "And ofc I love turning maths into things you can actually see. Three I'd put my name on:",
    ],
    projects: [
      {
        name: "Real-time statistical supervision of an AI trading agent",
        url: "https://github.com/RaquelGarciah/Real-time-statistical-supervision-of-an-AI-trading-agent",
        blurb:
          "A statistical safety layer that audits an LLM trading agent in real time. It's my maths thesis, lifted directional accuracy 38% to 53%.",
      },
      {
        name: "APLICA — AI job-application assistant",
        url: "https://github.com/RaquelGarciah/APLICA",
        blurb:
          "Answers job-application forms in your own voice, with a Chrome extension that fills them in for you. I didn't want to waste one more minute",
      },
      {
        name: "Bio-inspired arrhythmia detector (Harvard Hackathon)",
        url: "https://github.com/RaquelGarciah/IctusAlarmSystem_HarvardHackaton",
        blurb:
          "A spiking neural network that reads ECG as spike trains to flag cardiac arrhythmias. With this we gained a prize!!",
      },
    ],
    worklink: { label: "See selected work", url: profile.contact.github },
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    label: "EXPERIENCE",
    reply: [
      "Right now I am working as a Product Data Scientist at Telefónica Tech in Madrid, working on Smartsteps, the mobility-analytics leading platform running across Spain and the UK.",
      "I'm the technical bridge between engineering and clients, and I shipped the production work I just told you about.",
      "I'm crazy about maths, I studied them for the perspective it gives you, the kind you'll never reach any other way and to be honest, so I'd never get bored.",
      "And now I'm finishing an MSc in Technology Applied to the Organization of the Future at UNIR to have a more applied vision to solve the problems. You'll always find me learning something new",
      "I am quite a freak, I am a code addict who treats Claude Code as her personal intern, though I've got a solid background of my own across Python, R, SQL, MATLAB, PySpark/Databricks, MongoDB, ML (time series, Bayesian inference, clustering, RNNs, PCA) and LLM tooling like RAG, MCP and agentic workflows.",
      "Fun fact is that I won a Harvard price which actually didnt exist and somehow I always end up winning something at every contest I have presented",
      "At this point you can tell I love communicating and I am quite good at it, in fact, I work across mosty English and Spanish languages but also French and German sounds quite familiar to me"
    ],
  },
  CONTACT: {
    id: "CONTACT",
    label: "HOW DO I REACH YOU?",
    reply: ["Here's the best way to find me:"],
    revealsContact: true,
  },
};

export const conversation = {
  /** Fallback if the visitor submits an empty name. */
  fallbackName: "stranger",

  /** Compose-bar placeholder for the name step. */
  namePlaceholder: "Hey, I'm…",

  /** Step 1 — opening message(s) before the name input. */
  intro: ["Hi!!! How did you end up here?",
    "Who am I talking with?"],

  /** Step 3 — greeting after the visitor types their name. Supports {name}. */
  greeting: [
    "Nice to meet you, {name}. I'm Raquel, a very curious mathematician who turns data into decisions and ships AI products end to end.",
    "What do you want to know?",
  ],

  /** Shown each time options are re-offered after a branch. */
  reprompt: "Anything else you want to dig into?",

  /** Friendly closer once everything has been explored. */
  closing: "Loved chatting, {name}. Don't be a stranger and reach out any time please. I will be down for a coffe if you want",

  options,
};
