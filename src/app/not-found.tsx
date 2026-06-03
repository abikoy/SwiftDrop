import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF6B00]/6 blur-[120px] pointer-events-none" />
      <div className="relative z-10 text-center">
        <div className="font-display text-[120px] font-extrabold text-white/[0.06] leading-none mb-4 select-none">
          404
        </div>
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF3D00] rounded-[12px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-display text-2xl font-extrabold text-white">
            Swift<span className="text-[#FF6B00]">Drop</span>
          </span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white mb-3">
          Page not found
        </h1>
        <p className="text-[#9CA3AF] mb-8 max-w-sm mx-auto">
          This page doesn&apos;t exist or was moved. Let&apos;s get you back on track.
        </p>
        <Link href="/">
          <button className="btn-orange px-8 py-3.5 text-base">
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
