"use client";
import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, X, Loader2 } from "lucide-react";
import { cn, STATUS_COLORS } from "@/lib/utils";
import type { Task, Project } from "@/types";

interface Props { onClose: () => void; }

export default function SearchPalette({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) { setTasks([]); setProjects([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const [tr, pr] = await Promise.all([
          fetch("/api/tasks").then(r=>r.json()),
          fetch("/api/projects").then(r=>r.json()),
        ]);
        const q = query.toLowerCase();
        setTasks(tr.filter((t: Task) => t.title.toLowerCase().includes(q)).slice(0,5));
        setProjects(pr.filter((p: Project) => p.name.toLowerCase().includes(q)).slice(0,3));
      } finally { setLoading(false); }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const hasResults = tasks.length > 0 || projects.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="bg-bg-panel border border-bg-border rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-bg-border">
            {loading ? <Loader2 size={15} className="animate-spin text-ink-muted flex-shrink-0" /> : <Search size={15} className="text-ink-muted flex-shrink-0" />}
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search tasks, projects..."
              className="flex-1 bg-transparent text-sm text-ink-bright placeholder:text-ink-muted focus:outline-none" />
            {query && <button onClick={() => setQuery("")} className="text-ink-muted hover:text-ink-bright"><X size={13} /></button>}
            <kbd className="text-[10px] text-ink-muted bg-bg-hover px-1.5 py-0.5 rounded border border-bg-border">ESC</kbd>
          </div>

          {hasResults ? (
            <div className="max-h-80 overflow-y-auto">
              {projects.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] text-ink-muted uppercase tracking-widest border-b border-bg-border">Projects</div>
                  {projects.map(p => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover cursor-pointer group">
                      <div className="w-5 h-5 rounded flex-shrink-0" style={{ background: p.color + "33" }}>
                        <div className="w-full h-full rounded flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                        </div>
                      </div>
                      <span className="text-xs text-ink-bright flex-1">{p.name}</span>
                      <ArrowRight size={11} className="text-ink-muted opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              )}
              {tasks.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] text-ink-muted uppercase tracking-widest border-b border-bg-border">Tasks</div>
                  {tasks.map(t => (
                    <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover cursor-pointer group">
                      <div className={cn("text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 font-medium", STATUS_COLORS[t.status])}>
                        {{TODO:"Todo",IN_PROGRESS:"In Progress",IN_REVIEW:"Review",DONE:"Done"}[t.status]}
                      </div>
                      <span className="text-xs text-ink-bright flex-1 truncate">{t.title}</span>
                      <ArrowRight size={11} className="text-ink-muted opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : query && !loading ? (
            <div className="px-4 py-8 text-center text-sm text-ink-muted">No results for &ldquo;{query}&rdquo;</div>
          ) : !query ? (
            <div className="px-4 py-6 text-center text-xs text-ink-muted">Start typing to search across all tasks and projects</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
