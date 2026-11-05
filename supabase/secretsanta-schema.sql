-- ==============================================
-- Schema: Secret Santa (/secretsanta)
-- Accesat DOAR de pe server (SUPABASE_SERVICE_ROLE_KEY).
-- RLS pornit fără politici → cheia publică (anon) nu poate citi perechile.
-- ==============================================

create table if not exists secretsanta_store (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  version     integer not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists secretsanta_backups (
  id          bigserial primary key,
  data        jsonb not null,
  created_at  timestamptz not null default now()
);

alter table secretsanta_store enable row level security;
alter table secretsanta_backups enable row level security;
