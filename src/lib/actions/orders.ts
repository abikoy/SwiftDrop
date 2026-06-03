"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderFormValues, OrderStatus } from "@/types";

export async function placeOrder(values: OrderFormValues) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to place an order." };
  }

  const { error } = await supabase.from("orders").insert({
    user_id: user.id,
    customer_name: values.customer_name.trim(),
    phone_number: values.phone_number.trim(),
    delivery_address: values.delivery_address.trim(),
    landmark: values.landmark.trim() || null,
    food_items_description: values.food_items_description.trim(),
    payment_method: values.payment_method,
    total_estimated_price: values.total_estimated_price
      ? parseFloat(values.total_estimated_price)
      : null,
    order_status: "Pending",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/customer");
  return { success: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const supabase = await createClient();

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Forbidden: admin only" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function getCustomerOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAllOrders() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}
