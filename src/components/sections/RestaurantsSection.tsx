"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Clock, Bike, ArrowRight, BadgeCheck } from "lucide-react";
import { FEATURED_RESTAURANTS } from "@/lib/constants";
import { formatCurrency, formatDeliveryTime } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

const restaurantEmojis: Record<string, string> = {
  "1": "🍔",
  "2": "🥗",
  "3": "🍕",
  "4": "🍣",
};

const restaurantBgGradients: Record<string, string> = {
  "1": "linear-gradient(135deg,#1a1208,#2d1f0e)",
  "2": "linear-gradient(135deg,#0d1a12,#162a1c)",
  "3": "linear-gradient(135deg,#1a0d0d,#2d1414)",
  "4": "linear-gradient(135deg,#0d1428,#141e3d)",
};

export function RestaurantsSection() {
  const [ref, inView] = useInView({ threshold: 0.1, once: true });

  return (
    <section
      id="restaurants"
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, #0D0F14 0%, rgba(17,24,39,0.5) 50%, #0D0F14 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto" ref={ref as React.RefObject<HTMLDivElement>}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-label mb-5"
            >
              🔥 Top rated near you
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-display text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-1.5px]"
            >
              Popular{" "}
              <span className="text-[#FF6B00]">Restaurants</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[16px] text-[#9CA3AF] leading-relaxed mt-3 max-w-md"
            >
              Handpicked favourites with lightning-fast delivery times and top
              ratings.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/restaurants"
              className="flex items-center gap-2 text-sm font-semibold text-[#FF6B00] hover:gap-3 transition-all duration-200 group"
            >
              View all restaurants
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_RESTAURANTS.map((restaurant, i) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
            >
              <Link href={`/restaurants/${restaurant.id}`} className="block">
                <div className="bg-[#1A2035] border border-white/[0.08] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:border-white/[0.12] group">
                  {/* Image area */}
                  <div
                    className="h-[170px] relative overflow-hidden flex items-center justify-center"
                    style={{ background: restaurantBgGradients[restaurant.id] }}
                  >
                    <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
                      {restaurantEmojis[restaurant.id]}
                    </span>
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 text-xs font-semibold text-white border border-white/[0.08]">
                      {restaurant.category}
                    </div>
                    {/* Promo badge */}
                    {restaurant.promo_label && (
                      <div className="absolute top-3 right-3 bg-[#FF6B00] rounded-lg px-2.5 py-1 text-xs font-bold text-white">
                        {restaurant.promo_label}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2.5">
                      <div>
                        <h3 className="font-display text-[16px] font-bold text-white leading-tight">
                          {restaurant.name}
                        </h3>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {restaurant.cuisine_type}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg px-2 py-1 flex-shrink-0">
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="text-xs font-bold text-[#F59E0B]">
                          {restaurant.rating}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDeliveryTime(
                          restaurant.delivery_time_min,
                          restaurant.delivery_time_max
                        )}
                      </div>
                      <span className="w-1 h-1 rounded-full bg-[#6B7280]" />
                      <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                        <Bike className="w-3.5 h-3.5" />
                        {restaurant.delivery_fee === 0
                          ? "Free delivery"
                          : `${formatCurrency(restaurant.delivery_fee)} delivery`}
                      </div>
                      <span className="w-1 h-1 rounded-full bg-[#6B7280]" />
                      <span className="text-xs font-semibold text-[#22C55E] flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
