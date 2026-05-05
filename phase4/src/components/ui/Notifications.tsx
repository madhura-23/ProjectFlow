"use client";
import { useState } from "react";
import { Bell, X, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notif {
  id: string; title: string; body: string; time: string;
  read: boolean; type: "task"|"comment"|"mention";
}

const INIT: Notif[] = [
  { id:"1", title:"Task assigned", body:"Implement auth flow was assigned to you", time:"5m ago",  read:false, type:"task" },
  { id:"2", title:"New comment",   body:"Sarah commented on Design new landing page", time:"1h ago",  read:false, type:"comment" },
  { id:"3", title:"Mentioned",     body:"Mike mentioned you in Set up CI/CD pipeline", time:"2h ago",  read:false, type:"mention" },
  { id:"4", title:"Task completed",body:"Alex completed Set up Next.js project", time:"3h ago",  read:true,  type:"task" },
];

const TYPE_COLOR: Record<string,string> = {
  task:"bg-brand-blue", comment:"bg-brand-violet", mention:"bg-brand-teal",
};

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(INIT);
  const unread = notifs.filter(n => !n.read).length;

  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-hover transition-colors text-ink-mid hover:text-ink-bright">
        <Bell size={15} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand-blue text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 w-80 bg-bg-panel border border-bg-border rounded-2xl overflow-hidden z-50 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border">
              <span className="text-sm font-medium text-ink-bright">Notifications</span>
              {unread > 0 && (
                <button onClick={markAll} className="flex items-center gap-1 text-[10px] text-brand-blue hover:underline">
                  <CheckCheck size={11} />Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="py-8 text-center text-xs text-ink-muted">All caught up!</div>
              ) : notifs.map(n => (
                <div key={n.id} className={cn("flex gap-3 px-4 py-3 border-b border-bg-border group hover:bg-bg-hover transition-colors", !n.read && "bg-brand-blue/5")}>
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1.5", TYPE_COLOR[n.type])} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-ink-bright">{n.title}</div>
                    <div className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">{n.body}</div>
                    <div className="text-[10px] text-ink-muted mt-1">{n.time}</div>
                  </div>
                  <button onClick={() => dismiss(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-ink-bright transition-all flex-shrink-0">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
