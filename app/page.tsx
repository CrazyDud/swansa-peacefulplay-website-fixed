import Link from "next/link";
import { ArrowRight, Gamepad2, Sparkles, TrendingUp, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { GameCard } from "@/components/game-card";
import { HeroGameCarousel } from "@/components/hero-game-carousel";
import { listGames } from "@/lib/games";
import { formatNumber } from "@/lib/roblox";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const games = await listGames();
  const rankedGames = [...games].sort((a, b) => b.playing - a.playing || b.visits - a.visits);
  const featured = games.filter((game) => game.isFeatured).slice(0, 3);
  const shownFeatured = featured.length > 0 ? featured : rankedGames.slice(0, 3);
  const totalVisits = games.reduce((sum, game) => sum + game.visits, 0);
  const playersOnline = games.reduce((sum, game) => sum + game.playing, 0);
  const averageRating = games.length
    ? games.reduce((sum, game) => sum + game.rating, 0) / games.length / 10
    : 0;

  return (
    <main>
      <SiteHeader />
      <HeroGameCarousel games={rankedGames.slice(0, 5)} />

      <section className="stats-rail" aria-label="Portfolio statistics">
        <div className="shell stats-grid">
          <div><Gamepad2 /><strong>{games.length}</strong><span>Games shipped</span></div>
          <div><TrendingUp /><strong>{formatNumber(totalVisits)}+</strong><span>Total visits</span></div>
          <div><Users /><strong>{formatNumber(playersOnline)}</strong><span>Playing now</span></div>
          <div><Sparkles /><strong>{averageRating.toFixed(1)}%</strong><span>Average rating</span></div>
        </div>
      </section>

      <section className="section shell" id="games">
        <div className="section-heading">
          <div>
            <span className="section-index">01 / Selected worlds</span>
            <h2>Built to earn<br />another session.</h2>
          </div>
          <div className="section-heading-aside">
            <p>A selection of the games shaping the Swansa × PeacefulPlay portfolio right now.</p>
            <Link href="/games">View all games <ArrowRight size={17} /></Link>
          </div>
        </div>
        <div className="featured-grid">
          {shownFeatured.map((game) => <GameCard key={game.id} game={game} featured />)}
        </div>
      </section>

      <section className="studio-band" id="studio">
        <div className="shell studio-grid">
          <div className="studio-mark">
            <div className="studio-logos">
              <img src="/swansalogo.webp" width="132" height="132" alt="Swansa logo" />
              <img src="/peacefulplaylogo.webp" width="132" height="132" alt="PeacefulPlay logo" />
            </div>
            <span>Play is the strategy.</span>
          </div>
          <div className="studio-copy">
            <span className="section-index">02 / The studio</span>
            <h2>Two strengths.<br /><em>One studio.</em></h2>
            <p>
              Swansa brings the creative spark. PeacefulPlay brings the technical discipline. Together, we take games from a sharp first hook to durable live-player growth.
            </p>
            <Link href="/studio" className="button button-primary studio-page-link">Explore the studio <ArrowRight size={18} /></Link>
            <div className="studio-pillars">
              <span><b>01</b> Design with a hook</span>
              <span><b>02</b> Build for retention</span>
              <span><b>03</b> Improve from real data</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section shell" id="contact">
        <div>
          <span className="section-index">03 / Start a conversation</span>
          <h2>Have a world<br />worth building?</h2>
        </div>
        <div className="contact-card">
          <p>Game concepts, partnerships, acquisitions, or growth opportunities—we’re always open to the right conversation.</p>
          <a className="button button-primary" href="mailto:slashingsimulator@gmail.com">Email PeacefulPlay <ArrowRight size={18} /></a>
          <a className="text-link" href="https://discord.gg/3w7Egsb8YR" target="_blank" rel="noreferrer">Or meet us on Discord ↗</a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <span>© {new Date().getFullYear()} Swansa × PeacefulPlay</span>
          <div><a href="https://x.com/SwansaXPPlay" target="_blank" rel="noreferrer">X</a><a href="https://www.tiktok.com/@imaginze8" target="_blank" rel="noreferrer">TikTok</a><Link href="/admin">Admin</Link></div>
        </div>
      </footer>
    </main>
  );
}
