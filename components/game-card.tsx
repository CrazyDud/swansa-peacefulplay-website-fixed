import { ArrowUpRight, Eye, Star, Users } from "lucide-react";
import type { GameRecord } from "@/lib/types";
import { formatNumber } from "@/lib/roblox";

export function GameCard({ game, featured = false }: { game: GameRecord; featured?: boolean }) {
  return (
    <article className={`game-card${featured ? " game-card-featured" : ""}`}>
      <a href={game.robloxUrl} target="_blank" rel="noreferrer" className="game-image-wrap" aria-label={`Play ${game.name} on Roblox`}>
        <img
          src={game.thumbnailUrl}
          alt={`${game.name} game artwork`}
          className="game-image"
        />
        <span className="game-image-shade" />
        <span className={`live-pill${game.playing > 0 ? " is-live" : ""}`}>
          <i /> {game.playing > 0 ? `${formatNumber(game.playing)} playing` : "Portfolio game"}
        </span>
        <span className="play-arrow"><ArrowUpRight size={20} /></span>
      </a>
      <div className="game-card-body">
        <div className="game-card-title-row">
          <div>
            <span className="game-genre">{game.genre}</span>
            <h3>{game.name}</h3>
          </div>
          <span className="rating"><Star size={14} fill="currentColor" /> {(game.rating / 10).toFixed(1)}%</span>
        </div>
        <p>{game.description}</p>
        <div className="game-metrics">
          <span><Eye size={15} /> {formatNumber(game.visits)} visits</span>
          <span><Users size={15} /> {formatNumber(game.playing)} online</span>
        </div>
      </div>
    </article>
  );
}
