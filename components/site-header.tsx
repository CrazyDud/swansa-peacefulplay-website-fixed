"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Swansa and PeacefulPlay home">
          <span className="brand-logos" aria-hidden="true">
            <img src="/swansalogo.webp" width="42" height="42" alt="" />
            <img src="/peacefulplaylogo.webp" width="42" height="42" alt="" />
          </span>
          <span>Swansa <i>×</i> PeacefulPlay</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link className={pathname === "/" ? "is-active" : undefined} href="/">Home</Link>
          <Link className={pathname.startsWith("/games") ? "is-active" : undefined} href="/games">Games</Link>
          <Link className={pathname.startsWith("/studio") ? "is-active" : undefined} href="/studio">Studio</Link>
          <Link href="/#contact">Contact</Link>
        </nav>

        <a className="header-cta" href="mailto:slashingsimulator@gmail.com?subject=Grow%20My%20Game">
          <span>Grow Your Game</span>
          <ArrowUpRight aria-hidden="true" />
        </a>

        <details className="mobile-nav">
          <summary aria-label="Open menu"><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            <Link href="/">Home</Link>
            <Link href="/games">Games</Link>
            <Link href="/studio">Studio</Link>
            <Link href="/#contact">Contact</Link>
            <a href="https://discord.gg/3w7Egsb8YR" target="_blank" rel="noreferrer">Discord ↗</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
