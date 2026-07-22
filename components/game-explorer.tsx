"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { GameRecord } from "@/lib/types";
import { GameCard } from "@/components/game-card";

export function GameExplorer({ games }: { games: GameRecord[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const visibleGames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = normalized
      ? games.filter((game) => `${game.name} ${game.genre}`.toLowerCase().includes(normalized))
      : [...games];

    if (sort === "visits") filtered.sort((a, b) => b.visits - a.visits);
    if (sort === "players") filtered.sort((a, b) => b.playing - a.playing);
    if (sort === "newest") {
      filtered.sort((a, b) => new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime());
    }
    return filtered;
  }, [games, query, sort]);

  return (
    <>
      <div className="explorer-controls">
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Search games</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the portfolio" />
        </label>
        <label className="sort-field">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Curated order</option>
            <option value="visits">Most visits</option>
            <option value="players">Players online</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>

      {visibleGames.length > 0 ? (
        <div className="games-grid explorer-grid">
          {visibleGames.map((game) => <GameCard key={game.id} game={game} />)}
        </div>
      ) : (
        <div className="empty-state">No games match “{query}”.</div>
      )}
    </>
  );
}
