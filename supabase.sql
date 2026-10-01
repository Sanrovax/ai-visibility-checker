-- Run this once in Supabase: SQL Editor > New query > paste > Run.
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  business_name text,
  category text,
  city text,
  score int
);

-- Lock the table. Only the server (service role key) can write or read it.
alter table public.leads enable row level security;
