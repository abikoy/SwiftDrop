"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface Props {
  role: UserRole;
  fullName: string;
  email: string;
}

const customerLinks = [
  { href: "/customer", label: "Place an Order", icon: ShoppingBag },
];

const adminLinks = [
  { href: "/admin", label: "All Orders", icon: LayoutDashboard },
];

export function DashboardSidebar({ role, fullName, email }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const links = role === "admin" ? adminLinks : customerLinks;

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B00] to-[#FF3D00] rounded-[10px] flex items-center justify-center shadow-[0_0_16px_rgba(255,107,0,0.3)]">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-display text-lg font-extrabold text-white">
            Swift<span className="text-[#FF6B00]">Drop</span>
          </span>
        </Link>
      </div>

      {/* Role pill */}
      <div className="px-4 pt-5 pb-2">
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
          role === "admin"
            ? "bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/25"
            : "bg-[#16A34A]/15 text-[#22C55E] border border-[#16A34A]/25"
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {role === "admin" ? "Admin Panel" : "Customer"}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/20"
                  : "text-[#9CA3AF] hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5", active ? "text-[#FF6B00]" : "text-[#6B7280] group-hover:text-white")} />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#FF6B00]" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + sign out */}
      <div className="p-4 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{fullName}</p>
            <p className="text-[11px] text-[#6B7280] truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] flex-shrink-0 bg-[#111827] border-r border-white/[0.06] min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#111827]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#FF6B00] to-[#FF3D00] rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display text-base font-extrabold text-white">
            Swift<span className="text-[#FF6B00]">Drop</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-[#9CA3AF] hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[260px] bg-[#111827] border-r border-white/[0.06] flex flex-col">
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-[#9CA3AF]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
