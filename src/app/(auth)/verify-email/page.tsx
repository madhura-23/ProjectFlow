"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmSignUp } from "@/lib/auth";
import { Zap, Loader2 } from "lucide-react";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await confirmSignUp(email, code);
      router.push("/sign-in?verified=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
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
          <h1 className="text-lg font-semibold text-ink-bright mb-1">Check your email</h1>
          <p className="text-sm text-ink-mid mb-6">Enter the 6-digit code sent to <span className="text-ink-bright">{email}</span></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={code} onChange={e => setCode(e.target.value)}
              className="w-full bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-sm text-ink-bright text-center tracking-widest focus:outline-none focus:border-brand-blue/60"
              placeholder="123456" maxLength={6} required />
            {error && <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Verify email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyForm /></Suspense>;
}
