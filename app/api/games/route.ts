import { listGames } from "@/lib/games";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const games = await listGames();
    return Response.json({ success: true, games, count: games.length });
  } catch (error) {
    return Response.json(
      { success: false, games: [], error: error instanceof Error ? error.message : "Could not load games." },
      { status: 500 },
    );
  }
}
