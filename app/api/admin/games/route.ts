import { requireAdminApi } from "@/lib/admin-auth";
import { addGame, listGames } from "@/lib/games";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin.user) return Response.json({ error: "Sign in with ChatGPT first." }, { status: 401 });
  if (!admin.ok) return Response.json({ error: "This account is not an administrator." }, { status: 403 });
  return Response.json({ games: await listGames({ includeHidden: true, sync: false }) });
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin.user) return Response.json({ error: "Sign in with ChatGPT first." }, { status: 401 });
  if (!admin.ok) return Response.json({ error: "This account is not an administrator." }, { status: 403 });

  try {
    const body = (await request.json()) as { url?: string };
    if (!body.url?.trim()) return Response.json({ error: "A Roblox game URL is required." }, { status: 400 });
    const game = await addGame(body.url);
    return Response.json({ game }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not add that game." }, { status: 400 });
  }
}
