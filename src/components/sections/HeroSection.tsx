"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Bike, Sparkles, ArrowRight, TrendingUp, Star, Clock } from "lucide-react";
import { STATS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
      {/* Ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/10 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-[#16A34A]/7 blur-[100px]" style={{ animationDelay: "2s", animation: "pulse 8s ease-in-out infinite alternate" }} />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Content ── */}
          <div>
            {/* Live badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex items-center gap-2 bg-[#FF6B00]/10 border border-[#FF6B00]/25 rounded-full px-4 py-2 mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-[blink_2s_ease-in-out_infinite]" />
              <span className="text-[13px] font-semibold text-[#FF6B00]">
                Now delivering in 30+ cities
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.1}
              className="font-display text-[clamp(44px,6vw,76px)] font-extrabold leading-[1.04] tracking-[-2.5px] mb-5"
            >
              Delivered to
              <br />
              <span
                className="bg-gradient-to-r from-[#FF6B00] to-[#FFB347] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                your doorstep.
              </span>
              <br />
              <span className="text-white">Fast.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.2}
              className="text-[17px] text-[#9CA3AF] leading-relaxed max-w-[460px] mb-9"
            >
              Fast delivery for anything you need — food, groceries, medicine,
              and more. Order in seconds, delivered in minutes.
            </motion.p>

            {/* Search bar */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.3}
              className="flex items-center gap-3 bg-[#1A2035] border border-white/[0.08] rounded-[14px] p-1.5 pl-5 mb-5 max-w-[500px] focus-within:border-[#FF6B00]/50 focus-within:shadow-[0_0_0_4px_rgba(255,107,0,0.1)] transition-all duration-200"
            >
              <Search className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter your delivery address..."
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-white placeholder:text-[#6B7280] font-sans"
              />
              <button className="btn-orange text-sm px-5 py-2.5 rounded-[10px] whitespace-nowrap">
                Find Stores →
              </button>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.4}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link href="/customer">
                <button className="btn-orange flex items-center gap-2 text-[15px] px-6 py-3.5">
                  <Bike className="w-4 h-4" />
                  Order Now
                </button>
              </Link>
              <Link href="/customer">
                <button className="btn-ghost flex items-center gap-2 text-[15px] px-6 py-3.5">
                  <Sparkles className="w-4 h-4" />
                  Browse Menu
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.5}
              className="flex flex-wrap gap-8"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-[26px] font-extrabold text-white leading-none">
                    {stat.num.includes("+") ? (
                      <>
                        {stat.num.replace("+", "")}
                        <span className="text-[#FF6B00]">+</span>
                      </>
                    ) : stat.num.includes("min") ? (
                      <>
                        {stat.num.replace(" min", "")}
                        <span className="text-[#FF6B00] text-lg"> min</span>
                      </>
                    ) : (
                      stat.num
                    )}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:flex items-center justify-center min-h-[540px]"
          >
            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 left-0 glass-card p-4 rounded-2xl z-10 min-w-[160px]"
            >
              <p className="text-[10px] text-[#6B7280] uppercase tracking-widest mb-1.5">Today's orders</p>
              <p className="font-display text-2xl font-bold text-white">1,284</p>
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp className="w-3 h-3 text-[#22C55E]" />
                <span className="text-xs text-[#22C55E] font-medium">+12% from yesterday</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 right-0 glass-card p-4 rounded-2xl z-10"
            >
              <p className="text-[10px] text-[#6B7280] uppercase tracking-widest mb-1.5">Rating</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <span className="font-display text-lg font-bold text-white">4.9</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/2 -left-8 glass-card p-3.5 rounded-2xl z-10"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF3D00] flex items-center justify-center flex-shrink-0">
                  <Bike className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white">On the way!</p>
                  <p className="text-[11px] text-[#22C55E] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> ETA 12 min
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Phone mockup */}
            <div className="w-[230px] bg-gradient-to-b from-[#1E2433] to-[#131825] border border-white/10 rounded-[36px] p-4 shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] relative z-0">
              {/* Notch */}
              <div className="w-20 h-6 bg-[#0D0F14] rounded-xl mx-auto mb-4 flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#2A2F3D]" />
              </div>
              <div className="bg-gradient-to-b from-[#1A2035] to-[#111827] rounded-2xl p-3 overflow-hidden">
                {/* App header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm font-extrabold text-[#FF6B00]">SwiftDrop</span>
                  <span className="text-lg">🔔</span>
                </div>
                {/* Map */}
                <div className="relative bg-gradient-to-br from-[#1E2433] to-[#252D42] rounded-xl h-[100px] mb-3 flex items-center justify-center overflow-hidden">
                  <div className="w-6 h-6 bg-[#FF6B00] rounded-[50%_50%_50%_0] rotate-[-45deg] shadow-[0_0_20px_rgba(255,107,0,0.5)] animate-[pin-bounce_2s_ease-in-out_infinite]"
                    style={{ animation: "float 2s ease-in-out infinite" }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                    <p className="text-[9px] text-[#6B7280]">Delivering to</p>
                    <p className="text-[10px] font-semibold text-white">123 Main Street, Apt 4B</p>
                  </div>
                </div>
                {/* Items */}
                <div className="flex flex-col gap-2">
                  {[
                    { icon: "🍔", name: "Burger Palace", sub: "⭐ 4.8 · 20 min", price: "$12.99", bg: "rgba(255,107,0,0.15)" },
                    { icon: "🥗", name: "Salad & Co", sub: "⭐ 4.9 · 15 min", price: "$9.49", bg: "rgba(22,163,74,0.15)" },
                    { icon: "🍕", name: "Pizza Lab", sub: "⭐ 4.7 · 25 min", price: "$15.00", bg: "rgba(99,102,241,0.15)" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2.5 p-2 rounded-xl border border-white/[0.06]"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                        style={{ background: item.bg }}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-white truncate">{item.name}</p>
                        <p className="text-[9px] text-[#6B7280] mt-0.5">{item.sub}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#FF6B00] flex-shrink-0">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
