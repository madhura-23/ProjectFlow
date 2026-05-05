"use client";
import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

const BAR_COLORS = ["#3a7bff","#9b5de5","#00d4aa","#f7c948","#ff6b6b","#06b6d4"];

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks").then(r => r.json()).then(setTasks).finally(() => setLoading(false));
  }, []);

  const total     = tasks.length;
  const done      = tasks.filter(t => t.status === "DONE").length;
  const inProgress= tasks.filter(t => t.status === "IN_PROGRESS").length;
  const overdue   = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE").length;
  const completion= total ? Math.round(done / total * 100) : 0;

  const byStatus = [
    { label:"Todo",        value: tasks.filter(t=>t.status==="TODO").length,        color:"#4a4a7a" },
    { label:"In Progress", value: tasks.filter(t=>t.status==="IN_PROGRESS").length, color:"#3a7bff" },
    { label:"In Review",   value: tasks.filter(t=>t.status==="IN_REVIEW").length,   color:"#f7c948" },
    { label:"Done",        value: tasks.filter(t=>t.status==="DONE").length,        color:"#00d4aa" },
  ];
  const byPriority = [
    { label:"Urgent", value: tasks.filter(t=>t.priority==="URGENT").length, color:"#ff6b6b" },
    { label:"High",   value: tasks.filter(t=>t.priority==="HIGH").length,   color:"#f7c948" },
    { label:"Medium", value: tasks.filter(t=>t.priority==="MEDIUM").length, color:"#3a7bff" },
    { label:"Low",    value: tasks.filter(t=>t.priority==="LOW").length,    color:"#4a4a7a" },
  ];

  const maxStatus   = Math.max(...byStatus.map(x=>x.value), 1);
  const maxPriority = Math.max(...byPriority.map(x=>x.value), 1);

  const weekStats = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({
    day: d, completed: [2,1,3,2,4,1,0][i], created: [3,2,4,3,5,2,1][i],
  }));
  const maxWeek = Math.max(...weekStats.map(w => Math.max(w.completed, w.created)), 1);

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-ink-bright">Analytics</h2>
        <p className="text-sm text-ink-mid mt-0.5">Project performance overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Tasks",    value: total,      icon: TrendingUp,   color:"text-brand-blue",   bg:"bg-brand-blue/10" },
          { label:"Completed",      value: done,       icon: CheckCircle2, color:"text-brand-teal",   bg:"bg-brand-teal/10" },
          { label:"Completion %",   value: completion+"%", icon: TrendingUp, color:"text-brand-violet", bg:"bg-brand-violet/10" },
          { label:"Overdue",        value: overdue,    icon: AlertCircle,  color:"text-red-400",       bg:"bg-red-400/10" },
        ].map(k => (
          <div key={k.label} className="bg-bg-panel border border-bg-border rounded-xl p-4">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", k.bg)}>
              <k.icon size={15} className={k.color} />
            </div>
            <div className="text-2xl font-semibold text-ink-bright">{loading ? "—" : k.value}</div>
            <div className="text-xs text-ink-mid mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status chart */}
        <div className="bg-bg-panel border border-bg-border rounded-xl p-5">
          <h3 className="text-sm font-medium text-ink-bright mb-4">Tasks by status</h3>
          <div className="space-y-3">
            {byStatus.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-ink-mid">{s.label}</span>
                  <span className="text-xs text-ink-bright font-medium">{s.value}</span>
                </div>
                <div className="h-2 bg-bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(s.value/maxStatus)*100}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority chart */}
        <div className="bg-bg-panel border border-bg-border rounded-xl p-5">
          <h3 className="text-sm font-medium text-ink-bright mb-4">Tasks by priority</h3>
          <div className="space-y-3">
            {byPriority.map(p => (
              <div key={p.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-ink-mid">{p.label}</span>
                  <span className="text-xs text-ink-bright font-medium">{p.value}</span>
                </div>
                <div className="h-2 bg-bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(p.value/maxPriority)*100}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly activity */}
      <div className="bg-bg-panel border border-bg-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-ink-bright">Weekly activity</h3>
          <div className="flex items-center gap-4 text-[10px] text-ink-muted">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-brand-blue inline-block" />Created</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-brand-teal inline-block" />Completed</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-28">
          {weekStats.map((w, i) => (
            <div key={w.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: "80px" }}>
                <div className="flex-1 rounded-sm transition-all duration-500"
                  style={{ height: `${(w.created/maxWeek)*80}px`, background: BAR_COLORS[0] + "aa" }} />
                <div className="flex-1 rounded-sm transition-all duration-500"
                  style={{ height: `${(w.completed/maxWeek)*80}px`, background: "#00d4aa99" }} />
              </div>
              <span className="text-[9px] text-ink-muted">{w.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Completion ring */}
      <div className="bg-bg-panel border border-bg-border rounded-xl p-5 flex items-center gap-8">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1c1c32" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3a7bff" strokeWidth="3"
              strokeDasharray={`${completion} ${100-completion}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-ink-bright">{completion}%</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-ink-bright mb-1">Overall completion</div>
          <div className="text-xs text-ink-muted">{done} of {total} tasks completed</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-brand-teal">
            <Clock size={11} />
            <span>{inProgress} tasks in progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}
