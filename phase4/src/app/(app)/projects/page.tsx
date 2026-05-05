"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, FolderKanban, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const COLORS = ["#3a7bff","#9b5de5","#00d4aa","#f7c948","#ff6b6b","#06b6d4","#84cc16"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try { const r = await fetch("/api/projects"); setProjects(await r.json()); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await fetch("/api/projects", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: desc.trim(), color }),
      });
      setShowModal(false); setName(""); setDesc(""); setColor(COLORS[0]);
      fetchProjects();
    } finally { setCreating(false); }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink-bright">Projects</h2>
          <p className="text-sm text-ink-mid mt-0.5">{projects.length} active project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
          <Plus size={13} />New Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 size={20} className="animate-spin text-ink-muted" /></div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <FolderKanban size={40} className="text-ink-muted mb-3" />
          <p className="text-sm text-ink-bright font-medium">No projects yet</p>
          <p className="text-xs text-ink-muted mt-1">Create your first project to get started</p>
          <button onClick={() => setShowModal(true)}
            className="mt-4 text-xs bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-brand-blue/90">
            Create project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const count = p._count?.tasks ?? 0;
            return (
              <Link key={p.id} href={`/projects/${p.id}`}
                className="bg-bg-panel border border-bg-border rounded-xl p-5 hover:border-brand-blue/30 transition-all group block">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: p.color + "22" }}>
                    <FolderKanban size={17} style={{ color: p.color }} />
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium",
                    p.status === "ACTIVE" ? "bg-brand-teal/10 text-brand-teal" : "bg-bg-hover text-ink-muted")}>
                    {p.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-ink-bright group-hover:text-white mb-1">{p.name}</h3>
                {p.description && <p className="text-xs text-ink-muted line-clamp-2 mb-3">{p.description}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-bg-border">
                  <span className="text-xs text-ink-muted">{count} task{count !== 1 ? "s" : ""}</span>
                  <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="bg-bg-panel border border-bg-border rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-ink-bright">New Project</h3>
              <button onClick={() => setShowModal(false)} className="text-ink-muted hover:text-ink-bright"><X size={15} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-ink-mid block mb-1.5">Project name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && createProject()}
                  className="w-full bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-bright focus:outline-none focus:border-brand-blue/60"
                  placeholder="My awesome project" autoFocus />
              </div>
              <div>
                <label className="text-xs text-ink-mid block mb-1.5">Description (optional)</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
                  className="w-full bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-bright focus:outline-none focus:border-brand-blue/60 resize-none"
                  placeholder="What is this project about?" />
              </div>
              <div>
                <label className="text-xs text-ink-mid block mb-2">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className={cn("w-6 h-6 rounded-full transition-transform", color === c && "scale-125 ring-2 ring-white/30")}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 text-xs py-2 rounded-lg border border-bg-border text-ink-mid hover:bg-bg-hover">Cancel</button>
              <button onClick={createProject} disabled={!name.trim() || creating}
                className="flex-1 text-xs py-2 rounded-lg bg-brand-blue text-white disabled:opacity-50 flex items-center justify-center gap-1.5">
                {creating && <Loader2 size={11} className="animate-spin" />}Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
