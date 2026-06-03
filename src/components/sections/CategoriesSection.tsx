"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";
import { ArrowRight } from "lucide-react";

export function CategoriesSection() {
  const [ref, inView] = useInView({ threshold: 0.15, once: true });

  return (
    <section id="categories" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" ref={ref as React.RefObject<HTMLDivElement>}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-label mb-5"
            >
              ✦ Browse by category
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-display text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-1.5px]"
            >
              Everything you need,
              <br />
              <span className="text-[#FF6B00]">one tap away.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[16px] text-[#9CA3AF] leading-relaxed max-w-sm"
          >
            From hot meals to emergency pharmacy runs — SwiftDrop covers every
            category of your daily life.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
            >
              <Link href={cat.href} className="block group">
                <div className="relative bg-[#1A2035] border border-white/[0.08] rounded-2xl p-6 text-center overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF6B00]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,107,0,0.1)]">
                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] to-[#FF8C33] opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 rounded-2xl" />

                  <span className="text-4xl mb-4 block relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {cat.emoji}
                  </span>
                  <p className="text-sm font-semibold text-white relative z-10 mb-1">
                    {cat.name}
                  </p>
                  <p className="text-xs text-[#6B7280] relative z-10">
                    {cat.count}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
