// ─── Auth / Profile ──────────────────────────────────────────
export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

// ─── Orders ──────────────────────────────────────────────────
export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod = "Cash" | "Mobile Money";

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  phone_number: string;
  delivery_address: string;
  landmark: string | null;
  food_items_description: string;
  payment_method: PaymentMethod;
  total_estimated_price: number | null;
  order_status: OrderStatus;
  receipt_url: string | null;       // Mobile Money screenshot
  item_name: string | null;
  item_image_url: string | null;
  quantity: number | null;
  created_at: string;
}

export interface OrderFormValues {
  customer_name: string;
  phone_number: string;
  delivery_address: string;
  landmark: string;
  payment_method: PaymentMethod;
  quantity: number;
}

// ─── Menu Items ───────────────────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;           // from Supabase Storage
  availability: boolean;
  created_at: string;
}

// ─── Landing page types ───────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  count: string;
  href: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  category: string;
  cuisine_type: string;
  image_url: string;
  cover_url: string;
  rating: number;
  review_count: number;
  delivery_time_min: number;
  delivery_time_max: number;
  delivery_fee: number;
  min_order: number;
  is_open: boolean;
  promo_label?: string;
  vendor_id: string;
  created_at: string;
}
