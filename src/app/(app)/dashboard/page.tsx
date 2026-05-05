import { LayoutDashboard, TrendingUp, Clock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn, STATUS_COLORS, formatDate } from "@/lib/utils";
import Link from "next/link";

const stats = [
  { label: "Total Tasks", value: 24, change: "+3 this week",  icon: LayoutDashboard, color: "text-brand-blue",   bg: "bg-brand-blue/10" },
  { label: "In Progress", value: 8,  change: "2 due today",   icon: TrendingUp,      color: "text-brand-violet", bg: "bg-brand-violet/10" },
  { label: "Completed",   value: 13, change: "+5 this week",  icon: CheckCircle2,    color: "text-brand-teal",   bg: "bg-brand-teal/10" },
  { label: "Overdue",     value: 3,  change: "Needs attention",icon: AlertCircle,    color: "text-red-400",      bg: "bg-red-400/10" },
];
const tasks = [
  { id:"1", title:"Design new landing page", status:"IN_PROGRESS", priority:"HIGH",   project:"Website Redesign", due:"2025-05-08" },
  { id:"2", title:"Implement auth flow",      status:"TODO",        priority:"HIGH",   project:"Website Redesign", due:"2025-05-06" },
  { id:"3", title:"Build dashboard UI",       status:"TODO",        priority:"MEDIUM", project:"Website Redesign", due:"2025-05-10" },
  { id:"4", title:"Set up CI/CD pipeline",    status:"IN_REVIEW",   priority:"URGENT", project:"DevOps",           due:"2025-05-05" },
  { id:"5", title:"Write API documentation",  status:"TODO",        priority:"LOW",    project:"Website Redesign", due:"2025-05-12" },
];
const projects = [
  { id:"1", name:"Website Redesign", color:"#3a7bff", tasks:12, done:5, members:4 },
  { id:"2", name:"Mobile App",       color:"#9b5de5", tasks:8,  done:2, members:3 },
  { id:"3", name:"DevOps Setup",     color:"#00d4aa", tasks:6,  done:4, members:2 },
];
const activity = [
  { user:"Alex",  action:"completed", target:"Set up Next.js project",  time:"20m ago", avatar:"Alex"  },
  { user:"Sarah", action:"commented", target:"Design new landing page", time:"1h ago",  avatar:"Sarah" },
  { user:"Mike",  action:"created",   target:"Set up CI/CD pipeline",   time:"2h ago",  avatar:"Mike"  },
];

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string,string> = { TODO:"Todo", IN_PROGRESS:"In Progress", IN_REVIEW:"In Review", DONE:"Done" };
  return <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap", STATUS_COLORS[status])}>{labels[status]}</span>;
}
function PriorityDot({ priority }: { priority: string }) {
  const c: Record<string,string> = { URGENT:"bg-red-400", HIGH:"bg-yellow-400", MEDIUM:"bg-brand-blue", LOW:"bg-ink-muted" };
  return <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", c[priority])} />;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-lg font-semibold text-ink-bright">Good morning, Alex</h2>
        <p className="text-sm text-ink-mid mt-0.5">You have 3 overdue tasks. Let us clear the board.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-bg-panel border border-bg-border rounded-xl p-4 hover:border-brand-blue/30 transition-colors">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", s.bg)}>
              <s.icon size={15} className={s.color} />
            </div>
            <div className="text-2xl font-semibold text-ink-bright">{s.value}</div>
            <div className="text-xs text-ink-mid mt-0.5">{s.label}</div>
            <div className="text-[10px] text-ink-muted mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-bg-panel border border-bg-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border">
            <span className="text-sm font-medium text-ink-bright">My tasks</span>
            <Link href="/tasks" className="text-xs text-brand-blue flex items-center gap-1">View all <ArrowRight size={11} /></Link>
          </div>
          <div className="divide-y divide-bg-border">
            {tasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover transition-colors cursor-pointer group">
                <PriorityDot priority={t.priority} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-ink-bright truncate">{t.title}</div>
                  <div className="text-[10px] text-ink-muted mt-0.5">{t.project}</div>
                </div>
                <StatusBadge status={t.status} />
                <div className="flex items-center gap-1 text-[10px] text-ink-muted whitespace-nowrap">
                  <Clock size={10} />{formatDate(t.due)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-bg-panel border border-bg-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-bg-border"><span className="text-sm font-medium text-ink-bright">Activity</span></div>
          <div className="px-4 py-2 space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.avatar}`} className="w-6 h-6 rounded-full flex-shrink-0" alt={a.user} />
                <div>
                  <p className="text-xs text-ink-mid"><span className="text-ink-bright font-medium">{a.user}</span> {a.action} <span className="text-ink-bright">{a.target}</span></p>
                  <span className="text-[10px] text-ink-muted">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-bg-panel border border-bg-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border">
          <span className="text-sm font-medium text-ink-bright">Active projects</span>
          <Link href="/projects" className="text-xs text-brand-blue flex items-center gap-1">View all <ArrowRight size={11} /></Link>
        </div>
        <div className="divide-y divide-bg-border">
          {projects.map(p => {
            const pct = Math.round(p.done / p.tasks * 100);
            return (
              <div key={p.id} className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: p.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-ink-bright">{p.name}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 bg-bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct + "%", background: p.color }} />
                    </div>
                    <span className="text-[10px] text-ink-muted">{p.done}/{p.tasks}</span>
                  </div>
                </div>
                <div className="text-[10px] text-ink-muted text-right"><div>{pct}%</div><div>{p.members} members</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
