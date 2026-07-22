import { getChatGPTUser, requireChatGPTUser } from "@/app/chatgpt-auth";

type AdminResult = {
  ok: boolean;
  user: { displayName: string; email: string } | null;
};

export async function requireAdminPage(): Promise<AdminResult> {
  if (isLocalDevelopment()) {
    return {
      ok: true,
      user: { displayName: "Local admin", email: "local@peacefulplay.dev" },
    };
  }

  const user = await requireChatGPTUser("/admin");
  return { ok: isAllowed(user.email), user };
}

export async function requireAdminApi(): Promise<AdminResult> {
  if (isLocalDevelopment()) {
    return {
      ok: true,
      user: { displayName: "Local admin", email: "local@peacefulplay.dev" },
    };
  }

  const user = await getChatGPTUser();
  if (!user) return { ok: false, user: null };
  return { ok: isAllowed(user.email), user };
}

function isAllowed(email: string) {
  const configured = String(process.env.ADMIN_EMAILS ?? "");
  const allowed = configured
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

function isLocalDevelopment() {
  return process.env.NODE_ENV !== "production";
}
