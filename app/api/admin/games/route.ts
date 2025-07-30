import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeGames(games: Game[]): Promise<void> {
  await writeFile(GAMES_FILE, JSON.stringify(games, null, 2));
}

export async function GET() {
  try {
    const games = await readGames();
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error reading games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const newGame: Game = {
      id: uuidv4(),
      title,
      description,
      imageUrl,
      category,
      featured: featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    games.push(newGame);
    await writeGames(games);

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}
