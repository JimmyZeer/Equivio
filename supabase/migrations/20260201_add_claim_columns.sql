-- Add columns for profile claiming system
ALTER TABLE practitioners 
ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS claimed_contact JSONB;

-- Optional: Add index if we plan to filter often by claimed status
CREATE INDEX IF NOT EXISTS idx_practitioners_is_claimed ON practitioners(is_claimed);
