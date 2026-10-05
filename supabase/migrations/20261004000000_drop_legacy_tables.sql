-- Migration 000: Drop legacy tables and their dependencies

-- Drop triggers that might depend on these tables
DROP TRIGGER IF EXISTS trg_update_package_rating_stats ON public.reviews;
DROP TRIGGER IF EXISTS set_packages_updated_at ON public.packages;
DROP TRIGGER IF EXISTS set_callback_requests_updated_at ON public.callback_requests;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_package_rating_stats();
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_staff() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Drop legacy tables
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.callback_requests CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
