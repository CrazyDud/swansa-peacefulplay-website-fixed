import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Code2,
  Handshake,
  Megaphone,
  Rocket,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Development, growth, marketing, investment, and acquisition partnerships for Roblox games from Swansa × PeacefulPlay.",
};

const capabilities = [
  {
    index: "01",
    icon: Code2,
    title: "Build games",
    description: "Turn the hook into a polished live experience.",
    points: ["Game design, Luau, UI, and art", "QA, performance, and live updates"],
  },
  {
    index: "02",
    icon: Rocket,
    title: "Grow games",
    description: "Find the lever that brings players back.",
    points: ["Analytics, A/B tests, and retention", "Content cadence and live operations"],
  },
  {
    index: "03",
    icon: Megaphone,
    title: "Acquire players",
    description: "Better creative. Smarter spend. Clear results.",
    points: ["Marketing and store-page strategy", "User acquisition and community"],
  },
  {
    index: "04",
    icon: Handshake,
    title: "Invest",
    description: "Capital plus people who know Roblox.",
    points: ["Strategic funding and operating support", "Flexible structures considered case by case"],
  },
  {
    index: "05",
    icon: BriefcaseBusiness,
    title: "Buy games",
    description: "A serious home for the right experience.",
    points: ["Valuation, due diligence, and buyouts", "Clean transfer and continued operations"],
  },
  {
    index: "06",
    icon: BarChart3,
    title: "Partner",
    description: "Bring the game. We build the team around it.",
    points: ["Specialist Roblox talent", "Production and business support"],
  },
] as const;

const partnerSignals = [
  "A hook players understand fast",
  "Traction worth building on",
  "An owner who knows the game",
  "Clear room to grow",
];

export default function StudioPage() {
  return (
    <main>
      <SiteHeader />

      <section className="studio-page-hero">
        <div className="shell studio-page-hero-grid">
          <div className="studio-page-intro">
            <span className="eyebrow"><i /> Roblox development & growth studio</span>
            <h1>We build.<br />We grow.<br /><em>We back.</em></h1>
            <p>
              We develop, grow, market, invest in, and acquire Roblox games.
            </p>
            <div className="studio-page-actions">
              <a className="button button-primary" href="mailto:slashingsimulator@gmail.com">Discuss a game <ArrowRight size={18} /></a>
              <a className="button button-ghost" href="https://discord.gg/3w7Egsb8YR" target="_blank" rel="noreferrer">Join Discord ↗</a>
            </div>
          </div>

          <aside className="studio-page-manifesto">
            <div className="studio-page-logos">
              <img src="/swansalogo.webp" width="96" height="96" alt="Swansa logo" />
              <span>×</span>
              <img src="/peacefulplaylogo.webp" width="96" height="96" alt="PeacefulPlay logo" />
            </div>
            <span>Two strengths. One studio.</span>
            <strong>Creative + technical. One operating team.</strong>
            <p>Sharp hooks. Durable systems. Repeat players.</p>
          </aside>
        </div>
      </section>

      <section className="studio-services-page shell">
        <div className="studio-page-heading">
          <span className="section-index">01 / How we help</span>
          <h2>Six ways to<br />move a game.</h2>
          <p>Build. Grow. Market. Fund. Acquire. Operate.</p>
        </div>

        <div className="studio-capability-grid">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <article className="studio-capability" key={capability.index}>
                <div className="studio-capability-top">
                  <span>{capability.index}</span>
                  <Icon aria-hidden="true" />
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul>
                  {capability.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="studio-fit-band">
        <div className="shell studio-fit-grid">
          <div>
            <span className="section-index">02 / What we look for</span>
            <h2>Signal over<br /><em>slide decks.</em></h2>
            <p>Live or early—the game needs a real reason to win.</p>
          </div>
          <div className="studio-signal-list">
            {partnerSignals.map((signal, index) => (
              <div key={signal}><b>{String(index + 1).padStart(2, "0")}</b><span>{signal}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-process shell">
        <div className="studio-page-heading compact">
          <span className="section-index">03 / Start here</span>
          <h2>Send the game.</h2>
        </div>
        <div className="studio-process-grid">
          <div><b>01</b><strong>Share</strong><span>Link, numbers, goal.</span></div>
          <div><b>02</b><strong>Review</strong><span>Game, ownership, upside.</span></div>
          <div><b>03</b><strong>Align</strong><span>Scope, structure, targets.</span></div>
          <div><b>04</b><strong>Move</strong><span>Execute, measure, improve.</span></div>
        </div>
      </section>

      <section className="studio-page-cta shell">
        <div>
          <span className="section-index">Have a game worth discussing?</span>
          <h2>Let’s see what it can become.</h2>
        </div>
        <div>
          <p>Development, growth, marketing, investment, or acquisition.</p>
          <a className="button button-primary" href="mailto:slashingsimulator@gmail.com">Email the studio <ArrowRight size={18} /></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <span>© {new Date().getFullYear()} Swansa × PeacefulPlay</span>
          <div><Link href="/">Home</Link><Link href="/games">Games</Link><Link href="/admin">Admin</Link></div>
        </div>
      </footer>
    </main>
  );
}
