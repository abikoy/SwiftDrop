"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, Phone, MapPin, Landmark, CreditCard, User,
  Minus, Plus, Loader2, AlertCircle, CheckCircle2,
  ShoppingBag, Upload, ImageIcon, XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/storage";
import type { MenuItem, OrderFormValues, PaymentMethod } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  item: MenuItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY: OrderFormValues = {
  customer_name: "",
  phone_number: "",
  delivery_address: "",
  landmark: "",
  payment_method: "Cash",
  quantity: 1,
};

const inputCls =
  "w-full bg-[#0D0F14] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm " +
  "placeholder:text-[#4B5563] outline-none focus:border-[#FF6B00]/60 " +
  "focus:shadow-[0_0_0_3px_rgba(255,107,0,0.12)] transition-all duration-200";

const MAX_FILE_MB = 5;

export function CheckoutModal({ item, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<OrderFormValues>(EMPTY);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Reset on open ─────────────────────────────────────── */
  useEffect(() => {
    if (!item) return;
    setForm(EMPTY);
    setError("");
    setDone(false);
    setReceiptFile(null);
    setReceiptPreview(null);

    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles").select("full_name, phone").eq("id", user.id).single();
      if (profile) {
        setForm((f) => ({
          ...f,
          customer_name: profile.full_name ?? "",
          phone_number: profile.phone ?? "",
        }));
      }
    })();
  }, [item]);

  /* ── Keyboard / scroll lock ────────────────────────────── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  /* ── Receipt file picker ───────────────────────────────── */
  const handleReceiptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Receipt image must be under ${MAX_FILE_MB} MB.`);
      return;
    }
    setError("");
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = () => setReceiptPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  function clearReceipt() {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!item) return null;

  const total = item.price * form.quantity;
  const needsReceipt = form.payment_method === "Mobile Money";

  function upd(field: keyof OrderFormValues, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  /* ── Submit ─────────────────────────────────────────────── */
  // Add this right at the start of your submit function
if (!item) {
  console.error("No item selected");
  return;
}
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.customer_name.trim())    return setError("Full name is required.");
    if (!form.phone_number.trim())     return setError("Phone number is required.");
    if (!form.delivery_address.trim()) return setError("Delivery address is required.");
    if (needsReceipt && !receiptFile)  return setError("Please upload your transfer screenshot for Mobile Money payment.");

    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      /* 1. Upload receipt if Mobile Money */
      let receipt_url: string | null = null;
      if (needsReceipt && receiptFile) {
        receipt_url = await uploadFile("payment-receipts", receiptFile, user?.id ?? "anon");
      }

      /* 2. Write order row */
      const { error: dbErr } = await supabase.from("orders").insert({
        user_id:                user?.id ?? null,
        customer_name:          form.customer_name.trim(),
        phone_number:           form.phone_number.trim(),
        delivery_address:       form.delivery_address.trim(),
        landmark:               form.landmark.trim() || null,
food_items_description: `${form.quantity}x ${item?.name || 'Selected Item'}`,
        payment_method:         form.payment_method,
        total_estimated_price:  total,
        order_status:           "Pending",
        receipt_url,
        item_name:              item?.name,
        item_image_url:         item?.image_url,
        quantity:               form.quantity,
      });

      if (dbErr) throw new Error(dbErr.message);
      setDone(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full sm:max-w-lg bg-[#111827] sm:rounded-3xl rounded-t-3xl border border-white/[0.08] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

        {/* Mobile handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {/* Item thumbnail */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#1A2035] border border-white/[0.08] flex-shrink-0">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-[#6B7280]" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white leading-tight">{item.name}</h2>
              <p className="text-xs text-[#6B7280]">ETB {item.price.toLocaleString()} each</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success */}
        {done ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Order Placed! 🎉</h3>
            <p className="text-sm text-[#9CA3AF] max-w-xs">
              We'll call you within <span className="text-white font-semibold">5 minutes</span> to confirm your order.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[82vh]">
            <div className="px-6 py-5 space-y-4">

              {/* Error banner */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Quantity stepper */}
              <div className="flex items-center justify-between bg-[#0D0F14] border border-white/[0.08] rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-[#9CA3AF]">Quantity</span>
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => upd("quantity", Math.max(1, form.quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-display text-base font-bold text-white w-5 text-center">{form.quantity}</span>
                  <button type="button"
                    onClick={() => upd("quantity", Math.min(10, form.quantity + 1))}
                    className="w-7 h-7 rounded-lg bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] mb-1.5">
                  <User className="w-3 h-3" /> Full Name <span className="text-[#FF6B00]">*</span>
                </label>
                <input value={form.customer_name} onChange={(e) => upd("customer_name", e.target.value)}
                  placeholder="e.g. Abebe Bekele" className={inputCls} />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] mb-1.5">
                  <Phone className="w-3 h-3" /> Phone Number <span className="text-[#FF6B00]">*</span>
                </label>
                <input value={form.phone_number} onChange={(e) => upd("phone_number", e.target.value)}
                  placeholder="e.g. +251 91 234 5678" className={inputCls} />
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] mb-1.5">
                  <MapPin className="w-3 h-3" /> Delivery Address <span className="text-[#FF6B00]">*</span>
                </label>
                <input value={form.delivery_address} onChange={(e) => upd("delivery_address", e.target.value)}
                  placeholder="e.g. Bole, near Total station, Addis Ababa" className={inputCls} />
              </div>

              {/* Landmark */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] mb-1.5">
                  <Landmark className="w-3 h-3" /> Nearby Landmark
                  <span className="text-[#4B5563] font-normal ml-1">(optional)</span>
                </label>
                <input value={form.landmark} onChange={(e) => upd("landmark", e.target.value)}
                  placeholder="e.g. Blue building next to Edna Mall" className={inputCls} />
              </div>

              {/* Payment method */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] mb-1.5">
                  <CreditCard className="w-3 h-3" /> Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(["Cash", "Mobile Money"] as PaymentMethod[]).map((method) => (
                    <button key={method} type="button"
                      onClick={() => { upd("payment_method", method); if (method === "Cash") clearReceipt(); }}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all duration-200",
                        form.payment_method === method
                          ? "bg-[#FF6B00]/15 border-[#FF6B00]/40 text-[#FF6B00]"
                          : "bg-[#0D0F14] border-white/[0.08] text-[#9CA3AF] hover:border-white/20"
                      )}>
                      {method === "Cash" ? "💵" : "📱"} {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Conditional receipt upload (Mobile Money only) ── */}
              {needsReceipt && (
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF]">
                    <Upload className="w-3 h-3" />
                    Upload Transfer Screenshot (Telebirr / CBE Birr)
                    <span className="text-[#FF6B00]">*</span>
                  </label>

                  {receiptPreview ? (
                    /* Preview */
                    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#0D0F14]">
                      <img src={receiptPreview} alt="Receipt preview"
                        className="w-full max-h-52 object-contain" />
                      <button type="button" onClick={clearReceipt}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/80 transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <div className="px-3 py-2 bg-[#0D0F14] border-t border-white/[0.06]">
                        <p className="text-xs text-[#6B7280] truncate">{receiptFile?.name}</p>
                        <p className="text-[11px] text-[#22C55E] mt-0.5">✓ Ready to upload</p>
                      </div>
                    </div>
                  ) : (
                    /* Drop zone */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2.5 border-2 border-dashed border-white/[0.12] hover:border-[#FF6B00]/40 rounded-xl py-8 px-4 cursor-pointer transition-all duration-200 bg-[#0D0F14] hover:bg-[#FF6B00]/[0.03]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#1A2035] border border-white/[0.08] flex items-center justify-center">
                        <Upload className="w-5 h-5 text-[#9CA3AF]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-white">Click to upload screenshot</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">PNG, JPG or WEBP — max {MAX_FILE_MB} MB</p>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleReceiptChange}
                  />

                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    📌 Send your payment to our Telebirr/CBE account, then screenshot the confirmation and upload it here. The admin will verify before confirming your order.
                  </p>
                </div>
              )}
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 px-6 py-4 bg-[#111827] border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#9CA3AF]">
                  Total ({form.quantity} item{form.quantity > 1 ? "s" : ""})
                </span>
                <span className="font-display text-xl font-extrabold text-white">
                  ETB {total.toLocaleString()}
                </span>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full btn-orange py-4 text-base flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />
                    {needsReceipt && receiptFile ? "Uploading receipt…" : "Placing order…"}
                  </>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /> Confirm Order — ETB {total.toLocaleString()}</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
