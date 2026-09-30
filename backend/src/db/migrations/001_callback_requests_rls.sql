-- =============================================================================
-- Migration: 001_callback_requests_rls.sql
-- Description: Create callback_requests table with Row Level Security (RLS) policies
-- =============================================================================

-- 1. Create callback_requests table if not exists
CREATE TABLE IF NOT EXISTS callback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  travel_from DATE,
  travel_to DATE,
  group_size INTEGER DEFAULT 2 CHECK (group_size >= 1 AND group_size <= 50),
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  assigned_to VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance on user queries & phone lookup
CREATE INDEX IF NOT EXISTS idx_callback_requests_user_id ON callback_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_callback_requests_phone ON callback_requests(phone);
CREATE INDEX IF NOT EXISTS idx_callback_requests_status ON callback_requests(status);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running migration
DROP POLICY IF EXISTS "Authenticated users can insert their own callback requests" ON callback_requests;
DROP POLICY IF EXISTS "Users can view their own callback requests or admins view all" ON callback_requests;
DROP POLICY IF EXISTS "Admins can update callback request status and notes" ON callback_requests;
DROP POLICY IF EXISTS "Admins can delete callback requests" ON callback_requests;

-- 3. INSERT Policy: Authenticated users only, and user_id MUST equal auth.uid()
CREATE POLICY "Authenticated users can insert their own callback requests"
  ON callback_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. SELECT Policy: Users see only their own rows (auth.uid() = user_id); admins see all
CREATE POLICY "Users can view their own callback requests or admins view all"
  ON callback_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- 5. UPDATE Policy: Admins/Staff only
CREATE POLICY "Admins can update callback request status and notes"
  ON callback_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- 6. DELETE Policy: Admins only
CREATE POLICY "Admins can delete callback requests"
  ON callback_requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- 7. Revoke all access for unauthenticated (anon) role
REVOKE ALL ON callback_requests FROM anon;
