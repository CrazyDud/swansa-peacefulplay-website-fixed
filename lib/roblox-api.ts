
// Enhanced Roblox API utilities with real data integration

export interface RobloxGameData {
  id: number;
  name: string;
  description: string;
  rootPlaceId: number;
  playing: number;
  visits: number;
  maxPlayers: number;
  created: string;
  updated: string;
  creator: {
    id: number;
    name: string;
    type: string;
  };
  genre: string;
  thumbnailPath: string;
  ccu: number; // Current concurrent users
  rating: number;
}

// Game URLs provided by the user (removed "Get Rich Simulator")
export const GAME_URLS = [
  'https://www.roblox.com/games/89726090098716/Grow-Eggs',
  'https://www.roblox.com/games/82765379267604/Anime-Sword-Master',
  'https://www.roblox.com/games/119235008877304/Sigma-Boy-Simulator',
  'https://www.roblox.com/games/7728848215/Slashing-Simulator',
  'https://www.roblox.com/games/10549069562/Weapon-Crafting-Simulator',
  'https://www.roblox.com/games/18956736354/Anime-Slashing-Simulator',
  'https://www.roblox.com/games/15313073197/Anime-Combats-Simulator',
  'https://www.roblox.com/games/98262568396175/Ship-Mateys-2-Player-Obby',
  'https://www.roblox.com/games/89237005955850/Walk-Or-Die',
  'https://www.roblox.com/games/108261591703074/Escape-Hell-For-Admin'
];

// Game data with local thumbnails mapping
export const GAME_THUMBNAIL_MAP: Record<string, string> = {
  '89726090098716': '/groweggs.webp',
  '82765379267604': '/animeswordmaster.webp',
  '119235008877304': '/sigmaboysimulator.webp',
  '7728848215': '/slashingsimulator.webp',
  '10549069562': '/weaponcraftingsimulator.webp',
  '18956736354': '/animeslashingsimulator.webp',
  '15313073197': '/animecombatssimulator.webp',
  '98262568396175': '/shipmateys.webp',
  '89237005955850': '/walkordie.png',
  '108261591703074': '/escapehellforadmin.webp'
};

// Extract place ID from Roblox game URL
export function extractPlaceId(gameUrl: string): string {
  const match = gameUrl.match(/\/games\/(\d+)\//);
  return match ? match[1] : '';
}

// Helper function to format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num?.toString() || '0';
}

// Fetch universe ID from place ID - try multiple API sources
export async function getUniverseId(placeId: string): Promise<number | null> {
  const apiSources = [
    // Primary: Official Roblox API
    `https://api.roblox.com/universes/get-universe-containing-place?placeId=${placeId}`,
    // Secondary: RoProxy (more reliable for CORS)
    `https://apis.roproxy.com/universes/v1/places/${placeId}/universe`,
    // Tertiary: Alternative endpoint
    `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`
  ];

  for (const [index, apiUrl] of apiSources.entries()) {
    try {
      console.log(`Trying API source ${index + 1}: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SwansaPeacefulPlay/1.0'
        }
      });
      
      if (!response.ok) {
        console.warn(`API source ${index + 1} failed with status ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      // Handle different response formats
      if (data.UniverseId) return data.UniverseId; // Official API format
      if (data.universeId) return data.universeId; // RoProxy format
      if (data[0]?.universeId) return data[0].universeId; // Alternative format
      
      console.warn(`API source ${index + 1} returned unexpected format:`, data);
    } catch (error) {
      console.error(`API source ${index + 1} failed:`, error);
    }
  }
  
  console.error(`All API sources failed for place ${placeId}`);
  return null;
}

// Fetch game statistics using multiple API sources with priority
export async function fetchRealGameData(universeId: number, placeId: string): Promise<any> {
  const apiAttempts = [
    // Primary: Official Roblox Games API
    async () => {
      console.log(`Trying official Roblox API for universe ${universeId}`);
      const [gameResponse, votesResponse] = await Promise.all([
        fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`, {
          headers: { 'Accept': 'application/json' }
        }),
        fetch(`https://games.roblox.com/v1/games/votes?universeIds=${universeId}`, {
          headers: { 'Accept': 'application/json' }
        })
      ]);

      const gameData = gameResponse.ok ? await gameResponse.json() : null;
      const votesData = votesResponse.ok ? await votesResponse.json() : null;

      return {
        game: gameData?.data?.[0] || null,
        votes: votesData?.data?.[0] || null,
        source: 'official-roblox'
      };
    },
    
    // Secondary: RomMonitor API (if available)
    async () => {
      console.log(`Trying RomMonitor API for place ${placeId}`);
      const response = await fetch(`https://api.rommonitor.com/v1/game/${placeId}`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`RomMonitor API failed: ${response.status}`);
      const data = await response.json();
      
      return {
        game: {
          id: universeId,
          name: data.name || '',
          description: data.description || '',
          playing: data.currentPlayers || 0,
          visits: data.totalVisits || 0,
          maxPlayers: data.maxPlayers || 50,
          created: data.created || '2024-01-01T00:00:00Z',
          updated: data.updated || '2024-07-29T00:00:00Z'
        },
        votes: {
          upVotes: data.likes || 0,
          downVotes: data.dislikes || 0
        },
        source: 'rommonitor'
      };
    },
    
    // Tertiary: RoProxy fallback
    async () => {
      console.log(`Trying RoProxy API for universe ${universeId}`);
      const [gameResponse, votesResponse] = await Promise.all([
        fetch(`https://games.roproxy.com/v1/games?universeIds=${universeId}`),
        fetch(`https://games.roproxy.com/v1/games/votes?universeIds=${universeId}`)
      ]);

      const gameData = gameResponse.ok ? await gameResponse.json() : null;
      const votesData = votesResponse.ok ? await votesResponse.json() : null;

      return {
        game: gameData?.data?.[0] || null,
        votes: votesData?.data?.[0] || null,
        source: 'roproxy'
      };
    }
  ];

  for (const [index, apiAttempt] of apiAttempts.entries()) {
    try {
      const result = await apiAttempt();
      if (result.game) {
        console.log(`Successfully fetched data using ${result.source} API`);
        return result;
      }
    } catch (error) {
      console.error(`API attempt ${index + 1} failed:`, error);
    }
  }
  
  console.error(`All API attempts failed for universe ${universeId}`);
  return { game: null, votes: null, source: 'none' };
}

// Enhanced game data fetching with real APIs and fallback to mock data
export async function fetchCompleteGameData(gameUrl: string): Promise<{
  gameData: RobloxGameData | null;
  thumbnailUrl: string | null;
  placeId: string;
}> {
  const placeId = extractPlaceId(gameUrl);
  
  if (!placeId) {
    return { gameData: null, thumbnailUrl: null, placeId: '' };
  }

  // Get local thumbnail
  const thumbnailPath = GAME_THUMBNAIL_MAP[placeId] || null;

  // Try to fetch real data first using multiple API sources
  try {
    console.log(`Attempting to fetch real data for place ${placeId}`);
    const universeId = await getUniverseId(placeId);
    if (universeId) {
      const realData = await fetchRealGameData(universeId, placeId);
      if (realData.game) {
        console.log(`Successfully got real data from ${realData.source} for ${placeId}`);
        const gameData: RobloxGameData = {
          id: realData.game.id || parseInt(placeId),
          name: realData.game.name || '',
          description: realData.game.description || 'An exciting Roblox experience!',
          rootPlaceId: parseInt(placeId),
          playing: realData.game.playing || 0,
          visits: realData.game.visits || 0,
          maxPlayers: realData.game.maxPlayers || 50,
          created: realData.game.created || '2024-01-01T00:00:00Z',
          updated: realData.game.updated || '2024-07-29T00:00:00Z',
          creator: realData.game.creator || {
            id: 12345,
            name: 'Swansa x PeacefulPlay',
            type: 'Group'
          },
          genre: 'Simulator',
          thumbnailPath: thumbnailPath || '',
          ccu: realData.game.playing || 0,
          rating: realData.votes ? 
            (realData.votes.upVotes / (realData.votes.upVotes + realData.votes.downVotes) * 100) : 85
        };

        return { gameData, thumbnailUrl: thumbnailPath, placeId };
      } else {
        console.warn(`No game data received from any API source for ${placeId}`);
      }
    } else {
      console.warn(`Could not get universe ID for place ${placeId}`);
    }
  } catch (error) {
    console.error(`Failed to fetch real data for ${placeId}, falling back to mock data:`, error);
  }

  // Fallback to enhanced mock data (removed "Get Rich Simulator")
  const mockData: Record<string, any> = {
    '89726090098716': {
      name: 'Grow Eggs',
      visits: 15000000,
      playing: 2500,
      description: 'Hatch and collect amazing eggs in this addictive simulator!',
      ccu: 2500,
      rating: 94.5
    },
    '82765379267604': {
      name: 'Anime Sword Master',
      visits: 8500000,
      playing: 1800,
      description: 'Master the art of sword fighting in this epic anime adventure!',
      ccu: 1800,
      rating: 91.2
    },
    '119235008877304': {
      name: 'Sigma Boy Simulator',
      visits: 6500000,
      playing: 1200,
      description: 'Embrace the sigma mindset and dominate the leaderboards!',
      ccu: 1200,
      rating: 89.8
    },
    '7728848215': {
      name: 'Slashing Simulator',
      visits: 9800000,
      playing: 1600,
      description: 'Slash your way through enemies and upgrade your weapons!',
      ccu: 1600,
      rating: 92.1
    },
    '10549069562': {
      name: 'Weapon Crafting Simulator',
      visits: 7200000,
      playing: 1400,
      description: 'Craft legendary weapons and become the ultimate smith!',
      ccu: 1400,
      rating: 90.5
    },
    '18956736354': {
      name: 'Anime Slashing Simulator',
      visits: 5800000,
      playing: 1000,
      description: 'Unleash anime-style attacks in this action-packed game!',
      ccu: 1000,
      rating: 88.7
    },
    '15313073197': {
      name: 'Anime Combats Simulator',
      visits: 4900000,
      playing: 850,
      description: 'Experience epic anime battles and power-ups!',
      ccu: 850,
      rating: 87.3
    },
    '98262568396175': {
      name: 'Ship Mateys 2 Player Obby',
      visits: 3200000,
      playing: 600,
      description: 'Team up with a friend for this challenging obby adventure!',
      ccu: 600,
      rating: 86.1
    },
    '89237005955850': {
      name: 'Walk Or Die',
      visits: 2800000,
      playing: 400,
      description: 'Keep walking or face the consequences in this survival game!',
      ccu: 400,
      rating: 84.9
    },
    '108261591703074': {
      name: 'Escape Hell For Admin',
      visits: 2100000,
      playing: 300,
      description: 'Escape the depths of hell and earn admin privileges!',
      ccu: 300,
      rating: 82.5
    }
  };

  const data = mockData[placeId];
  
  if (!data) {
    return { gameData: null, thumbnailUrl: null, placeId };
  }

  const gameData: RobloxGameData = {
    id: parseInt(placeId),
    name: data.name,
    description: data.description,
    rootPlaceId: parseInt(placeId),
    playing: data.playing,
    visits: data.visits,
    maxPlayers: 50,
    created: '2024-01-01T00:00:00Z',
    updated: '2024-07-29T00:00:00Z',
    creator: {
      id: 12345,
      name: 'Swansa x PeacefulPlay',
      type: 'Group'
    },
    genre: 'Simulator',
    thumbnailPath: thumbnailPath || '',
    ccu: data.ccu,
    rating: data.rating
  };

  return { gameData, thumbnailUrl: thumbnailPath, placeId };
}
