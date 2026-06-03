"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Bike } from "lucide-react";
import { CUSTOM_REQUEST_ITEMS } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";

export function RequestAnythingSection() {
  const [ref, inView] = useInView({ threshold: 0.1, once: true });

  return (
    <section
      id="request"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(17,24,39,0.95), rgba(26,32,53,0.95))",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF6B00]/6 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          ref={ref as React.RefObject<HTMLDivElement>}
        >
          {/* Left: content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-label mb-5"
            >
              ✨ Beyond food delivery
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-display text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-1.5px] mb-5"
            >
              Request{" "}
              <span className="text-[#FF6B00]">Anything.</span>
              <br />
              We&apos;ll deliver it.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[16px] text-[#9CA3AF] leading-relaxed"
            >
              Don&apos;t see what you need? No problem. SwiftDrop lets you make
              custom delivery requests — from birthday gifts to emergency
              electronics.
            </motion.p>

            {/* Request items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8">
              {CUSTOM_REQUEST_ITEMS.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.07 }}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 hover:bg-[#FF6B00]/[0.05] hover:border-[#FF6B00]/25 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer"
                >
                  <span className="text-2xl mb-2.5 block">{item.icon}</span>
                  <p className="text-sm font-semibold text-white mb-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-4 mt-9"
            >
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(22,163,74,0.4)]"
              >
                <Sparkles className="w-4 h-4" />
                Make a Custom Request
              </button>
              <span className="text-sm text-[#6B7280]">
                No minimums. No limits.
              </span>
            </motion.div>
          </div>

          {/* Right: orbital visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[340px] h-[340px]">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full border border-[#FF6B00]/15"
                style={{ animation: "spin 20s linear infinite" }}
              />
              {/* Inner ring */}
              <div
                className="absolute inset-[40px] rounded-full border border-dashed border-[#FF6B00]/10"
                style={{ animation: "spin 14s linear infinite reverse" }}
              />

              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-[90px] h-[90px] bg-gradient-to-br from-[#FF6B00] to-[#FF3D00] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,107,0,0.4)]">
                  <Bike className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Orbit items */}
              {[
                { emoji: "🛒", style: { top: "2%", left: "50%", transform: "translateX(-50%)" } },
                { emoji: "💊", style: { right: "0%", top: "50%", transform: "translateY(-50%)" } },
                { emoji: "🎁", style: { bottom: "2%", left: "50%", transform: "translateX(-50%)" } },
                { emoji: "💻", style: { left: "0%", top: "50%", transform: "translateY(-50%)" } },
              ].map(({ emoji, style }, i) => (
                <motion.div
                  key={emoji}
                  className="absolute w-12 h-12 bg-[#1A2035] border border-white/[0.08] rounded-xl flex items-center justify-center text-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20"
                  style={style}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
