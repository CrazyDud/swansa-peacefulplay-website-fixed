import type { Metadata } from "next";
import Link from "next/link";
import { GameExplorer } from "@/components/game-explorer";
import { SiteHeader } from "@/components/site-header";
import { listGames } from "@/lib/games";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Games",
  description: "Browse every public game in the PeacefulPlay Roblox portfolio.",
};

export default async function GamesPage() {
  const games = await listGames();

  return (
    <main>
      <SiteHeader />
      <section className="catalog-section shell">
        <GameExplorer games={games} />
      </section>
      <footer className="site-footer">
        <div className="shell footer-inner"><span>© {new Date().getFullYear()} Swansa × PeacefulPlay</span><Link href="/admin">Admin</Link></div>
      </footer>
    </main>
  );
}
