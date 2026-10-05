-- Migration 003: Inquiries

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'callback' CHECK (type IN ('callback', 'question')),
    
    -- Sanity package references
    package_id TEXT,
    package_slug TEXT,
    package_title_snapshot TEXT,
    
    -- Contact info
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    preferred_contact TEXT DEFAULT 'whatsapp' CHECK (preferred_contact IN ('whatsapp', 'phone', 'email')),
    
    -- Trip details
    travel_start_date DATE,
    travel_end_date DATE,
    group_size INTEGER CHECK (group_size > 0),
    special_requests TEXT,
    message TEXT,
    
    -- Admin state
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
    admin_notes TEXT,
    contacted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER set_inquiries_updated_at
BEFORE UPDATE ON public.inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at_desc ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_package_id ON public.inquiries(package_id);

-- Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own inquiries
DROP POLICY IF EXISTS "Users can view own inquiries" ON public.inquiries;
CREATE POLICY "Users can view own inquiries"
    ON public.inquiries FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own inquiries
DROP POLICY IF EXISTS "Users can insert own inquiries" ON public.inquiries;
CREATE POLICY "Users can insert own inquiries"
    ON public.inquiries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all inquiries
DROP POLICY IF EXISTS "Admins can view all inquiries" ON public.inquiries;
CREATE POLICY "Admins can view all inquiries"
    ON public.inquiries FOR SELECT
    USING (public.is_admin());

-- Policy: Admins can update all inquiries
DROP POLICY IF EXISTS "Admins can update all inquiries" ON public.inquiries;
CREATE POLICY "Admins can update all inquiries"
    ON public.inquiries FOR UPDATE
    USING (public.is_admin());
