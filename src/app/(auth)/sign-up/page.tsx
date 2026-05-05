"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import { Zap, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await signUp(email, password, name);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="font-semibold text-ink-bright">ProjectFlow</span>
        </div>

        <div className="bg-bg-panel border border-bg-border rounded-2xl p-6">
          <h1 className="text-lg font-semibold text-ink-bright mb-1">Create account</h1>
          <p className="text-sm text-ink-mid mb-6">Start managing projects today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-ink-mid block mb-1.5">Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-bright focus:outline-none focus:border-brand-blue/60 transition-colors"
                placeholder="Alex Chen" required />
            </div>
            <div>
              <label className="text-xs text-ink-mid block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-bright focus:outline-none focus:border-brand-blue/60 transition-colors"
                placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-xs text-ink-mid block mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-bright focus:outline-none focus:border-brand-blue/60 transition-colors"
                placeholder="Min 8 characters" required minLength={8} />
            </div>

            {error && <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Create account
            </button>
          </form>

          <p className="text-xs text-ink-muted text-center mt-4">
            Have an account?{" "}
            <Link href="/sign-in" className="text-brand-blue hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
