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

-- Only admins can view/edit
create policy "Admins can view listing_requests"
    on public.listing_requests for select
    to authenticated
    using ( public.is_admin() );

create policy "Admins can update listing_requests"
    on public.listing_requests for update
    to authenticated
    using ( public.is_admin() );

-- Anyone can insert (public form)
create policy "Public can insert listing_requests"
    on public.listing_requests for insert
    to anon, authenticated
    with check (true);
