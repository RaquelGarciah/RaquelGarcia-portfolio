// Single source of truth for identity + contact info. Edit copy here without
// touching components.

export const profile = {
  name: "RaquelGarcia", // rendered as the kinetic wordmark (one word)
  role: "Mathematician",

  // Hero tagline. The long form shows on wider screens; the short form on
  // small ones (see Hero responsive logic).
  tagline:
    "I turn pattern recognition into business decisions. Mathematician and statistician shipping AI from research to production — I took an algorithm from 25% to 75% detection over 10M daily events, and turned weeks of manual work into days.",
  taglineShort:
    "I turn pattern recognition into decisions. Mathematician shipping AI from research to production.",

  contact: {
    phone: "+34 640 73 70 98",
    phoneHref: "tel:+34640737098",
    email: "raquelgarciahernandez04@gmail.com",
    emailHref: "mailto:raquelgarciahernandez04@gmail.com",
    github: "https://github.com/RaquelGarciah",
    githubLabel: "github.com/RaquelGarciah",
    linkedin: "https://www.linkedin.com/in/raquel-garcia-hernandez-a08267337/",
    linkedinLabel: "in/raquel-garcia-hernandez",
  },
} as const;
