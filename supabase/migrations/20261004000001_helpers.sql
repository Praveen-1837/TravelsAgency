-- Migration 001: Helpers

-- 1. Create updated_at automatic timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create is_admin() helper
-- Checks if the currently authenticated user has the 'admin' role in the profiles table.
-- SECURITY DEFINER allows it to bypass RLS on profiles to avoid recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_admin_user BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    ) INTO is_admin_user;
    
    RETURN is_admin_user;
END;
$$;
