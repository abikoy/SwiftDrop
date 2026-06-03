import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; classes: string; dot: string }
> = {
  Pending: {
    label: "Pending",
    classes: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
    dot: "bg-yellow-400",
  },
  Confirmed: {
    label: "Confirmed",
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/25",
    dot: "bg-blue-400",
  },
  "Out for Delivery": {
    label: "Out for Delivery",
    classes: "bg-[#FF6B00]/10 text-[#FF8C33] border-[#FF6B00]/25",
    dot: "bg-[#FF6B00] animate-pulse",
  },
  Delivered: {
    label: "Delivered",
    classes: "bg-[#16A34A]/10 text-[#22C55E] border-[#16A34A]/25",
    dot: "bg-[#22C55E]",
  },
  Cancelled: {
    label: "Cancelled",
    classes: "bg-red-500/10 text-red-400 border-red-500/25",
    dot: "bg-red-400",
  },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap",
        config.classes
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
