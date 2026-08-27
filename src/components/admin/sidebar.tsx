"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Inbox, LogOut, ExternalLink } from "lucide-react";
import { signOutAction } from "@/app/admin/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: Inbox },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname() || "";

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <Link href="/admin" className="block">
          <h1 className="heading-display text-xl">Dollar Contracting</h1>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            Admin
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-[var(--brand)]/10 font-semibold text-[var(--brand)]"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View public site
        </Link>
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="truncate text-xs font-medium">{email}</p>
          <form action={signOutAction} className="mt-1.5">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-3 w-3" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
