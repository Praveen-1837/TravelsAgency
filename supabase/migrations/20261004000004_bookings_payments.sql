-- Migration 004: Bookings and Payments

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE SET NULL,
    
    -- Sanity package references
    package_id TEXT NOT NULL,
    package_slug TEXT,
    package_title_snapshot TEXT NOT NULL,
    
    -- Trip details
    travel_date DATE NOT NULL,
    travelers INTEGER NOT NULL CHECK (travelers > 0),
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    
    -- Booking state
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at on bookings
DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON public.bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON public.bookings(travel_date);

-- Row Level Security for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Admins can view all bookings
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings"
    ON public.bookings FOR SELECT
    USING (public.is_admin());

-- Policy: Admins can update all bookings
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
CREATE POLICY "Admins can update all bookings"
    ON public.bookings FOR UPDATE
    USING (public.is_admin());
    
-- Policy: Admins can insert bookings
DROP POLICY IF EXISTS "Admins can insert bookings" ON public.bookings;
CREATE POLICY "Admins can insert bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (public.is_admin());


CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    
    -- Razorpay details
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    
    -- Payment info
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed', 'refunded')),
    method TEXT,
    paid_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at on payments
DROP TRIGGER IF EXISTS set_payments_updated_at ON public.payments;
CREATE TRIGGER set_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view payments for their own bookings
DROP POLICY IF EXISTS "Users can view payments for own bookings" ON public.payments;
CREATE POLICY "Users can view payments for own bookings"
    ON public.payments FOR SELECT
    USING (
        booking_id IN (
            SELECT id FROM public.bookings WHERE user_id = auth.uid()
        )
    );

-- Policy: Admins can view all payments
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments"
    ON public.payments FOR SELECT
    USING (public.is_admin());

-- Policy: Admins can update all payments
DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments;
CREATE POLICY "Admins can update all payments"
    ON public.payments FOR UPDATE
    USING (public.is_admin());

-- (Note: A webhook handler or edge function running with service role will typically handle inserting payments or updates from Razorpay)
