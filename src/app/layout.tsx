import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

// One typeface for everything (Inter, the free grotesque standing in for
// Spezia). Variable font → all weights incl. 900 for the giant wordmark.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
