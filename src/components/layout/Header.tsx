"use client";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus } from "lucide-react";
import { useState } from "react";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard", "/projects": "Projects",
  "/tasks": "My Tasks", "/team": "Team",
  "/analytics": "Analytics", "/settings": "Settings",
};

export default function Header() {
  const path = usePathname();
  const [search, setSearch] = useState("");
  const title = Object.entries(TITLES).find(([k]) => path.startsWith(k))?.[1] ?? "ProjectFlow";
  return (
    <header className="flex items-center gap-4 px-6 py-3.5 border-b border-bg-border bg-bg-panel flex-shrink-0">
      <h1 className="text-sm font-semibold text-ink-bright min-w-[100px]">{title}</h1>
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks, projects..."
            className="w-full bg-bg-card border border-bg-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-ink-mid placeholder:text-ink-muted focus:outline-none focus:border-brand-blue/50 transition-colors" />
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
          <Plus size={13} />New Task
        </button>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-hover text-ink-mid">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-blue rounded-full" />
        </button>
      </div>
    </header>
  );
}
