"use client";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import Notifications from "@/components/ui/Notifications";
import SearchPalette from "@/components/ui/SearchPalette";

const TITLES: Record<string, string> = {
  "/dashboard":"Dashboard", "/projects":"Projects",
  "/tasks":"My Tasks", "/team":"Team",
  "/analytics":"Analytics", "/settings":"Settings",
};

export default function Header() {
  const path = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const title = Object.entries(TITLES).find(([k]) => path.startsWith(k))?.[1] ?? "ProjectFlow";

  const openSearch = useCallback(() => setShowSearch(true), []);

  return (
    <>
      <header className="flex items-center gap-4 px-6 py-3.5 border-b border-bg-border bg-bg-panel flex-shrink-0">
        <h1 className="text-sm font-semibold text-ink-bright min-w-[100px]">{title}</h1>
        <div className="flex-1 max-w-sm">
          <button onClick={openSearch}
            className="w-full flex items-center gap-2 bg-bg-card border border-bg-border rounded-lg px-3 py-1.5 text-xs text-ink-muted hover:border-brand-blue/40 transition-colors group">
            <Search size={13} />
            <span className="flex-1 text-left">Search tasks, projects...</span>
            <kbd className="text-[10px] bg-bg-hover px-1.5 py-0.5 rounded border border-bg-border">⌘K</kbd>
          </button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} />New Task
          </button>
          <Notifications />
        </div>
      </header>
      {showSearch && <SearchPalette onClose={() => setShowSearch(false)} />}
    </>
  );
}
