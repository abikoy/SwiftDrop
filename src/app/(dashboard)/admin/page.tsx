"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock, Bike, CheckCircle2, XCircle, Phone, MapPin,
  Landmark, FileText, CreditCard, RefreshCw, Loader2,
  TrendingUp, Search, ChevronDown, AlertCircle, Bell,
  Filter, ShoppingBag, Users, UtensilsCrossed,
  Plus, Trash2, ToggleLeft, ToggleRight, ChefHat,
  Package, Save, Upload, ImageIcon, X, ExternalLink,
  Receipt, Eye, ImageOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile, deleteStorageFile } from "@/lib/storage";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { cn } from "@/lib/utils";
import { MENU_CATEGORIES } from "@/lib/categories";
import type { Order, OrderStatus, MenuItem } from "@/types";

/* ── Constants ───────────────────────────────────────────── */
const ALL_STATUSES: OrderStatus[] = [
  "Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled",
];

const STATUS_TRANSITIONS: Record<
  OrderStatus,
  { status: OrderStatus; label: string; icon: React.ElementType; cls: string }[]
> = {
  Pending: [
    { status: "Confirmed",        label: "Confirm",      icon: CheckCircle2, cls: "text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30" },
    { status: "Cancelled",        label: "Cancel",       icon: XCircle,      cls: "text-red-400 hover:bg-red-500/10 hover:border-red-500/30" },
  ],
  Confirmed: [
    { status: "Out for Delivery", label: "Dispatch",     icon: Bike,         cls: "text-[#FF8C33] hover:bg-[#FF6B00]/10 hover:border-[#FF6B00]/30" },
    { status: "Cancelled",        label: "Cancel",       icon: XCircle,      cls: "text-red-400 hover:bg-red-500/10 hover:border-red-500/30" },
  ],
  "Out for Delivery": [
    { status: "Delivered",        label: "Mark Delivered", icon: CheckCircle2, cls: "text-[#22C55E] hover:bg-[#16A34A]/10 hover:border-[#16A34A]/30" },
  ],
  Delivered: [],
  Cancelled: [],
};

const MAX_IMAGE_MB = 5;

/* ── Stat card ───────────────────────────────────────────── */
function Stat({ label, value, sub, icon: Icon, iconCls }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; iconCls: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", iconCls)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-display text-2xl font-extrabold text-white leading-none">{value}</p>
      <p className="text-xs text-[#9CA3AF] mt-1">{label}</p>
      {sub && <p className="text-[11px] text-[#6B7280] mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── Receipt lightbox ────────────────────────────────────── */
function ReceiptLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#FF6B00]" /> Payment Receipt
          </p>
          <div className="flex items-center gap-2">
            <a href={url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Open full size
            </a>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <img src={url} alt="Payment receipt"
          className="w-full rounded-2xl border border-white/10 shadow-2xl" />
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");

  /* Orders */
  const [orders, setOrders]             = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingId, setUpdatingId]     = useState<string | null>(null);
  const [orderError, setOrderError]     = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [newAlert, setNewAlert]         = useState(false);
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl]   = useState<string | null>(null);

  /* Menu */
  const [menuItems, setMenuItems]       = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading]   = useState(true);
  const [menuError, setMenuError]       = useState<string | null>(null);
  const [menuSaving, setMenuSaving]     = useState(false);
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [togglingId, setTogglingId]     = useState<string | null>(null);

  /* New item form */
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "Other",
  });
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError]       = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  /* ── Data fetchers ─────────────────────────────────────── */
  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []);
    setOrdersLoading(false);
  }, [supabase]);

  const fetchMenu = useCallback(async () => {
    setMenuLoading(true);
    const { data, error } = await supabase
      .from("menu_items").select("*").order("created_at", { ascending: true });
    if (error) setMenuError(error.message);
    else setMenuItems(data ?? []);
    setMenuLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchOrders();
    fetchMenu();

    const ordersCh = supabase.channel("admin-orders-rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => {
        fetchOrders();
        setNewAlert(true);
        setTimeout(() => setNewAlert(false), 6000);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, fetchOrders)
      .subscribe();

    const menuCh = supabase.channel("admin-menu-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, fetchMenu)
      .subscribe();

    return () => {
      supabase.removeChannel(ordersCh);
      supabase.removeChannel(menuCh);
    };
  }, [fetchOrders, fetchMenu, supabase]);

  /* ── Order actions ─────────────────────────────────────── */
  async function changeStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    setOrderError(null);
    const { error } = await supabase
      .from("orders").update({ order_status: status }).eq("id", orderId);
    if (error) setOrderError(error.message);
    setUpdatingId(null);
  }

  /* ── Image picker ──────────────────────────────────────── */
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setFormError(`Image must be under ${MAX_IMAGE_MB} MB.`);
      return;
    }
    setFormError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  /* ── Add menu item ─────────────────────────────────────── */
  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!newItem.name.trim())  return setFormError("Item name is required.");
    if (!newItem.price.trim()) return setFormError("Price is required.");
    if (!imageFile)            return setFormError("Please upload a food photo.");

    const price = parseFloat(newItem.price);
    if (isNaN(price) || price < 0) return setFormError("Enter a valid price.");

    setMenuSaving(true);
    try {
      /* 1. Upload image to Supabase Storage */
      const image_url = await uploadFile("menu-images", imageFile, "items");

      /* 2. Insert row */
      const { error } = await supabase.from("menu_items").insert({
        name:         newItem.name.trim(),
        description:  newItem.description.trim(),
        price,
        image_url,
        category:     newItem.category,
        availability: true,
      });

      if (error) throw new Error(error.message);

      setNewItem({ name: "", description: "", price: "", category: "Other" });
      clearImage();
      fetchMenu();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to add item.");
    } finally {
      setMenuSaving(false);
    }
  }

  /* ── Toggle / Delete ───────────────────────────────────── */
  async function toggleAvailability(item: MenuItem) {
    setTogglingId(item.id);
    await supabase
      .from("menu_items").update({ availability: !item.availability }).eq("id", item.id);
    setTogglingId(null);
    fetchMenu();
  }

  async function deleteItem(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setDeletingId(item.id);
    // Remove image from storage first (best-effort)
    if (item.image_url) await deleteStorageFile("menu-images", item.image_url);
    await supabase.from("menu_items").delete().eq("id", item.id);
    setDeletingId(null);
    fetchMenu();
  }

  /* ── Stats ─────────────────────────────────────────────── */
  const pending   = orders.filter((o) => o.order_status === "Pending").length;
  const active    = orders.filter((o) => ["Confirmed", "Out for Delivery"].includes(o.order_status)).length;
  const delivered = orders.filter((o) => o.order_status === "Delivered").length;
  const revenue   = orders.filter((o) => o.order_status === "Delivered")
    .reduce((s, o) => s + (o.total_estimated_price ?? 0), 0);
  const customers = new Set(orders.map((o) => o.phone_number)).size;

  /* ── Filtered orders ────────────────────────────────────── */
  const filteredOrders = orders.filter((o) => {
    const okStatus = filterStatus === "All" || o.order_status === filterStatus;
    const q = search.toLowerCase();
    const okSearch = !q ||
      o.customer_name.toLowerCase().includes(q) ||
      o.phone_number.includes(q) ||
      o.delivery_address.toLowerCase().includes(q) ||
      o.food_items_description.toLowerCase().includes(q);
    return okStatus && okSearch;
  });

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  const inputCls =
    "w-full bg-[#0D0F14] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm " +
    "placeholder:text-[#4B5563] outline-none focus:border-[#FF6B00]/50 " +
    "focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all";

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <>
      {lightboxUrl && (
        <ReceiptLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
      )}

      <div className="p-4 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="section-label mb-3">⚡ Admin</div>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
              Control Center
            </h1>
            <p className="text-[#9CA3AF] text-sm mt-1.5">
              Manage live orders and your menu in one place.
            </p>
          </div>
          <button
            onClick={() => { fetchOrders(); fetchMenu(); }}
            className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white border border-white/[0.08] rounded-xl px-4 py-2.5 hover:bg-white/[0.04] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh All
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[#111827] border border-white/[0.08] rounded-2xl p-1 mb-8 w-fit">
          {([
            { id: "orders" as const, label: "Live Orders",      icon: Package  },
            { id: "menu"   as const, label: "Menu Management",  icon: ChefHat  },
          ]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === id
                  ? "bg-[#FF6B00] text-white shadow-[0_4px_12px_rgba(255,107,0,0.3)]"
                  : "text-[#9CA3AF] hover:text-white hover:bg-white/[0.05]"
              )}>
              <Icon className="w-4 h-4" />
              {label}
              {id === "orders" && pending > 0 && (
                <span className="w-5 h-5 rounded-full bg-yellow-500 text-[#0D0F14] text-[10px] font-extrabold flex items-center justify-center">
                  {pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB: LIVE ORDERS                                    */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div>
            {newAlert && (
              <div className="flex items-center gap-3 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-2xl px-5 py-4 mb-6">
                <Bell className="w-5 h-5 text-[#FF6B00] animate-bounce flex-shrink-0" />
                <p className="text-sm font-bold text-[#FF8C33]">🔔 New order just arrived!</p>
              </div>
            )}

            {orderError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-5 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {orderError}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Stat label="Pending"       value={pending}                  sub="Need action"      icon={Clock}       iconCls="bg-yellow-500/10 text-yellow-400" />
              <Stat label="Active"        value={active}                    sub="In progress"      icon={Bike}         iconCls="bg-[#FF6B00]/15 text-[#FF8C33]" />
              <Stat label="Delivered"     value={delivered}                 sub="Completed"        icon={CheckCircle2} iconCls="bg-[#16A34A]/15 text-[#22C55E]" />
              <Stat label="Revenue (ETB)" value={revenue.toLocaleString()}  sub="Delivered orders" icon={TrendingUp}  iconCls="bg-blue-500/10 text-blue-400" />
              <Stat label="Customers"     value={customers}                 sub="Unique phones"    icon={Users}       iconCls="bg-purple-500/10 text-purple-400" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, phone, address, food..."
                  className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#4B5563] outline-none focus:border-[#FF6B00]/50 transition-all" />
              </div>
              <div className="relative">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5563]" />
                <select value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "All")}
                  className="bg-[#1A2035] border border-white/[0.08] rounded-xl pl-9 pr-8 py-3 text-white text-sm outline-none focus:border-[#FF6B00]/50 appearance-none cursor-pointer min-w-[185px]">
                  <option value="All">All Statuses</option>
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563] pointer-events-none" />
              </div>
            </div>

            <p className="text-xs text-[#6B7280] mb-4">
              <span className="text-white font-semibold">{filteredOrders.length}</span> of{" "}
              <span className="text-white font-semibold">{orders.length}</span> orders
            </p>

            {/* Order cards */}
            {ordersLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-7 h-7 animate-spin text-[#FF6B00]" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="glass-card rounded-2xl p-16 text-center">
                <ShoppingBag className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">No orders found</p>
                <p className="text-[#6B7280] text-sm">Orders appear here in real-time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const transitions = STATUS_TRANSITIONS[order.order_status];
                  const isExpanded  = expandedId === order.id;
                  const isUpdating  = updatingId === order.id;
                  const hasMobileReceipt =
                    order.payment_method === "Mobile Money" && order.receipt_url;
                  const missingReceipt =
                    order.payment_method === "Mobile Money" && !order.receipt_url;

                  return (
                    <div key={order.id}
                      className={cn(
                        "glass-card rounded-2xl border transition-all duration-300",
                        order.order_status === "Pending" && "border-yellow-500/20 shadow-[0_0_0_1px_rgba(234,179,8,0.06)]",
                        order.order_status === "Out for Delivery" && "border-[#FF6B00]/15",
                        isUpdating && "opacity-60"
                      )}>

                      {/* Card header */}
                      <div className="p-4 md:p-5">
                        <div className="flex items-start gap-3 flex-wrap">
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
                            {/* Status + meta */}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <StatusBadge status={order.order_status} />
                              <span className="text-[10px] text-[#6B7280] font-mono">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span className="text-xs text-[#6B7280]">{fmtDate(order.created_at)}</span>

                              {/* Mobile Money receipt indicators */}
                              {hasMobileReceipt && (
                                <button
                                  onClick={() => setLightboxUrl(order.receipt_url!)}
                                  className="inline-flex items-center gap-1 text-[11px] bg-[#16A34A]/10 border border-[#16A34A]/25 text-[#22C55E] rounded-full px-2.5 py-0.5 font-semibold hover:bg-[#16A34A]/20 transition-colors"
                                >
                                  <Eye className="w-3 h-3" /> View Receipt
                                </button>
                              )}
                              {missingReceipt && (
                                <span className="inline-flex items-center gap-1 text-[11px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full px-2.5 py-0.5 font-medium">
                                  ⚠ No receipt
                                </span>
                              )}
                            </div>

                            {/* Customer name + phone */}
                            <div className="flex items-center gap-3 flex-wrap mb-1.5">
                              <span className="text-sm font-bold text-white">{order.customer_name}</span>
                              <a href={`tel:${order.phone_number}`}
                                className="flex items-center gap-1 text-xs text-[#FF6B00] hover:underline font-medium"
                                onClick={(e) => e.stopPropagation()}>
                                <Phone className="w-3 h-3" />{order.phone_number}
                              </a>
                            </div>

                            <p className="text-sm text-[#9CA3AF]">{order.food_items_description}</p>

                            {order.total_estimated_price != null && (
                              <p className="text-sm font-bold text-[#FF6B00] mt-1">
                                ETB {order.total_estimated_price.toLocaleString()}
                                <span className="text-xs text-[#6B7280] font-normal ml-1.5">· {order.payment_method}</span>
                              </p>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                            {transitions.map(({ status, label, icon: Icon, cls }) => (
                              <button key={status}
                                onClick={() => changeStatus(order.id, status)}
                                disabled={isUpdating}
                                className={cn(
                                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-white/[0.08] bg-white/[0.03] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap",
                                  cls
                                )}>
                                {isUpdating
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Icon className="w-3.5 h-3.5" />}
                                {label}
                              </button>
                            ))}
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : order.id)}
                              className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-[#6B7280] hover:text-white hover:bg-white/[0.07] transition-all">
                              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-white/[0.06]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                            <div className="flex items-start gap-2.5 bg-[#0D0F14] rounded-xl p-3 border border-white/[0.06]">
                              <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[11px] text-[#6B7280] uppercase tracking-wider mb-0.5">Address</p>
                                <p className="text-sm text-white">{order.delivery_address}</p>
                              </div>
                            </div>
                            {order.landmark && (
                              <div className="flex items-start gap-2.5 bg-[#0D0F14] rounded-xl p-3 border border-white/[0.06]">
                                <Landmark className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-[11px] text-[#6B7280] uppercase tracking-wider mb-0.5">Landmark</p>
                                  <p className="text-sm text-white">{order.landmark}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-start gap-2.5 bg-[#0D0F14] rounded-xl p-3 border border-white/[0.06]">
                              <FileText className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[11px] text-[#6B7280] uppercase tracking-wider mb-0.5">Order</p>
                                <p className="text-sm text-white">{order.food_items_description}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5 bg-[#0D0F14] rounded-xl p-3 border border-white/[0.06]">
                              <CreditCard className="w-4 h-4 text-[#FF8C33] mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[11px] text-[#6B7280] uppercase tracking-wider mb-0.5">Payment</p>
                                <p className="text-sm text-white">{order.payment_method}</p>
                                {order.total_estimated_price != null && (
                                  <p className="text-sm font-bold text-[#FF6B00] mt-0.5">
                                    ETB {order.total_estimated_price.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Receipt preview strip (Mobile Money) */}
                          {order.payment_method === "Mobile Money" && (
                            <div className="mt-3 bg-[#0D0F14] rounded-xl border border-white/[0.06] p-3">
                              <p className="text-[11px] text-[#6B7280] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <Receipt className="w-3.5 h-3.5" /> Payment Receipt
                              </p>
                              {order.receipt_url ? (
                                <div className="flex items-center gap-3">
                                  <button onClick={() => setLightboxUrl(order.receipt_url!)}
                                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 hover:border-[#FF6B00]/40 transition-all group flex-shrink-0">
                                    <img src={order.receipt_url} alt="Receipt thumbnail"
                                      className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                      <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </button>
                                  <div>
                                    <p className="text-sm font-semibold text-[#22C55E] mb-1">✓ Receipt uploaded</p>
                                    <p className="text-xs text-[#6B7280] mb-2">Click thumbnail to verify the transfer.</p>
                                    <button onClick={() => setLightboxUrl(order.receipt_url!)}
                                      className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6B00] hover:underline">
                                      <Eye className="w-3.5 h-3.5" /> View full receipt
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-yellow-400">
                                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                  Customer did not attach a receipt. Call to confirm payment before dispatching.
                                </div>
                              )}
                            </div>
                          )}

                          {/* Call CTA */}
                          <a href={`tel:${order.phone_number}`}
                            className="flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-xl border border-[#FF6B00]/25 bg-[#FF6B00]/8 text-[#FF6B00] text-sm font-semibold hover:bg-[#FF6B00]/15 transition-colors">
                            <Phone className="w-4 h-4" />
                            Call {order.customer_name} — {order.phone_number}
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* TAB: MENU MANAGEMENT                                */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "menu" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column: Form wrapper layout */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Add New Item</h2>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-5 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {formError}
                  </div>
                )}

                {/* The Integrated Form inputs layout */}
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Item Name</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem((n) => ({ ...n, name: e.target.value }))}
                      placeholder="e.g. Special Burger"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Description</label>
                    <input
                      value={newItem.description}
                      onChange={(e) => setNewItem((n) => ({ ...n, description: e.target.value }))}
                      placeholder="Short description of the dish..." 
                      className={inputCls} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Price (ETB)</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem((n) => ({ ...n, price: e.target.value }))}
                      placeholder="0.00"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                      Category <span className="text-[#FF6B00]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem((n) => ({ ...n, category: e.target.value }))}
                        className={inputCls + " appearance-none cursor-pointer pr-10"}
                      >
                        {MENU_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Food Photo</label>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div 
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-white/[0.08] hover:border-[#FF6B00]/40 rounded-xl p-6 text-center cursor-pointer transition-colors"
                    >
                      {imagePreview ? (
                        <div className="relative w-24 h-24 mx-auto">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); clearImage(); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className="text-sm text-[#6B7280]">Click to upload photo</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={menuSaving}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-semibold py-3 rounded-xl shadow-[0_4px_12px_rgba(255,107,0,0.2)] transition-all disabled:opacity-50"
                  >
                    {menuSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Item
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side Column: Active Menu list rows mapping layout */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider">Active Menu ({menuItems.length})</h3>
                {menuError && <p className="text-xs text-red-400">{menuError}</p>}
              </div>

              {menuLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
                </div>
              ) : menuItems.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center text-[#6B7280]">
                  <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-semibold text-white">No items added yet</p>
                  <p className="text-xs mt-0.5">Use the form to fill your menu catalog.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {menuItems.map((item) => {
                    const isDeleting = deletingId === item.id;
                    const isToggling = togglingId === item.id;

                    return (
                      <div key={item.id} className="glass-card rounded-xl p-3.5 flex items-center justify-between gap-4 border border-white/[0.02]">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A2035] border border-white/[0.08] flex-shrink-0">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                            )}
                          </div>

                          {/* REPLACED BLOCK WITH DYNAMIC CATEGORY BADGES */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-white text-sm">{item.name}</p>
                              
                              {item.category && (
                                <span className="text-[10px] bg-white/[0.06] text-[#9CA3AF] border border-white/[0.08] px-2 py-0.5 rounded-full">
                                  {item.category}
                                </span>
                              )}

                              {!item.availability && (
                                <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-medium">
                                  Hidden
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-[#6B7280] mt-0.5 truncate">{item.description}</p>
                            )}
                            <p className="text-sm font-bold text-[#FF6B00] mt-0.5">
                              ETB {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Status Toggles and action layout elements */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => toggleAvailability(item)}
                            disabled={isToggling}
                            title={item.availability ? "Mute availability" : "Make available"}
                            className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-40"
                          >
                            {isToggling ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : item.availability ? (
                              <ToggleRight className="w-5 h-5 text-[#22C55E]" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-[#4B5563]" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => deleteItem(item)}
                            disabled={isDeleting}
                            className="w-8 h-8 rounded-xl bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 text-red-400 hover:text-red-300 flex items-center justify-center transition-all disabled:opacity-40"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  );
}