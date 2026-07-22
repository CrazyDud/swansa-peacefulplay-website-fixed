export type RobloxSnapshot = {
  placeId: string;
  universeId: string;
  robloxUrl: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorType: string;
  genre: string;
  thumbnailUrl: string;
  visits: number;
  playing: number;
  rating: number;
  maxPlayers: number;
  launchedAt: string;
};

type RobloxGameResponse = {
  data?: Array<{
    id: number;
    rootPlaceId: number;
    name: string;
    description: string;
    playing: number;
    visits: number;
    maxPlayers: number;
    created: string;
    canonicalUrlPath?: string;
    genre_l1?: string;
    genre?: string;
    creator?: { id: number; name: string; type: string };
  }>;
};

type VotesResponse = {
  data?: Array<{ id: number; upVotes: number; downVotes: number }>;
};

export function extractPlaceId(input: string) {
  const value = input.trim();
  if (/^\d{5,}$/.test(value)) return value;
  const match = value.match(/roblox\.com\/games\/(\d+)/i);
  if (!match) throw new Error("Paste a full Roblox game URL or place ID.");
  return match[1];
}

export async function fetchRobloxGame(input: string): Promise<RobloxSnapshot> {
  const placeId = extractPlaceId(input);
  const universe = await fetchJson<{ universeId?: number }>(
    `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
  );
  if (!universe.universeId) throw new Error("Roblox could not find that public game.");

  const universeId = String(universe.universeId);
  const [gamesResponse, votesResponse] = await Promise.all([
    fetchJson<RobloxGameResponse>(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`,
    ),
    fetchJson<VotesResponse>(
      `https://games.roblox.com/v1/games/votes?universeIds=${universeId}`,
    ),
  ]);

  const game = gamesResponse.data?.[0];
  if (!game || !game.id || game.rootPlaceId === 0) {
    throw new Error("That game is private, unavailable, or has no public metadata.");
  }

  const vote = votesResponse.data?.[0];
  const totalVotes = (vote?.upVotes ?? 0) + (vote?.downVotes ?? 0);
  const thumbnailUrl = await fetchWideThumbnail(universeId);
  const canonicalPath = game.canonicalUrlPath || `/games/${placeId}`;

  return {
    placeId,
    universeId,
    robloxUrl: `https://www.roblox.com${canonicalPath}`,
    name: game.name.trim(),
    description: cleanDescription(game.description),
    creatorId: String(game.creator?.id ?? ""),
    creatorName: game.creator?.name || "Unknown creator",
    creatorType: game.creator?.type || "Group",
    genre: game.genre_l1 || game.genre || "Roblox",
    thumbnailUrl,
    visits: game.visits || 0,
    playing: game.playing || 0,
    rating: totalVotes > 0
      ? Math.round(((vote?.upVotes ?? 0) / totalVotes) * 1000)
      : 0,
    maxPlayers: game.maxPlayers || 0,
    launchedAt: game.created || "",
  };
}

export async function fetchRobloxStats(universeIds: string[]) {
  if (universeIds.length === 0) return new Map<string, Partial<RobloxSnapshot>>();
  const uniqueIds = [...new Set(universeIds)].slice(0, 100);
  const ids = uniqueIds.join(",");
  const [gamesResponse, votesResponse] = await Promise.all([
    fetchJson<RobloxGameResponse>(`https://games.roblox.com/v1/games?universeIds=${ids}`),
    fetchJson<VotesResponse>(`https://games.roblox.com/v1/games/votes?universeIds=${ids}`),
  ]);

  const votes = new Map((votesResponse.data ?? []).map((vote) => [String(vote.id), vote]));
  return new Map(
    (gamesResponse.data ?? [])
      .filter((game) => game.id && game.rootPlaceId)
      .map((game) => {
        const vote = votes.get(String(game.id));
        const totalVotes = (vote?.upVotes ?? 0) + (vote?.downVotes ?? 0);
        return [
          String(game.id),
          {
            name: game.name.trim(),
            description: cleanDescription(game.description),
            creatorId: String(game.creator?.id ?? ""),
            creatorName: game.creator?.name || "Unknown creator",
            creatorType: game.creator?.type || "Group",
            genre: game.genre_l1 || game.genre || "Roblox",
            visits: game.visits || 0,
            playing: game.playing || 0,
            rating: totalVotes > 0
              ? Math.round(((vote?.upVotes ?? 0) / totalVotes) * 1000)
              : 0,
            maxPlayers: game.maxPlayers || 0,
            launchedAt: game.created || "",
          },
        ] as const;
      }),
  );
}

async function fetchWideThumbnail(universeId: string) {
  try {
    const media = await fetchJson<{
      data?: Array<{ assetType: string; imageId?: number; approved?: boolean }>;
    }>(`https://games.roblox.com/v2/games/${universeId}/media`);
    const imageId = media.data?.find(
      (item) => item.assetType === "Image" && item.approved && item.imageId,
    )?.imageId;

    if (imageId) {
      const asset = await fetchJson<{
        data?: Array<{ state: string; imageUrl?: string }>;
      }>(
        `https://thumbnails.roblox.com/v1/assets?assetIds=${imageId}&returnPolicy=PlaceHolder&size=768x432&format=Webp&isCircular=false`,
      );
      const imageUrl = asset.data?.find((item) => item.state === "Completed")?.imageUrl;
      if (imageUrl) return imageUrl;
    }
  } catch {
    // Fall through to the stable square game icon.
  }

  const icon = await fetchJson<{
    data?: Array<{ state: string; imageUrl?: string }>;
  }>(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=512x512&format=Webp&isCircular=false`,
  );
  const imageUrl = icon.data?.find((item) => item.state === "Completed")?.imageUrl;
  if (!imageUrl) throw new Error("Roblox has not finished generating this game's artwork.");
  return imageUrl;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Roblox returned ${response.status}. Try again shortly.`);
  return response.json() as Promise<T>;
}

function cleanDescription(value: string) {
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) return "A Roblox experience from the PeacefulPlay portfolio.";
  return compact.length > 260 ? `${compact.slice(0, 257).trim()}…` : compact;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}
