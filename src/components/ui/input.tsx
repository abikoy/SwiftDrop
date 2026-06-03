import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-xl bg-[#1A2035] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-[#6B7280] transition-all duration-200",
          "focus:outline-none focus:border-[#FF6B00]/50 focus:shadow-[0_0_0_4px_rgba(255,107,0,0.1)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
