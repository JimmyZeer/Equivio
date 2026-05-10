-- Early access waitlist for the upcoming "Carnet de santé numérique du cheval"
-- product. Captures interest before the MVP is built.

create table if not exists public.early_access_signups (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    email text not null,
    role text not null check (role in ('owner', 'pro', 'both')),
    horse_count int check (horse_count is null or horse_count between 1 and 200),
    pro_specialty text,
    region text,
    source text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    user_agent text
);

create unique index if not exists early_access_signups_email_unique
    on public.early_access_signups (lower(email));

create index if not exists early_access_signups_created_at_idx
    on public.early_access_signups (created_at desc);

create index if not exists early_access_signups_role_idx
    on public.early_access_signups (role);

alter table public.early_access_signups enable row level security;

-- Public (anon) can insert their own signup. Reads stay restricted to
-- service_role (admin dashboard / exports).
create policy "Public can insert early_access_signups"
    on public.early_access_signups for insert
    to anon, authenticated
    with check (true);
