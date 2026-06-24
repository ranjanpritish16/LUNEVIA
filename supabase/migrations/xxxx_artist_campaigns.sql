create table if not exists public.artist_campaigns (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  title text not null,
  description text,
  offer_type text not null check (
    offer_type in ('percentage_discount','flat_discount','free_addon','combo_package')
  ),
  discount_value numeric not null default 0,
  applicable_services jsonb not null default '[]'::jsonb,
  start_date date not null,
  end_date date not null,
  is_active boolean not null default true,
  views integer not null default 0,
  clicks integer not null default 0,
  bookings integer not null default 0,
  ai_generated jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_artist_campaigns_salon_id on public.artist_campaigns(salon_id);
create index if not exists idx_artist_campaigns_active_window
  on public.artist_campaigns(is_active, start_date, end_date);

alter table public.artist_campaigns enable row level security;

-- Public can read currently-active, in-window campaigns
create policy "Public can view active campaigns"
  on public.artist_campaigns for select
  using (is_active = true and current_date between start_date and end_date);

-- Owner can read all their own campaigns (active, paused, expired)
create policy "Owners can view own campaigns"
  on public.artist_campaigns for select
  using (
    exists (
      select 1 from public.salons s
      where s.id = artist_campaigns.salon_id and s.owner_id = auth.uid()
    )
  );

create policy "Owners can insert own campaigns"
  on public.artist_campaigns for insert
  with check (
    exists (
      select 1 from public.salons s
      where s.id = artist_campaigns.salon_id and s.owner_id = auth.uid()
    )
  );

create policy "Owners can update own campaigns"
  on public.artist_campaigns for update
  using (
    exists (
      select 1 from public.salons s
      where s.id = artist_campaigns.salon_id and s.owner_id = auth.uid()
    )
  );

create policy "Owners can delete own campaigns"
  on public.artist_campaigns for delete
  using (
    exists (
      select 1 from public.salons s
      where s.id = artist_campaigns.salon_id and s.owner_id = auth.uid()
    )
  );

create or replace function public.touch_artist_campaigns_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_artist_campaigns_updated_at
before update on public.artist_campaigns
for each row execute function public.touch_artist_campaigns_updated_at();

-- Atomic increment, callable from the public client (security definer bypasses RLS for the update only)
create or replace function public.increment_campaign_metric(campaign_id uuid, metric text)
returns void as $$
begin
  if metric = 'views' then
    update public.artist_campaigns set views = views + 1 where id = campaign_id;
  elsif metric = 'clicks' then
    update public.artist_campaigns set clicks = clicks + 1 where id = campaign_id;
  elsif metric = 'bookings' then
    update public.artist_campaigns set bookings = bookings + 1 where id = campaign_id;
  end if;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_campaign_metric(uuid, text) to anon, authenticated;