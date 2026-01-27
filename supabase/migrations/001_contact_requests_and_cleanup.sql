-- ============================================
-- Equivio Database Migrations
-- Run these SQL commands in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE TABLE: contact_requests
-- Stores contact form submissions
-- ============================================

CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
    practitioner_name TEXT,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anon (public form submissions)
CREATE POLICY "Allow public inserts" ON contact_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow practitioners to read their own contact requests (future auth)
-- CREATE POLICY "Practitioners can read own contacts" ON contact_requests
--     FOR SELECT
--     USING (practitioner_id = auth.uid());

-- Create index for faster queries
CREATE INDEX idx_contact_requests_practitioner ON contact_requests(practitioner_id);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created ON contact_requests(created_at DESC);

-- ============================================
-- 2. CLEANUP: Fix unknown/null data in practitioners
-- ============================================

-- Replace 'unknown' region with NULL (cleaner)
UPDATE practitioners 
SET region = NULL 
WHERE region = 'unknown' OR region = 'Unknown' OR LOWER(region) = 'unknown';

-- Replace 'unknown' city with NULL
UPDATE practitioners 
SET city = NULL 
WHERE city = 'unknown' OR city = 'Unknown' OR LOWER(city) = 'unknown';

-- Replace empty strings with NULL for cleaner data
UPDATE practitioners SET region = NULL WHERE region = '';
UPDATE practitioners SET city = NULL WHERE city = '';
UPDATE practitioners SET phone_norm = NULL WHERE phone_norm = '';
UPDATE practitioners SET website = NULL WHERE website = '';
UPDATE practitioners SET address_full = NULL WHERE address_full = '';

-- ============================================
-- 3. Verification queries
-- ============================================

-- Check remaining 'unknown' values
SELECT 'Remaining unknown regions' as check_type, COUNT(*) as count 
FROM practitioners 
WHERE LOWER(region) = 'unknown';

SELECT 'Remaining unknown cities' as check_type, COUNT(*) as count 
FROM practitioners 
WHERE LOWER(city) = 'unknown';

-- Check NULL counts
SELECT 'NULL regions' as check_type, COUNT(*) as count 
FROM practitioners 
WHERE region IS NULL;

SELECT 'NULL cities' as check_type, COUNT(*) as count 
FROM practitioners 
WHERE city IS NULL;

-- Preview contact_requests table
SELECT * FROM contact_requests LIMIT 5;
