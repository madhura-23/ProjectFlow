"use client";
import { useState, useEffect, use } from "react";
import { Loader2, LayoutGrid, List, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn, STATUS_COLORS, formatDate } from "@/lib/utils";
import KanbanBoard from "@/components/kanban/Board";
import TaskModal from "@/components/tasks/TaskModal";
import type { Project, Task } from "@/types";

type View = "kanban" | "list";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("kanban");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const [pr, tr] = await Promise.all([
        fetch(`/api/projects/${id}`).then(r => r.json()),
        fetch(`/api/tasks?projectId=${id}`).then(r => r.json()),
      ]);
      setProject(pr); setTasks(tr);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProject(); }, [id]);

  if (loading) return <div className="flex items-center justify-center h-60"><Loader2 size={20} className="animate-spin text-ink-muted" /></div>;
  if (!project) return <div className="text-ink-muted text-sm">Project not found</div>;

  const done = tasks.filter(t => t.status === "DONE").length;
  const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects" className="text-ink-muted hover:text-ink-bright transition-colors"><ArrowLeft size={16} /></Link>
        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: project.color }} />
        <div className="flex-1">
          <h2 className="text-base font-semibold text-ink-bright">{project.name}</h2>
          {project.description && <p className="text-xs text-ink-muted mt-0.5">{project.description}</p>}
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <span>{done}/{tasks.length} tasks</span>
          <div className="w-20 h-1.5 bg-bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: pct + "%", background: project.color }} />
          </div>
          <span>{pct}%</span>
        </div>
        {/* View toggle */}
        <div className="flex bg-bg-card border border-bg-border rounded-lg p-0.5">
          {([["kanban", LayoutGrid],["list", List]] as [View, React.ElementType][]).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)}
              className={cn("px-2.5 py-1.5 rounded-md transition-colors text-xs flex items-center gap-1.5",
                view === v ? "bg-bg-hover text-ink-bright" : "text-ink-muted hover:text-ink-mid")}>
              <Icon size={13} />{v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban */}
      {view === "kanban" && <div className="flex-1 overflow-hidden"><KanbanBoard projectId={id} /></div>}

      {/* List view */}
      {view === "list" && (
        <div className="bg-bg-panel border border-bg-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-[10px] text-ink-muted uppercase tracking-widest px-4 py-2.5 border-b border-bg-border">
            <span>Task</span><span>Status</span><span>Priority</span><span>Due date</span>
          </div>
          <div className="divide-y divide-bg-border">
            {tasks.map(t => (
              <div key={t.id} onClick={() => setSelectedTask(t.id)}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-3 hover:bg-bg-hover cursor-pointer group">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                    background: { URGENT:"#ff6b6b", HIGH:"#f7c948", MEDIUM:"#3a7bff", LOW:"#4a4a7a" }[t.priority]
                  }} />
                  <span className="text-xs font-medium text-ink-bright truncate group-hover:text-white">{t.title}</span>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full w-fit font-medium", STATUS_COLORS[t.status])}>
                  {{TODO:"Todo",IN_PROGRESS:"In Progress",IN_REVIEW:"In Review",DONE:"Done"}[t.status]}
                </span>
                <span className="text-[10px] text-ink-muted">{t.priority}</span>
                <span className="text-[10px] text-ink-muted">{t.dueDate ? formatDate(t.dueDate) : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <TaskModal taskId={selectedTask} onClose={() => setSelectedTask(null)} onUpdated={fetchProject} />
    </div>
  );
}
