"use client";
import { Users, Mail, Shield, Crown, User } from "lucide-react";

const MEMBERS = [
  { name:"Alex Chen",   email:"demo@projectflow.com", role:"OWNER",  avatar:"Alex",  tasks:8,  joined:"Jan 2025" },
  { name:"Sarah Kim",   email:"sarah@example.com",    role:"ADMIN",  avatar:"Sarah", tasks:5,  joined:"Feb 2025" },
  { name:"Mike Torres", email:"mike@example.com",     role:"MEMBER", avatar:"Mike",  tasks:3,  joined:"Mar 2025" },
  { name:"Priya Patel", email:"priya@example.com",    role:"MEMBER", avatar:"Priya", tasks:6,  joined:"Mar 2025" },
];

const ROLE_ICON: Record<string, React.ReactNode> = {
  OWNER: <Crown size={11} className="text-yellow-400" />,
  ADMIN: <Shield size={11} className="text-brand-blue" />,
  MEMBER: <User size={11} className="text-ink-muted" />,
};

export default function TeamPage() {
  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink-bright">Team</h2>
          <p className="text-sm text-ink-mid mt-0.5">{MEMBERS.length} members</p>
        </div>
        <button className="flex items-center gap-1.5 bg-brand-blue text-white text-xs px-3 py-2 rounded-lg hover:bg-brand-blue/90">
          <Mail size={13} />Invite member
        </button>
      </div>

      <div className="bg-bg-panel border border-bg-border rounded-xl overflow-hidden">
        <div className="divide-y divide-bg-border">
          {MEMBERS.map(m => (
            <div key={m.email} className="flex items-center gap-4 px-4 py-3.5 hover:bg-bg-hover transition-colors">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.avatar}`}
                className="w-8 h-8 rounded-full bg-bg-card flex-shrink-0" alt={m.name} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink-bright">{m.name}</div>
                <div className="text-xs text-ink-muted">{m.email}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink-mid bg-bg-card px-2.5 py-1 rounded-lg">
                {ROLE_ICON[m.role]}{m.role}
              </div>
              <div className="text-right">
                <div className="text-xs text-ink-bright font-medium">{m.tasks} tasks</div>
                <div className="text-[10px] text-ink-muted">Joined {m.joined}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-panel border border-bg-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-ink-muted" />
          <span className="text-sm font-medium text-ink-bright">Invite by email</span>
        </div>
        <div className="flex gap-2">
          <input placeholder="colleague@company.com"
            className="flex-1 bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-xs text-ink-bright placeholder:text-ink-muted focus:outline-none focus:border-brand-blue/50" />
          <select className="bg-bg-card border border-bg-border rounded-lg px-2 py-2 text-xs text-ink-mid focus:outline-none">
            <option>MEMBER</option><option>ADMIN</option><option>VIEWER</option>
          </select>
          <button className="bg-brand-blue text-white text-xs px-3 py-2 rounded-lg hover:bg-brand-blue/90">Send invite</button>
        </div>
      </div>
    </div>
  );
}
