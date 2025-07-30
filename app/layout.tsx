
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swansa x PeacefulPlay Studio | Professional Roblox Game Development",
  description: "Professional Roblox game development studio offering full-cycle development, game acquisition, growth services, developer recruitment, and investment opportunities. Partnership between PeacefulPlay and SwansInteractives.",
  keywords: "Roblox, game development, studio, PeacefulPlay, SwansInteractives, game acquisition, developer recruitment, Roblox services",
  authors: [{ name: "Swansa x PeacefulPlay Studio" }],
  robots: "index, follow",
  openGraph: {
    title: "Swansa x PeacefulPlay Studio | Professional Roblox Game Development",
    description: "Professional Roblox game development studio delivering exceptional gaming experiences and comprehensive industry services.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swansa x PeacefulPlay Studio",
    description: "Professional Roblox game development studio delivering exceptional gaming experiences and comprehensive industry services.",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-900 text-white antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
