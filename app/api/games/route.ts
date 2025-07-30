
import { NextRequest, NextResponse } from 'next/server';
import { GAME_URLS, fetchCompleteGameData, RobloxGameData } from '@/lib/roblox-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching real Roblox game data...');
    
    // Fetch data for all games
    const gameDataPromises = GAME_URLS.map(async (gameUrl) => {
      const { gameData, thumbnailUrl, placeId } = await fetchCompleteGameData(gameUrl);
      
      if (!gameData) {
        console.log(`Failed to fetch data for game: ${gameUrl}`);
        return null;
      }
      
      // Return data in RobloxGameData format for consistency
      return {
        ...gameData,
        gameUrl: gameUrl, // Add gameUrl for Games page compatibility
        thumbnailPath: gameData.thumbnailPath || thumbnailUrl || '/groweggs.webp',
        isActive: (gameData.ccu || gameData.playing || 0) > 0,
        placeId: placeId
      } as RobloxGameData & { gameUrl: string; isActive: boolean; placeId: string };
    });
    
    const results = await Promise.all(gameDataPromises);
    const validGames = results.filter(game => game !== null);
    
    // Sort by CCU (descending) - highest activity first
    validGames.sort((a, b) => (b?.ccu || 0) - (a?.ccu || 0));
    
    console.log(`Successfully fetched data for ${validGames.length} games`);
    
    return NextResponse.json({
      success: true,
      games: validGames,
      count: validGames.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching game data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch game data',
      message: error instanceof Error ? error.message : 'Unknown error',
      games: [],
      count: 0
    }, { status: 500 });
  }
}
