-- ==============================================================================
-- SKEMA BASIS DATA: ASRI COLLECTION PRODUCTION
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger fungsi updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. TABEL PRODUK
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(14, 2),
    discount_percentage INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    review_count INT DEFAULT 0,
    thumbnail TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    sizes TEXT[] DEFAULT '{"S", "M", "L", "XL", "All Size"}'::text[],
    colors TEXT[] DEFAULT '{"Mocca", "Broken White", "Sage", "Hitam"}'::text[],
    stock INT NOT NULL DEFAULT 25,
    sku TEXT UNIQUE,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_new BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    weight_grams INT DEFAULT 350,
    material TEXT DEFAULT 'Premium Silk & Cotton Blend',
    care_instructions TEXT DEFAULT 'Cuci dengan tangan suhu dingin, jangan gunakan pemutih.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL PESANAN (DUITKU POP TRANSACTIONAL)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_order_id TEXT UNIQUE NOT NULL,
    reference TEXT,
    amount NUMERIC(14, 2) NOT NULL,
    shipping_fee NUMERIC(14, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(14, 2) NOT NULL,
    product_details TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED', 'PROCESSING', 'SHIPPED', 'DELIVERED')),
    result_code TEXT,
    payment_method TEXT,
    payment_url TEXT,
    va_number TEXT,
    qr_string TEXT,
    additional_param TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABEL RINCIAN ITEM PESANAN
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    price NUMERIC(14, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    variant TEXT,
    thumbnail TEXT,
    subtotal NUMERIC(14, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABEL BANNER PROMOSI
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge TEXT,
    image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    link TEXT NOT NULL DEFAULT '/products',
    cta_text TEXT NOT NULL DEFAULT 'Belanja Sekarang',
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indeks Performa
CREATE INDEX IF NOT EXISTS idx_orders_merchant_order_id ON public.orders(merchant_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Triggers
DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Kebijakan Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public query orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read order items" ON public.order_items FOR SELECT USING (true);

-- Service Role Full Permissions
CREATE POLICY "Service role orders" ON public.orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role order items" ON public.order_items FOR ALL TO service_role USING (true) WITH CHECK (true);
