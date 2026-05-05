"use client";
import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Chen");
  const [email] = useState("demo@projectflow.com");
  const [orgName, setOrgName] = useState("ProjectFlow HQ");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-bright">Settings</h2>
        <p className="text-sm text-ink-mid mt-0.5">Manage your account and workspace</p>
      </div>

      <div className="bg-bg-panel border border-bg-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-medium text-ink-bright border-b border-bg-border pb-3">Profile</h3>
        <div className="flex items-center gap-4">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-14 h-14 rounded-full bg-bg-card" alt="avatar" />
          <button className="text-xs text-brand-blue hover:underline">Change avatar</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-ink-mid block mb-1.5">Full name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-bright focus:outline-none focus:border-brand-blue/60" />
          </div>
          <div>
            <label className="text-xs text-ink-mid block mb-1.5">Email</label>
            <input value={email} disabled className="w-full bg-bg-hover border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-muted cursor-not-allowed" />
          </div>
        </div>
      </div>

      <div className="bg-bg-panel border border-bg-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-medium text-ink-bright border-b border-bg-border pb-3">Workspace</h3>
        <div>
          <label className="text-xs text-ink-mid block mb-1.5">Organization name</label>
          <input value={orgName} onChange={e => setOrgName(e.target.value)}
            className="w-full bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-bright focus:outline-none focus:border-brand-blue/60" />
        </div>
      </div>

      <button className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        <Save size={14} />Save changes
      </button>
    </div>
  );
}
