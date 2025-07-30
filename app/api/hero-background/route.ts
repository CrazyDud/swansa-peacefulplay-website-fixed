
import { NextRequest, NextResponse } from 'next/server';
import { GAME_URLS, fetchCompleteGameData } from '@/lib/roblox-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching hero background from top game...');
    
    // Fetch data for all games to find the top performer
    const gameDataPromises = GAME_URLS.map(async (gameUrl) => {
      const { gameData, thumbnailUrl, placeId } = await fetchCompleteGameData(gameUrl);
      
      if (!gameData) {
        return null;
      }
      
      return {
        name: gameData.name || 'Unknown Game',
        gameUrl: gameUrl,
        imageUrl: thumbnailUrl,
        visitCount: gameData.visits || 0,
        currentPlayers: gameData.playing || 0,
      };
    });
    
    const results = await Promise.all(gameDataPromises);
    const validGames = results.filter(game => game !== null);
    
    // Sort by visits (descending) to get the top game
    validGames.sort((a, b) => (b?.visitCount || 0) - (a?.visitCount || 0));
    
    const topGame = validGames[0];
    
    if (!topGame) {
      // Fallback to default background
      return NextResponse.json({
        success: false,
        backgroundUrl: 'https://cdn.abacus.ai/images/6c338899-01e9-4dbc-8032-77029b3147f1.png',
        gameName: 'Default Background',
        visitCount: 0
      });
    }
    
    console.log(`Top game: ${topGame.name} with ${topGame.visitCount} visits`);
    
    return NextResponse.json({
      success: true,
      backgroundUrl: topGame.imageUrl || 'https://cdn.abacus.ai/images/6c338899-01e9-4dbc-8032-77029b3147f1.png',
      gameName: topGame.name,
      visitCount: topGame.visitCount,
      currentPlayers: topGame.currentPlayers,
      gameUrl: topGame.gameUrl
    });
    
  } catch (error) {
    console.error('Error fetching hero background:', error);
    
    // Return fallback background
    return NextResponse.json({
      success: false,
      backgroundUrl: 'https://cdn.abacus.ai/images/6c338899-01e9-4dbc-8032-77029b3147f1.png',
      gameName: 'Default Background',
      visitCount: 0
    });
  }
}
