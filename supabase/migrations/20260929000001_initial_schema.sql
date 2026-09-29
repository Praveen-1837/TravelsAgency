-- Aariva Voyages — Database Migration 1: Initial Schema
-- Tables: packages, callback_requests, reviews, admin_users

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create updated_at automatic timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. packages table
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    duration_nights INTEGER NOT NULL CHECK (duration_nights >= 0),
    duration TEXT NOT NULL, -- e.g. '6N/7D'
    price_per_person NUMERIC(10, 2) NOT NULL CHECK (price_per_person >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price >= price_per_person),
    discount_percent INTEGER DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    price_unit TEXT NOT NULL DEFAULT 'person' CHECK (price_unit IN ('person', 'couple')),
    audience TEXT[] NOT NULL DEFAULT ARRAY['couple', 'group', 'family']::TEXT[],
    description TEXT NOT NULL,
    inclusions TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    itinerary JSONB NOT NULL DEFAULT '[]'::JSONB,
    images TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    rating_avg NUMERIC(2, 1) NOT NULL DEFAULT 0.0 CHECK (rating_avg >= 0.0 AND rating_avg <= 5.0),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for packages.updated_at
CREATE OR REPLACE TRIGGER set_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for packages
CREATE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_active_featured ON public.packages(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_packages_destination ON public.packages(destination);

-- 4. callback_requests table
CREATE TABLE IF NOT EXISTS public.callback_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    travel_from DATE,
    travel_to DATE,
    group_size INTEGER NOT NULL DEFAULT 2 CHECK (group_size > 0),
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for callback_requests.updated_at
CREATE OR REPLACE TRIGGER set_callback_requests_updated_at
BEFORE UPDATE ON public.callback_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for callback_requests
CREATE INDEX IF NOT EXISTS idx_callback_requests_status_created ON public.callback_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_callback_requests_phone ON public.callback_requests(phone);
CREATE INDEX IF NOT EXISTS idx_callback_requests_package_id ON public.callback_requests(package_id);

-- 5. reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    traveler_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    photos TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    trip_label TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_package_approved ON public.reviews(package_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- 6. admin_users table (references Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
