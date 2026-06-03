"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    const supabase = createClient();
    const { error: authError, data } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // fetch role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    router.push(profile?.role === "admin" ? "/admin" : "/customer");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#FF6B00]/8 blur-[120px] pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF3D00] rounded-[12px] flex items-center justify-center shadow-[0_0_24px_rgba(255,107,0,0.3)]">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display text-2xl font-extrabold text-white">
              Swift<span className="text-[#FF6B00]">Drop</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-white mb-2">Welcome back</h1>
          <p className="text-[#9CA3AF] text-sm">Sign in to your SwiftDrop account</p>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-5 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Email address</label>
              <input name="email" type="email" required placeholder="you@example.com"
                className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 focus:shadow-[0_0_0_4px_rgba(255,107,0,0.1)] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? "text" : "password"} required placeholder="••••••••"
                  className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 focus:shadow-[0_0_0_4px_rgba(255,107,0,0.1)] transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-orange w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In →"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-[#6B7280] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#FF6B00] font-semibold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}
