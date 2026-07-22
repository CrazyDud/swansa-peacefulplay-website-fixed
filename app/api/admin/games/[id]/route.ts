import { requireAdminApi } from "@/lib/admin-auth";
import { removeGame, updateGame } from "@/lib/games";

const ACTIONS = ["toggle-visible", "toggle-featured", "move-up", "move-down", "refresh"] as const;
type Action = (typeof ACTIONS)[number];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();
  if (!admin.user) return Response.json({ error: "Sign in with ChatGPT first." }, { status: 401 });
  if (!admin.ok) return Response.json({ error: "This account is not an administrator." }, { status: 403 });

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { action?: Action };
    if (!body.action || !ACTIONS.includes(body.action)) {
      return Response.json({ error: "Unknown game action." }, { status: 400 });
    }
    const game = await updateGame(id, body.action);
    return Response.json({ game });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not update the game." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();
  if (!admin.user) return Response.json({ error: "Sign in with ChatGPT first." }, { status: 401 });
  if (!admin.ok) return Response.json({ error: "This account is not an administrator." }, { status: 403 });

  try {
    const { id } = await context.params;
    await removeGame(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not remove the game." }, { status: 400 });
  }
}
