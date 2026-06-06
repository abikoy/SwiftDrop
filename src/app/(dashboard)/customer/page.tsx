"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, RefreshCw, ShoppingBag, Clock,
  MapPin, CreditCard, Loader2, UtensilsCrossed, WifiOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

import { FoodCard } from "@/components/customer/FoodCard";
import { CheckoutModal } from "@/components/customer/CheckoutModal";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { MenuItem, Order } from "@/types";
import { FILTER_CATEGORIES } from "@/lib/categories";


export default function CustomerPage() {
  const [menuItems, setMenuItems]       = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading]   = useState(true);
  const [menuError, setMenuError]       = useState("");
const [search, setSearch]           = useState("");
const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orders, setOrders]             = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [successPulse, setSuccessPulse] = useState(false);

  const supabase = createClient();

  /* ── Fetch available menu items ── */
  const fetchMenu = useCallback(async () => {
    setMenuLoading(true);
    setMenuError("");
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("availability", true)
      .order("created_at", { ascending: true });
    if (error) setMenuError("Could not load menu. Please refresh.");
    else setMenuItems(data ?? []);
    setMenuLoading(false);
  }, [supabase]);

  /* ── Fetch customer's own orders ── */
  const fetchOrders = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setOrdersLoading(false); return; }
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setOrders(data ?? []);
    setOrdersLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchMenu();
    fetchOrders();

    const menuCh = supabase
      .channel("menu-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, fetchMenu)
      .subscribe();

    const ordersCh = supabase
      .channel("customer-orders-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(menuCh);
      supabase.removeChannel(ordersCh);
    };
  }, [fetchMenu, fetchOrders, supabase]);

  const filtered = menuItems.filter((item) => {
  const q = search.toLowerCase();
  const matchSearch = !q ||
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q);
  const matchCategory =
    activeCategory === "All" || item.category === activeCategory;
  return matchSearch && matchCategory;
});

  function handleOrderSuccess() {
    setSuccessPulse(true);
    fetchOrders();
    setTimeout(() => setSuccessPulse(false), 5000);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <>
      <div className="p-4 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-7">
          <div className="section-label mb-3">🍽️ Menu</div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            What are you craving?
          </h1>
          <p className="text-[#9CA3AF] mt-1.5 text-sm">
            Pick an item, fill your details, and we deliver fast.
          </p>
        </div>

        {/* Success banner */}
        {successPulse && (
          <div className="flex items-start gap-3.5 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-2xl p-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-white text-sm">Order placed successfully!</p>
              <p className="text-[#9CA3AF] text-xs mt-0.5">
                We'll call you within <strong className="text-white">5 minutes</strong> to confirm.
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food items..."
            className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-[#4B5563] outline-none focus:border-[#FF6B00]/50 transition-all"
          />
        </div>

</div>

{/* Category filter pills */}
<div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-1 px-1">
  {FILTER_CATEGORIES.map((cat) => (
    <button
      key={cat.value}
      onClick={() => setActiveCategory(cat.value)}
      className={cn(
        "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border flex-shrink-0",
        activeCategory === cat.value
          ? "bg-[#FF6B00]/15 border-[#FF6B00]/35 text-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.15)]"
          : "bg-white/[0.03] border-white/[0.07] text-[#9CA3AF] hover:text-white hover:bg-white/[0.06]"
      )}
    >
      {cat.label}
    </button>
  ))}
</div>

{/* Menu grid */}

        {/* Menu grid */}
        {menuLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
            <p className="text-sm text-[#6B7280]">Loading menu...</p>
          </div>
        ) : menuError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <WifiOff className="w-10 h-10 text-red-400" />
            <div>
              <p className="text-white font-semibold mb-1">Failed to load menu</p>
              <p className="text-[#6B7280] text-sm mb-4">{menuError}</p>
              <button onClick={fetchMenu} className="btn-orange px-5 py-2.5 text-sm flex items-center gap-2 mx-auto">
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UtensilsCrossed className="w-12 h-12 text-[#6B7280] mb-4" />
            {menuItems.length === 0 ? (
              <>
                <p className="text-white font-semibold mb-1">Menu coming soon</p>
                <p className="text-[#6B7280] text-sm">The admin hasn't added any items yet.</p>
              </>
            ) : (
              <>
                <p className="text-white font-semibold mb-1">No items match your search</p>
                <p className="text-[#6B7280] text-sm">Try a different keyword.</p>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-[#6B7280] mb-4">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
              {filtered.map((item) => (
                <FoodCard key={item.id} item={item} onOrder={setSelectedItem} />
              ))}
            </div>
          </>
        )}

        {/* Order History */}
        <div className="border-t border-white/[0.06] pt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-white">My Orders</h2>
            <button onClick={fetchOrders}
              className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">No orders yet</p>
              <p className="text-[#6B7280] text-sm">Your order history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="glass-card rounded-2xl p-4 md:p-5">
                  <div className="flex items-start gap-4 flex-wrap">
                    {/* Item thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A2035] border border-white/[0.08] flex-shrink-0">
                      {order.item_image_url ? (
                        <img src={order.item_image_url} alt={order.item_name ?? ""}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <StatusBadge status={order.order_status} />
                        <span className="text-xs text-[#6B7280] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {fmtDate(order.created_at)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">
                        {order.food_items_description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280] flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {order.delivery_address}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" /> {order.payment_method}
                        </span>
                        {order.total_estimated_price != null && (
                          <span className="text-[#FF6B00] font-bold">
                            ETB {order.total_estimated_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {/* Receipt badge */}
                      {order.payment_method === "Mobile Money" && order.receipt_url && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-[11px] bg-[#16A34A]/10 border border-[#16A34A]/25 text-[#22C55E] rounded-full px-2.5 py-1 font-medium">
                            ✓ Receipt uploaded
                          </span>
                        </div>
                      )}
                      {order.payment_method === "Mobile Money" && !order.receipt_url && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-[11px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full px-2.5 py-1 font-medium">
                            ⚠ No receipt attached
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      

      {/* Checkout modal */}
      <CheckoutModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSuccess={handleOrderSuccess}
      />
    </>
  );
}
