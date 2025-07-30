import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const GAMES_FILE = join(process.cwd(), 'games.json');

interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

async function readGames(): Promise<Game[]> {
  try {
    const data = await readFile(GAMES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeGames(games: Game[]): Promise<void> {
  await writeFile(GAMES_FILE, JSON.stringify(games, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const games = await readGames();
    const game = games.find(g => g.id === params.id);
    
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, category, featured } = body;

    if (!title || !description || !imageUrl || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const games = await readGames();
    const gameIndex = games.findIndex(g => g.id === params.id);
    
    if (gameIndex === -1) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    games[gameIndex] = {
      ...games[gameIndex],
      title,
      description,
      imageUrl,
      category,
      featured: featured || false,
      updatedAt: new Date().toISOString(),
    };

    await writeGames(games);

    return NextResponse.json(games[gameIndex]);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const games = await readGames();
    const gameIndex = games.findIndex(g => g.id === params.id);
    
    if (gameIndex === -1) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    games.splice(gameIndex, 1);
    await writeGames(games);

    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}
