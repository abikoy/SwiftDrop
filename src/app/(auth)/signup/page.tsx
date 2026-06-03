"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const full_name = `${fd.get("first_name")} ${fd.get("last_name")}`.trim();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: "customer" } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/login"), 3000);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-[#16A34A]/20 border border-[#16A34A]/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white mb-2">Account created!</h2>
          <p className="text-[#9CA3AF] text-sm">Check your email to confirm your account. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center px-4 relative overflow-hidden py-12">
      <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#16A34A]/6 blur-[120px] pointer-events-none" />
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
          <h1 className="font-display text-3xl font-extrabold text-white mb-2">Create your account</h1>
          <p className="text-[#9CA3AF] text-sm">Join thousands of happy SwiftDrop customers</p>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-5 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">First name</label>
                <input name="first_name" type="text" required placeholder="John"
                  className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Last name</label>
                <input name="last_name" type="text" required placeholder="Doe"
                  className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Email address</label>
              <input name="email" type="email" required placeholder="you@example.com"
                className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? "text" : "password"} required placeholder="Min. 8 characters"
                  className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="accent-[#FF6B00] mt-0.5" />
              <span className="text-sm text-[#9CA3AF]">
                I agree to the{" "}
                <Link href="/terms" className="text-[#FF6B00] hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#FF6B00] hover:underline">Privacy Policy</Link>
              </span>
            </label>
            <button type="submit" disabled={loading}
              className="btn-orange w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account →"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-[#6B7280] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF6B00] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
