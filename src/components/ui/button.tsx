import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#FF6B00] to-[#FF8C33] text-white shadow-[0_4px_15px_rgba(255,107,0,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,107,0,0.4)]",
        ghost:
          "bg-transparent border border-white/[0.08] text-[#9CA3AF] hover:border-[#FF6B00]/40 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10",
        green:
          "bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white shadow-[0_4px_15px_rgba(22,163,74,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(22,163,74,0.4)]",
        outline:
          "border border-white/[0.08] bg-transparent text-white hover:bg-white/[0.05]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        link: "text-[#FF6B00] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
