-- Create listing_requests table
create table if not exists public.listing_requests (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text not null,
    specialty text not null,
    city text,
    phone text,
    status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'ignored')),
    notes text
);

-- RLS Policies
alter table public.listing_requests enable row level security;

-- Only service_role can view/update (implicit bypass), so we don't need specific policies for admin if they use the admin key.
-- We ONLY need to allow public inserts.

-- Public can insert listing_requests
create policy "Public can insert listing_requests"
    on public.listing_requests for insert
    to anon, authenticated
    with check (true);
