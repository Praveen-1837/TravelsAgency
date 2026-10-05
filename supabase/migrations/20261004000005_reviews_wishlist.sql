-- Migration 005: Reviews and Wishlist

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Sanity package references
    package_id TEXT NOT NULL,
    package_slug TEXT,
    
    -- Reviewer info
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_name TEXT NOT NULL,
    source TEXT DEFAULT 'customer' CHECK (source IN ('customer', 'admin_added')),
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    trip_date DATE,
    photo_paths TEXT[] DEFAULT '{}'::TEXT[],
    
    -- Moderation status
    is_approved BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at on reviews
DROP TRIGGER IF EXISTS set_reviews_updated_at ON public.reviews;
CREATE TRIGGER set_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_package_id ON public.reviews(package_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Row Level Security for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
CREATE POLICY "Anyone can view approved reviews"
    ON public.reviews FOR SELECT
    USING (is_approved = true);

-- Policy: Users can view their own pending/unapproved reviews
DROP POLICY IF EXISTS "Users can view own reviews" ON public.reviews;
CREATE POLICY "Users can view own reviews"
    ON public.reviews FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert reviews
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND 
        (auth.uid() = user_id OR user_id IS NULL)
    );

-- Policy: Admins can view and manage all reviews
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
CREATE POLICY "Admins can view all reviews"
    ON public.reviews FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all reviews" ON public.reviews;
CREATE POLICY "Admins can update all reviews"
    ON public.reviews FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert reviews" ON public.reviews;
CREATE POLICY "Admins can insert reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews"
    ON public.reviews FOR DELETE
    USING (public.is_admin());


-- Create View for Review Stats
CREATE OR REPLACE VIEW public.package_review_stats AS
SELECT 
    package_id,
    COUNT(*) as review_count,
    ROUND(AVG(rating)::numeric, 1) as average_rating
FROM public.reviews
WHERE is_approved = true
GROUP BY package_id;


CREATE TABLE IF NOT EXISTS public.wishlist (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    package_id TEXT NOT NULL,
    package_slug TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, package_id)
);

-- Row Level Security for wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wishlist
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlist;
CREATE POLICY "Users can view own wishlist"
    ON public.wishlist FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert into their own wishlist
DROP POLICY IF EXISTS "Users can insert own wishlist" ON public.wishlist;
CREATE POLICY "Users can insert own wishlist"
    ON public.wishlist FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete from their own wishlist
DROP POLICY IF EXISTS "Users can delete own wishlist" ON public.wishlist;
CREATE POLICY "Users can delete own wishlist"
    ON public.wishlist FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Admins can view all wishlists (for analytics etc)
DROP POLICY IF EXISTS "Admins can view all wishlists" ON public.wishlist;
CREATE POLICY "Admins can view all wishlists"
    ON public.wishlist FOR SELECT
    USING (public.is_admin());
