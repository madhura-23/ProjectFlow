"use client";
import { useState, useEffect } from "react";
import { Loader2, Filter } from "lucide-react";
import { cn, STATUS_COLORS, formatDate } from "@/lib/utils";
import TaskModal from "@/components/tasks/TaskModal";
import { PriorityDot } from "@/components/ui/Badge";
import type { Task } from "@/types";

type FilterStatus = "ALL" | Task["status"];
const STATUSES: FilterStatus[] = ["ALL","TODO","IN_PROGRESS","IN_REVIEW","DONE"];
const STATUS_LABELS: Record<string,string> = { ALL:"All", TODO:"Todo", IN_PROGRESS:"In Progress", IN_REVIEW:"In Review", DONE:"Done" };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try { const r = await fetch("/api/tasks"); setTasks(await r.json()); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filtered = filter === "ALL" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink-bright">My Tasks</h2>
          <p className="text-sm text-ink-mid mt-0.5">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-ink-muted" />
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("text-[10px] px-2.5 py-1 rounded-lg transition-colors",
                filter === s ? "bg-brand-blue/20 text-brand-blue" : "text-ink-muted hover:bg-bg-hover")}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 size={18} className="animate-spin text-ink-muted" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-sm text-ink-muted">No tasks found</div>
      ) : (
        <div className="bg-bg-panel border border-bg-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] text-[10px] text-ink-muted uppercase tracking-widest px-4 py-2.5 border-b border-bg-border">
            <span>Task</span><span>Status</span><span>Priority</span><span>Due</span><span>Assignee</span>
          </div>
          <div className="divide-y divide-bg-border">
            {filtered.map(t => (
              <div key={t.id} onClick={() => setSelectedTask(t.id)}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center px-4 py-3 hover:bg-bg-hover cursor-pointer group">
                <div className="flex items-center gap-2 min-w-0">
                  <PriorityDot priority={t.priority} />
                  <span className="text-xs font-medium text-ink-bright truncate group-hover:text-white">{t.title}</span>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full w-fit font-medium", STATUS_COLORS[t.status])}>
                  {STATUS_LABELS[t.status]}
                </span>
                <span className="text-[10px] text-ink-muted">{t.priority}</span>
                <span className="text-[10px] text-ink-muted">{t.dueDate ? formatDate(t.dueDate) : "—"}</span>
                <div>
                  {t.assignee ? (
                    <img src={t.assignee.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.assignee.name}`}
                      className="w-5 h-5 rounded-full" alt={t.assignee.name} />
                  ) : <span className="text-[10px] text-ink-muted">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <TaskModal taskId={selectedTask} onClose={() => setSelectedTask(null)} onUpdated={fetchTasks} />
    </div>
  );
}
