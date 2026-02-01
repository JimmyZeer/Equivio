-- Create table for storing claim requests securely
CREATE TABLE IF NOT EXISTS practitioner_claim_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id UUID REFERENCES practitioners(id) ON DELETE CASCADE,
    
    -- Claimer Info
    claimer_name TEXT NOT NULL,
    claimer_email TEXT NOT NULL,
    claimer_phone TEXT,
    claimer_website TEXT,
    claimer_message TEXT,
    
    -- Status & Metadata
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    consent BOOLEAN DEFAULT false,
    
    -- Security
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for searching/filtering
CREATE INDEX IF NOT EXISTS idx_claim_requests_practitioner ON practitioner_claim_requests(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_claim_requests_email ON practitioner_claim_requests(claimer_email);
CREATE INDEX IF NOT EXISTS idx_claim_requests_status ON practitioner_claim_requests(status);
CREATE INDEX IF NOT EXISTS idx_claim_requests_ip ON practitioner_claim_requests(ip_address);

-- Enable RLS
ALTER TABLE practitioner_claim_requests ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Insert: Allow public/anon to insert (for the claim form)
CREATE POLICY "Enable insert for everyone" ON practitioner_claim_requests
    FOR INSERT WITH CHECK (true);

-- 2. Select: Only allow admins or service role (no public read)
-- For now, we likely don't have auth.users setup matching admins, so we restrict common access.
-- Apps connecting with SERVICE_ROLE_KEY can always bypass RLS.
CREATE POLICY "Deny read for anon" ON practitioner_claim_requests
    FOR SELECT USING (false);
