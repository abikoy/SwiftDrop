import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#FF6B00] text-white",
        secondary:
          "border-transparent bg-white/[0.08] text-white",
        green:
          "border-transparent bg-[#16A34A]/20 text-[#22C55E] border-[#16A34A]/30",
        outline:
          "border-white/[0.15] text-[#9CA3AF]",
        orange:
          "bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
