"use client";

import { useState } from "react";
import { Plus, ImageOff } from "lucide-react";
import type { MenuItem } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  item: MenuItem;
  onOrder: (item: MenuItem) => void;
}

const BG_GRADIENTS = [
  "from-amber-950 to-orange-950",
  "from-red-950 to-rose-950",
  "from-orange-950 to-yellow-950",
  "from-green-950 to-emerald-950",
  "from-blue-950 to-indigo-950",
  "from-pink-950 to-purple-950",
  "from-cyan-950 to-teal-950",
  "from-violet-950 to-purple-950",
];

function gradientForId(id: string): string {
  const n = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return BG_GRADIENTS[n % BG_GRADIENTS.length];
}

export function FoodCard({ item, onOrder }: Props) {
  const [imgError, setImgError] = useState(false);
  const gradient = gradientForId(item.id);

  return (
    <div
      className={cn(
        "group relative bg-[#111827] border border-white/[0.07] rounded-2xl overflow-hidden",
        "hover:border-[#FF6B00]/30 hover:-translate-y-1",
        "hover:shadow-[0_24px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,107,0,0.08)]",
        "transition-all duration-300 cursor-pointer flex flex-col"
      )}
      onClick={() => onOrder(item)}
    >
      {/* Image hero */}
      <div className={cn("relative h-44 overflow-hidden bg-gradient-to-br", gradient)}>
        {item.image_url && !imgError ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40">
            <ImageOff className="w-8 h-8 text-white" />
            <span className="text-xs text-white">No image</span>
          </div>
        )}

        {/* Gradient scrim so text is readable if ever overlaid */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Hover orange tint */}
        <div className="absolute inset-0 bg-[#FF6B00]/0 group-hover:bg-[#FF6B00]/10 transition-colors duration-300" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <h3 className="font-display text-[15px] font-bold text-white leading-snug mb-1.5 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/[0.06]">
          <p className="font-display text-lg font-extrabold text-white leading-none">
            ETB {item.price.toLocaleString()}
          </p>

          <button
            onClick={(e) => { e.stopPropagation(); onOrder(item); }}
            className="w-9 h-9 rounded-xl bg-[#FF6B00] hover:bg-[#FF8C33] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-[0_4px_12px_rgba(255,107,0,0.35)] active:scale-95"
            aria-label={`Order ${item.name}`}
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
