-- Create Audit Logs table
create table if not exists public.admin_audit_logs (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    action text not null, -- e.g. 'practitioner.update', 'claim.approve'
    entity_type text not null, -- e.g. 'practitioner'
    entity_id uuid,
    before_data jsonb,
    after_data jsonb,
    admin_label text default 'basic-auth',
    ip text
);

-- Secure it (Private table, only accessible via service_role)
alter table public.admin_audit_logs enable row level security;

-- No policies for anon/authenticated roles = strict denial by default.
-- Only service_role can access.
