"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, FolderKanban, Github, Medal, MessageSquare, Shield, Sparkles, BriefcaseBusiness, FileBadge, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { logoutAdmin } from "@/lib/auth";

const items = [
  ["Dashboard", "/admin/dashboard", BarChart3],
  ["Projects", "/admin/projects", FolderKanban],
  ["Repositories", "/admin/repositories", Github],
  ["Achievements", "/admin/achievements", Medal],
  ["Skills", "/admin/skills", Sparkles],
  ["Experiences", "/admin/experiences", BriefcaseBusiness],
  ["Certificates", "/admin/certificates", FileBadge],
  ["Messages", "/admin/messages", MessageSquare]
];

export function AdminLayout({ children, title = "Admin Dashboard" }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading) return <div className="grid min-h-screen place-items-center bg-ink text-slate-300"><div className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4">Checking admin session...</div></div>;
  if (!user) return null;

  const isOwner = isAdmin;

  return (
    <div className="min-h-screen bg-ink text-white">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-white/10 bg-slate-950/88 p-5 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-300 text-slate-950"><Shield className="h-5 w-5" /></span>
          <span><strong className="block">Portfolio Admin</strong><small className="text-slate-400">Firebase CMS</small></span>
        </Link>
        <nav className="mt-8 grid gap-1">
          {items.map(([label, href, Icon]) => (
            <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${pathname === href ? "bg-teal-300 text-slate-950" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-sm font-medium text-white">Admin access</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {isOwner ? `Authenticated as ${user.email} (admin)` : `Warning: Signed in as ${user.email}. This account does not have admin access, so writes will be rejected.`}
          </p>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 px-4 py-4 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold">{title}</h1>
              <p className="truncate text-sm text-slate-400">{user.email} {!isOwner && "(Read Only Mode)"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href="/" variant="secondary"><ExternalLink className="h-4 w-4" /> View Site</Button>
              <Button variant="ghost" onClick={async () => { await logoutAdmin(); router.replace("/admin/login"); }}><LogOut className="h-4 w-4" /> Logout</Button>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {items.map(([label, href]) => (
              <Link key={href} href={href} className={`shrink-0 rounded-full px-3 py-2 text-xs ${pathname === href ? "bg-teal-300 text-slate-950" : "bg-white/8 text-slate-300"}`}>{label}</Link>
            ))}
          </nav>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
