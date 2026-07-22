import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Swansa × PeacefulPlay — Roblox Games Studio",
    template: "%s — Swansa × PeacefulPlay",
  },
  description:
    "Explore the Roblox games built, operated, and grown by Swansa and PeacefulPlay.",
  keywords: ["Swansa", "PeacefulPlay", "Roblox games", "Roblox studio", "game portfolio"],
  authors: [{ name: "Swansa × PeacefulPlay" }],
  openGraph: {
    title: "Swansa × PeacefulPlay — Roblox Games Studio",
    description: "Roblox worlds built for the next session, and the one after that.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swansa × PeacefulPlay — Roblox Games Studio",
    description: "Roblox worlds built for the next session, and the one after that.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07090d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
