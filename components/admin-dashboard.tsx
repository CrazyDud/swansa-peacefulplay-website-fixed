"use client";

import { FormEvent, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import type { GameRecord } from "@/lib/types";
import type { RobloxSnapshot } from "@/lib/roblox";
import { formatNumber } from "@/lib/roblox";

export function AdminDashboard({ initialGames, adminName }: { initialGames: GameRecord[]; adminName: string }) {
  const [games, setGames] = useState(initialGames);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<RobloxSnapshot | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    const data = (await response.json()) as T & { error?: string };
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    return data;
  }

  async function reloadGames() {
    const data = await request<{ games: GameRecord[] }>("/api/admin/games");
    setGames(data.games);
  }

  async function handlePreview(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy("preview");
    try {
      const data = await request<{ game: RobloxSnapshot }>("/api/admin/games/preview", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
      setPreview(data.game);
    } catch (caught) {
      setPreview(null);
      setError(caught instanceof Error ? caught.message : "Could not preview that game.");
    } finally {
      setBusy(null);
    }
  }

  async function handleAdd() {
    setBusy("add");
    setError("");
    try {
      await request("/api/admin/games", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
      await reloadGames();
      setPreview(null);
      setUrl("");
      setMessage("Game added and published.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not add that game.");
    } finally {
      setBusy(null);
    }
  }

  async function runAction(game: GameRecord, action: string) {
    setBusy(`${game.id}:${action}`);
    setError("");
    setMessage("");
    try {
      await request(`/api/admin/games/${game.id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      await reloadGames();
      setMessage(action === "refresh" ? `${game.name} refreshed from Roblox.` : "Portfolio updated.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update the game.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(game: GameRecord) {
    if (!window.confirm(`Remove “${game.name}” from the portfolio? This cannot be undone.`)) return;
    setBusy(`${game.id}:delete`);
    setError("");
    try {
      await request(`/api/admin/games/${game.id}`, { method: "DELETE" });
      await reloadGames();
      setMessage(`${game.name} removed.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not remove the game.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <a href="/" className="admin-back"><ArrowLeft size={16} /> Portfolio</a>
          <span className="admin-label">Swansa × PeacefulPlay control room</span>
          <h1>Game manager</h1>
        </div>
        <div className="admin-user"><i /><span>Signed in as<br /><b>{adminName}</b></span></div>
      </header>

      <section className="admin-add-panel">
        <div>
          <span className="admin-step">01 / Add a game</span>
          <h2>Paste. Preview. Publish.</h2>
          <p>Use any public Roblox game URL. PeacefulPlay fetches the title, artwork, creator, visits, rating, and live player count automatically.</p>
        </div>
        <form onSubmit={handlePreview} className="admin-add-form">
          <label htmlFor="game-url">Roblox game URL or place ID</label>
          <div>
            <input id="game-url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.roblox.com/games/..." required />
            <button className="button button-primary" disabled={busy !== null}>
              {busy === "preview" ? <LoaderCircle className="spin" size={18} /> : <Eye size={18} />} Preview
            </button>
          </div>
        </form>
      </section>

      {(error || message) && <div className={`admin-notice${error ? " is-error" : ""}`}>{error || message}</div>}

      {preview && (
        <section className="admin-preview">
          <div className="admin-preview-image"><img src={preview.thumbnailUrl} alt="" /></div>
          <div>
            <span>Ready to publish</span>
            <h2>{preview.name}</h2>
            <p>{preview.description}</p>
            <div className="admin-preview-stats"><b>{formatNumber(preview.visits)} visits</b><b>{formatNumber(preview.playing)} online</b><b>{(preview.rating / 10).toFixed(1)}% rating</b></div>
          </div>
          <div className="admin-preview-actions">
            <button className="button button-primary" onClick={handleAdd} disabled={busy !== null}>
              {busy === "add" ? <LoaderCircle className="spin" size={18} /> : <Plus size={18} />} Add to portfolio
            </button>
            <button className="button button-ghost" onClick={() => setPreview(null)}>Cancel</button>
          </div>
        </section>
      )}

      <section className="admin-list-section">
        <div className="admin-list-heading">
          <div><span className="admin-step">02 / Portfolio order</span><h2>{games.length} games</h2></div>
          <p>Up to three games can be featured. Hidden games stay in the manager but disappear from the public site.</p>
        </div>

        <div className="admin-game-list">
          {games.map((game, index) => {
            const rowBusy = busy?.startsWith(`${game.id}:`);
            return (
              <article className={`admin-game-row${!game.isVisible ? " is-hidden" : ""}`} key={game.id}>
                <span className="admin-order">{String(index + 1).padStart(2, "0")}</span>
                <div className="admin-thumb"><img src={game.thumbnailUrl} alt="" /></div>
                <div className="admin-game-info">
                  <div><h3>{game.name}</h3>{game.isFeatured && <span className="featured-tag"><Star size={11} fill="currentColor" /> Featured</span>}</div>
                  <p>{game.creatorName} · {formatNumber(game.visits)} visits · {formatNumber(game.playing)} online</p>
                  <span>Updated {new Date(game.lastSyncedAt).toLocaleString()}</span>
                </div>
                <div className="admin-row-actions">
                  <button title="Move up" aria-label={`Move ${game.name} up`} disabled={index === 0 || rowBusy} onClick={() => runAction(game, "move-up")}><ArrowUp size={16} /></button>
                  <button title="Move down" aria-label={`Move ${game.name} down`} disabled={index === games.length - 1 || rowBusy} onClick={() => runAction(game, "move-down")}><ArrowDown size={16} /></button>
                  <button className={game.isFeatured ? "is-active" : ""} title="Toggle featured" aria-label={`Toggle featured for ${game.name}`} disabled={rowBusy} onClick={() => runAction(game, "toggle-featured")}><Star size={16} fill={game.isFeatured ? "currentColor" : "none"} /></button>
                  <button title={game.isVisible ? "Hide game" : "Publish game"} aria-label={`${game.isVisible ? "Hide" : "Publish"} ${game.name}`} disabled={rowBusy} onClick={() => runAction(game, "toggle-visible")}>
                    {game.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button title="Refresh from Roblox" aria-label={`Refresh ${game.name}`} disabled={rowBusy} onClick={() => runAction(game, "refresh")}><RefreshCw size={16} className={rowBusy && busy?.endsWith(":refresh") ? "spin" : ""} /></button>
                  <a title="Open on Roblox" aria-label={`Open ${game.name} on Roblox`} href={game.robloxUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>
                  <button className="danger-action" title="Remove" aria-label={`Remove ${game.name}`} disabled={rowBusy} onClick={() => handleDelete(game)}><Trash2 size={16} /></button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
