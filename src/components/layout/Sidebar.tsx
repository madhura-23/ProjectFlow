"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, BarChart2, Settings, Zap } from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects",  href: "/projects",  icon: FolderKanban },
  { label: "My Tasks",  href: "/tasks",     icon: CheckSquare, badge: 4 },
  { label: "Team",      href: "/team",      icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-bg-border bg-bg-panel">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-bg-border">
        <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center">
          <Zap size={14} className="text-white" fill="white" />
        </div>
        <span className="font-semibold text-sm text-ink-bright">ProjectFlow</span>
      </div>

      <div className="px-3 py-3 border-b border-bg-border">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-bg-hover">
          <div className="w-5 h-5 rounded bg-brand-violet/30 flex items-center justify-center text-[10px] text-brand-violet font-bold">P</div>
          <span className="text-xs text-ink-mid font-medium flex-1 truncate">ProjectFlow HQ</span>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon, badge }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors group",
              active ? "bg-brand-blue/15 text-brand-blue" : "text-ink-mid hover:bg-bg-hover hover:text-ink-bright"
            )}>
              <Icon size={15} className={cn(active ? "text-brand-blue" : "text-ink-muted group-hover:text-ink-mid")} />
              <span className="flex-1">{label}</span>
              {badge && <span className="text-[10px] font-medium bg-brand-blue/20 text-brand-blue px-1.5 py-0.5 rounded-full">{badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-bg-border">
        <Link href="/settings" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-ink-mid hover:bg-bg-hover transition-colors">
          <Settings size={15} className="text-ink-muted" />Settings
        </Link>
        <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1 cursor-pointer rounded-lg hover:bg-bg-hover transition-colors">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-6 h-6 rounded-full" alt="avatar" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-ink-bright font-medium">Alex Chen</div>
            <div className="text-[10px] text-ink-muted">demo@projectflow.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
