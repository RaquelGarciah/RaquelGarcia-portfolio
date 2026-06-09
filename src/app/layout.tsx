import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

// One typeface for everything. The reference uses Spezia (Zetafonts) — a
// heavier, wider, rounder grotesque. Spezia is COMMERCIAL, so until it's
// licensed we use Hanken Grotesk (variable, up to weight 900) as the closest
// free stand-in: name in Black (900), labels/tagline in Regular (400).
//
// TODO — swap to self-hosted Spezia once licensed:
//   import localFont from "next/font/local";
//   const display = localFont({
//     variable: "--font-display",
//     display: "swap",
//     src: [
//       { path: "./fonts/Spezia-Regular.woff2", weight: "400", style: "normal" },
//       { path: "./fonts/Spezia-Bold.woff2",    weight: "700", style: "normal" },
//     ],
//   });
// Drop the .woff2 files in src/app/fonts/, then use `display.variable` below.
const display = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = "https://raquel-portfolio.vercel.app"; // TODO: set real domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Raquel García — Mathematician & AI Engineer",
  description:
    "I turn pattern recognition into business decisions. Mathematician and statistician shipping AI from research to production.",
  openGraph: {
    title: "Raquel García — Mathematician & AI Engineer",
    description:
      "Mathematician shipping AI from research to production. An interactive, conversational CV.",
    type: "website",
    url: SITE_URL,
    images: [{ url: "/og.png", width: 1200, height: 630 }], // TODO: add public/og.png
  },
  twitter: {
    card: "summary_large_image",
    title: "Raquel García — Mathematician & AI Engineer",
    description:
      "Mathematician shipping AI from research to production. An interactive, conversational CV.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
