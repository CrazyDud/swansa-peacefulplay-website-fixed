"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Play } from "lucide-react";

type CarouselGame = {
  id: string;
  name: string;
  thumbnailUrl: string;
  robloxUrl: string;
  playing: number;
};

const AUTO_ADVANCE_MS = 7000;

function compactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

export function HeroGameCarousel({ games }: { games: CarouselGame[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || games.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % games.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [games.length, paused]);

  useEffect(() => {
    if (activeIndex >= games.length) setActiveIndex(0);
  }, [activeIndex, games.length]);

  if (games.length === 0) {
    return (
      <section className="game-showcase game-showcase-empty">
        <p>Add your first Roblox game from the admin dashboard.</p>
        <a href="/admin" className="button button-primary">Open admin</a>
      </section>
    );
  }

  const activeGame = games[activeIndex];
  const selectPrevious = () => setActiveIndex((activeIndex - 1 + games.length) % games.length);
  const selectNext = () => setActiveIndex((activeIndex + 1) % games.length);

  return (
    <section
      className="game-showcase"
      aria-label="Most played games"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <aside className="game-shelf" aria-label="Games ranked by players online">
        <button className="shelf-arrow" type="button" onClick={selectPrevious} aria-label="Previous game">
          <ChevronUp aria-hidden="true" />
        </button>

        <div className="game-shelf-list">
          {games.map((game, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                className={`shelf-game${isActive ? " is-active" : ""}`}
                type="button"
                key={game.id}
                onClick={() => setActiveIndex(index)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Select ${game.name}, rank ${index + 1}, ${compactNumber(game.playing)} playing`}
              >
                <span className="shelf-rank">{String(index + 1).padStart(2, "0")}</span>
                <span className="shelf-thumb">
                  <img src={game.thumbnailUrl} alt="" />
                </span>
                <span className="shelf-copy">
                  <strong>{game.name}</strong>
                  <span><b>{compactNumber(game.playing)}</b> playing</span>
                </span>
                {isActive && <span className="shelf-pointer" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <button className="shelf-arrow" type="button" onClick={selectNext} aria-label="Next game">
          <ChevronDown aria-hidden="true" />
        </button>
      </aside>

      <div className="showcase-preview" aria-live="polite">
        <img key={activeGame.id} src={activeGame.thumbnailUrl} alt={`${activeGame.name} Roblox game artwork`} />
        <span className="showcase-shade" aria-hidden="true" />

        <div className="showcase-game-panel">
          <div>
            <span className="showcase-label">Most played now</span>
            <h1>{activeGame.name}</h1>
            <p><i /> <strong>{compactNumber(activeGame.playing)}</strong> playing now</p>
          </div>
          <a className="roblox-play-button" href={activeGame.robloxUrl} target="_blank" rel="noreferrer">
            <Play aria-hidden="true" fill="currentColor" />
            <span>Play</span>
          </a>
        </div>

        <div className="showcase-progress" aria-hidden="true">
          {games.map((game, index) => <i className={index === activeIndex ? "is-active" : ""} key={game.id} />)}
        </div>
      </div>
    </section>
  );
}
