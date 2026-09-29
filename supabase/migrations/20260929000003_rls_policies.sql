-- Aariva Voyages — Database Migration 3: Row-Level Security (RLS) Policies
-- Implements strict zero-trust access control for public visitors vs admin/staff

-- 1. Helper function to check if current authenticated user is an admin or staff member
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE id = auth.uid()
          AND role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Helper function to check if current authenticated user is a full admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE id = auth.uid()
          AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =========================================================================
-- 3. RLS for `packages` table
-- =========================================================================
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Public can read active packages; Admins/Staff can read all packages
CREATE POLICY "packages_select_policy"
ON public.packages
FOR SELECT
USING (
    is_active = true OR public.is_admin_or_staff()
);

-- Only Admins and Staff can insert/update/delete packages
CREATE POLICY "packages_modify_policy"
ON public.packages
FOR ALL
USING (public.is_admin_or_staff())
WITH CHECK (public.is_admin_or_staff());

-- =========================================================================
-- 4. RLS for `reviews` table
-- =========================================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read only approved reviews; Admins/Staff can read all reviews
CREATE POLICY "reviews_select_policy"
ON public.reviews
FOR SELECT
USING (
    is_approved = true OR public.is_admin_or_staff()
);

-- Only Admins and Staff can create, approve, or edit reviews
CREATE POLICY "reviews_modify_policy"
ON public.reviews
FOR ALL
USING (public.is_admin_or_staff())
WITH CHECK (public.is_admin_or_staff());

-- =========================================================================
-- 5. RLS for `callback_requests` table
-- =========================================================================
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;

-- Public can submit callback requests (INSERT only)
CREATE POLICY "callback_requests_public_insert"
ON public.callback_requests
FOR INSERT
WITH CHECK (true);

-- Public cannot view callback requests; Only Admin/Staff can view
CREATE POLICY "callback_requests_admin_select"
ON public.callback_requests
FOR SELECT
USING (public.is_admin_or_staff());

-- Admin/Staff can update status, assignees, and internal notes
CREATE POLICY "callback_requests_admin_update"
ON public.callback_requests
FOR UPDATE
USING (public.is_admin_or_staff())
WITH CHECK (public.is_admin_or_staff());

-- Only full Admins can delete callback records (e.g. data privacy requests)
CREATE POLICY "callback_requests_admin_delete"
ON public.callback_requests
FOR DELETE
USING (public.is_admin());

-- =========================================================================
-- 6. RLS for `admin_users` table
-- =========================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Users can view their own admin profile; Admins can view all profiles
CREATE POLICY "admin_users_select_policy"
ON public.admin_users
FOR SELECT
USING (
    id = auth.uid() OR public.is_admin()
);

-- Only full Admins can grant or modify roles
CREATE POLICY "admin_users_modify_policy"
ON public.admin_users
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
