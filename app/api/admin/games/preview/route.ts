import { requireAdminApi } from "@/lib/admin-auth";
import { previewGame } from "@/lib/games";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin.user) return Response.json({ error: "Sign in with ChatGPT first." }, { status: 401 });
  if (!admin.ok) return Response.json({ error: "This account is not an administrator." }, { status: 403 });

  try {
    const body = (await request.json()) as { url?: string };
    if (!body.url?.trim()) return Response.json({ error: "A Roblox game URL is required." }, { status: 400 });
    const game = await previewGame(body.url);
    return Response.json({ game });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not preview that game." }, { status: 400 });
  }
}
