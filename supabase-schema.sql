-- ============================================================
-- SwiftDrop v5 — Complete Database + Storage Schema
-- Supabase Dashboard → SQL Editor → New Query → Run All
-- ============================================================

-- ── Clean slate ───────────────────────────────────────────────
DROP TABLE IF EXISTS public.orders     CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.profiles   CASCADE;
DROP TRIGGER   IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION  IF EXISTS public.handle_new_user();

-- ── 1. profiles ───────────────────────────────────────────────
CREATE TABLE public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  role       TEXT NOT NULL DEFAULT 'customer'
               CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. menu_items (image_url replaces emoji) ─────────────────
CREATE TABLE public.menu_items (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT    NOT NULL,
  description  TEXT    NOT NULL DEFAULT '',
  price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url    TEXT    NOT NULL DEFAULT '',
  availability BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. orders (+ receipt_url) ─────────────────────────────────
CREATE TABLE public.orders (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name          TEXT NOT NULL,
  phone_number           TEXT NOT NULL,
  delivery_address       TEXT NOT NULL,
  landmark               TEXT,
  food_items_description TEXT NOT NULL,
  payment_method         TEXT NOT NULL
                           CHECK (payment_method IN ('Cash', 'Mobile Money')),
  total_estimated_price  NUMERIC(10,2),
  order_status           TEXT NOT NULL DEFAULT 'Pending'
                           CHECK (order_status IN (
                             'Pending','Confirmed',
                             'Out for Delivery','Delivered','Cancelled'
                           )),
  receipt_url            TEXT,          -- Mobile Money transfer screenshot
  item_name              TEXT,
  item_image_url         TEXT,
  quantity               INT DEFAULT 1,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Row Level Security ─────────────────────────────────────
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders     ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own"  ON public.profiles FOR SELECT  USING (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE  USING (auth.uid() = id);

-- menu_items: anyone authenticated can read; only admins write
CREATE POLICY "menu_read_auth"       ON public.menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "menu_admin_insert"    ON public.menu_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "menu_admin_update"    ON public.menu_items FOR UPDATE
  USING     (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "menu_admin_delete"    ON public.menu_items FOR DELETE
  USING     (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- orders: customers own their rows; admins see all
CREATE POLICY "orders_customer_insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_customer_select" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_admin_select"    ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "orders_admin_update"    ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "orders_admin_delete"    ON public.orders FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── 5. Indexes ────────────────────────────────────────────────
CREATE INDEX orders_user_id_idx    ON public.orders(user_id);
CREATE INDEX orders_status_idx     ON public.orders(order_status);
CREATE INDEX orders_created_idx    ON public.orders(created_at DESC);
CREATE INDEX menu_availability_idx ON public.menu_items(availability);

-- ── 6. Grants ─────────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL   ON public.profiles   TO authenticated;
GRANT ALL   ON public.menu_items TO authenticated;
GRANT ALL   ON public.orders     TO authenticated;

-- ── 7. Realtime ───────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;

-- ============================================================
-- STORAGE BUCKETS — run these separately in SQL Editor
-- OR create them manually in Storage → New Bucket
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('menu-images',      'menu-images',      true),
--   ('payment-receipts', 'payment-receipts', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage RLS — allow authenticated users to upload to payment-receipts
-- INSERT INTO storage.policies ...
-- (Easier: use the Dashboard UI — see README for step-by-step)

-- ============================================================
-- PROMOTE YOURSELF TO ADMIN (after signing up):
--
-- UPDATE public.profiles SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
-- ============================================================
