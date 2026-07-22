import type { Metadata } from "next";
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { requireAdminPage } from "@/lib/admin-auth";
import { listGames } from "@/lib/games";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Game Manager",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await requireAdminPage();
  if (!admin.ok || !admin.user) {
    return (
      <main className="access-denied">
        <ShieldX size={42} />
        <span>Swansa × PeacefulPlay admin</span>
        <h1>This account is not approved.</h1>
        <p>Sign in with the ChatGPT email configured as the site administrator.</p>
        <div><Link className="button button-primary" href="/">Return home</Link><a className="button button-ghost" href={chatGPTSignOutPath("/admin")}>Use another account</a></div>
      </main>
    );
  }

  const games = await listGames({ includeHidden: true, sync: false });
  return <AdminDashboard initialGames={games} adminName={admin.user.displayName} />;
}
