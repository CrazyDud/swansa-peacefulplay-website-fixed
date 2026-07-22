import postgres, { type Sql } from "postgres";
import { SEED_GAMES } from "@/lib/seed-games";
import { fetchRobloxGame, fetchRobloxStats } from "@/lib/roblox";
import type { GameRecord } from "@/lib/types";

const STALE_AFTER_MS = 15 * 60 * 1000;
const EPOCH = new Date(0).toISOString();

type GameAction = "toggle-visible" | "toggle-featured" | "move-up" | "move-down" | "refresh";
type GlobalGameStore = typeof globalThis & { __peacefulPlayGames?: GameRecord[] };

let sqlClient: Sql | null = null;
let databaseUnavailable = false;
let ready: Promise<void> | null = null;

export async function listGames(options?: { includeHidden?: boolean; sync?: boolean }) {
  await ensureDatabase();
  const includeHidden = options?.includeHidden ?? false;
  let rows = await readGames(includeHidden);

  if (options?.sync !== false && rows.some(isStale)) {
    try {
      await refreshStats(rows);
      rows = await readGames(includeHidden);
    } catch (error) {
      console.warn("Using cached Roblox stats:", error);
    }
  }

  return rows;
}

export async function previewGame(input: string) {
  return fetchRobloxGame(input);
}

export async function addGame(input: string) {
  await ensureDatabase();
  const snapshot = await fetchRobloxGame(input);
  const existing = await readGames(true);
  if (existing.some((game) => game.placeId === snapshot.placeId)) {
    throw new Error("That game is already in the portfolio.");
  }

  const now = new Date().toISOString();
  const record: GameRecord = {
    id: crypto.randomUUID(),
    ...snapshot,
    isVisible: true,
    isFeatured: false,
    sortOrder: Math.max(0, ...existing.map((game) => game.sortOrder)) + 10,
    addedAt: now,
    lastSyncedAt: now,
  };

  const sql = getSql();
  if (sql) await insertGame(sql, record);
  else getMemoryGames().push(record);
  return record;
}

export async function updateGame(id: string, action: GameAction) {
  await ensureDatabase();
  const ordered = await readGames(true);
  const current = ordered.find((game) => game.id === id);
  if (!current) throw new Error("Game not found.");

  const sql = getSql();

  if (action === "toggle-visible") {
    current.isVisible = !current.isVisible;
    if (sql) await sql`UPDATE games SET is_visible = ${current.isVisible} WHERE id = ${id}`;
  }

  if (action === "toggle-featured") {
    if (!current.isFeatured && ordered.filter((game) => game.isFeatured).length >= 3) {
      throw new Error("Unfeature one game first. The homepage supports three featured games.");
    }
    current.isFeatured = !current.isFeatured;
    if (sql) await sql`UPDATE games SET is_featured = ${current.isFeatured} WHERE id = ${id}`;
  }

  if (action === "refresh") {
    const snapshot = await fetchRobloxGame(current.robloxUrl);
    Object.assign(current, snapshot, { lastSyncedAt: new Date().toISOString() });
    if (sql) await updateSnapshot(sql, current);
  }

  if (action === "move-up" || action === "move-down") {
    const index = ordered.findIndex((game) => game.id === id);
    const otherIndex = action === "move-up" ? index - 1 : index + 1;
    if (index >= 0 && otherIndex >= 0 && otherIndex < ordered.length) {
      const other = ordered[otherIndex];
      const currentOrder = current.sortOrder;
      current.sortOrder = other.sortOrder;
      other.sortOrder = currentOrder;
      if (sql) {
        await sql.begin(async (tx) => {
          await tx`UPDATE games SET sort_order = ${current.sortOrder} WHERE id = ${current.id}`;
          await tx`UPDATE games SET sort_order = ${other.sortOrder} WHERE id = ${other.id}`;
        });
      }
    }
  }

  return current;
}

export async function removeGame(id: string) {
  await ensureDatabase();
  const sql = getSql();
  if (sql) {
    const deleted = await sql`DELETE FROM games WHERE id = ${id} RETURNING id`;
    if (deleted.length === 0) throw new Error("Game not found.");
    return;
  }

  const rows = getMemoryGames();
  const index = rows.findIndex((game) => game.id === id);
  if (index < 0) throw new Error("Game not found.");
  rows.splice(index, 1);
}

async function ensureDatabase() {
  if (ready) return ready;
  ready = (async () => {
    const sql = getSql();
    if (!sql) {
      getMemoryGames();
      return;
    }

    try {
      await sql`CREATE TABLE IF NOT EXISTS games (
        id text PRIMARY KEY,
        place_id text NOT NULL UNIQUE,
        universe_id text NOT NULL,
        roblox_url text NOT NULL,
        name text NOT NULL,
        description text NOT NULL DEFAULT '',
        creator_id text NOT NULL DEFAULT '',
        creator_name text NOT NULL DEFAULT 'Unknown creator',
        creator_type text NOT NULL DEFAULT 'Group',
        genre text NOT NULL DEFAULT 'Roblox',
        thumbnail_url text NOT NULL,
        visits integer NOT NULL DEFAULT 0,
        playing integer NOT NULL DEFAULT 0,
        rating integer NOT NULL DEFAULT 0,
        max_players integer NOT NULL DEFAULT 0,
        launched_at text NOT NULL DEFAULT '',
        is_visible boolean NOT NULL DEFAULT true,
        is_featured boolean NOT NULL DEFAULT false,
        sort_order integer NOT NULL DEFAULT 0,
        added_at text NOT NULL,
        last_synced_at text NOT NULL
      )`;
      await sql`CREATE INDEX IF NOT EXISTS games_sort_order_idx ON games (sort_order)`;
      await sql`CREATE INDEX IF NOT EXISTS games_visible_idx ON games (is_visible, is_featured)`;

      const [{ count }] = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM games`;
      if (count === 0) {
        for (const record of createSeedRecords()) await insertGame(sql, record);
      }
    } catch (error) {
      databaseUnavailable = true;
      sqlClient = null;
      getMemoryGames();
      console.warn("Persistent game storage is unavailable; using the bundled portfolio data.", error);
    }
  })();
  return ready;
}

function getSql() {
  if (databaseUnavailable || !process.env.DATABASE_URL) return null;
  sqlClient ??= postgres(process.env.DATABASE_URL, {
    max: 1,
    prepare: false,
    ssl: "require",
    idle_timeout: 20,
  });
  return sqlClient;
}

function getMemoryGames() {
  const store = globalThis as GlobalGameStore;
  store.__peacefulPlayGames ??= createSeedRecords();
  return store.__peacefulPlayGames;
}

function createSeedRecords(): GameRecord[] {
  return SEED_GAMES.map((game) => ({
    ...game,
    id: `seed-${game.placeId}`,
    addedAt: EPOCH,
    lastSyncedAt: EPOCH,
  })) as GameRecord[];
}

async function readGames(includeHidden: boolean) {
  const sql = getSql();
  if (!sql) {
    return getMemoryGames()
      .filter((game) => includeHidden || game.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.addedAt.localeCompare(b.addedAt));
  }

  const visibility = includeHidden ? sql`` : sql`WHERE is_visible = true`;
  return sql<GameRecord[]>`SELECT
    id, place_id AS "placeId", universe_id AS "universeId", roblox_url AS "robloxUrl",
    name, description, creator_id AS "creatorId", creator_name AS "creatorName",
    creator_type AS "creatorType", genre, thumbnail_url AS "thumbnailUrl", visits,
    playing, rating, max_players AS "maxPlayers", launched_at AS "launchedAt",
    is_visible AS "isVisible", is_featured AS "isFeatured", sort_order AS "sortOrder",
    added_at AS "addedAt", last_synced_at AS "lastSyncedAt"
    FROM games ${visibility} ORDER BY sort_order ASC, added_at ASC`;
}

function isStale(game: GameRecord) {
  const synced = new Date(game.lastSyncedAt).getTime();
  return !Number.isFinite(synced) || Date.now() - synced > STALE_AFTER_MS;
}

async function refreshStats(rows: GameRecord[]) {
  const stats = await fetchRobloxStats(rows.map((game) => game.universeId));
  const now = new Date().toISOString();
  const sql = getSql();

  for (const game of rows) {
    const fresh = stats.get(game.universeId);
    if (!fresh) continue;
    Object.assign(game, fresh, { lastSyncedAt: now });
    if (sql) await updateSnapshot(sql, game);
  }
}

async function insertGame(sql: Sql, game: GameRecord) {
  await sql`INSERT INTO games (
    id, place_id, universe_id, roblox_url, name, description, creator_id, creator_name,
    creator_type, genre, thumbnail_url, visits, playing, rating, max_players, launched_at,
    is_visible, is_featured, sort_order, added_at, last_synced_at
  ) VALUES (
    ${game.id}, ${game.placeId}, ${game.universeId}, ${game.robloxUrl}, ${game.name},
    ${game.description}, ${game.creatorId}, ${game.creatorName}, ${game.creatorType}, ${game.genre},
    ${game.thumbnailUrl}, ${game.visits}, ${game.playing}, ${game.rating}, ${game.maxPlayers},
    ${game.launchedAt}, ${game.isVisible}, ${game.isFeatured}, ${game.sortOrder}, ${game.addedAt},
    ${game.lastSyncedAt}
  ) ON CONFLICT (place_id) DO NOTHING`;
}

async function updateSnapshot(sql: Sql, game: GameRecord) {
  await sql`UPDATE games SET
    name = ${game.name}, description = ${game.description}, creator_id = ${game.creatorId},
    creator_name = ${game.creatorName}, creator_type = ${game.creatorType}, genre = ${game.genre},
    thumbnail_url = ${game.thumbnailUrl}, visits = ${game.visits}, playing = ${game.playing},
    rating = ${game.rating}, max_players = ${game.maxPlayers}, launched_at = ${game.launchedAt},
    last_synced_at = ${game.lastSyncedAt}
    WHERE id = ${game.id}`;
}
