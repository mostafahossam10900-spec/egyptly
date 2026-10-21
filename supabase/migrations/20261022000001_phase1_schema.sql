-- Egyptly Phase 1 schema: profiles/roles, reference data (governorates → destinations → landmarks,
-- interests) and tourist trip requests with database-enforced ownership and consistency.

-- ---------------------------------------------------------------------------
-- Profiles & roles (authorization is separate from Supabase Auth authentication)
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('tourist', 'guide', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  role public.app_role not null default 'tourist',
  preferred_locale text not null default 'en' check (preferred_locale in ('en','ar','it','es','de','ru','uk','tr')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Every new auth user gets a tourist profile. The role is never taken from client metadata,
-- so nobody can sign themselves up as guide/admin.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, first_name, last_name, preferred_locale)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''), 'Traveller'),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''), '-'),
    case when new.raw_user_meta_data ->> 'locale' in ('en','ar') then new.raw_user_meta_data ->> 'locale' else 'en' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role lookup used by policies. security definer so it works regardless of profile RLS.
create function public.current_app_role() returns public.app_role
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid()
$$;

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Users may edit their names/locale but never their role.
revoke update on public.profiles from authenticated, anon;
grant update (first_name, last_name, preferred_locale) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Reference data (read-only for clients; written only by migrations/seed)
-- ---------------------------------------------------------------------------
create table public.governorates (
  slug text primary key,
  name_ar text not null,
  name_en text not null,
  note_ar text,
  -- Order of the source discussion. NOT an official tourism ranking.
  discussion_order smallint not null,
  -- [{label_ar, url}] — sources support the governorate/groups, not each landmark.
  sources jsonb not null default '[]'
);

create table public.destinations (
  slug text primary key,
  governorate_slug text not null references public.governorates (slug),
  name_ar text not null,
  name_en text not null,
  sort_order smallint not null
);

create type public.landmark_type as enum (
  'ancient_site', 'historic_site', 'museum', 'religious', 'reserve', 'nature',
  'beach', 'diving', 'heritage_area', 'modern', 'destination_area'
);

create type public.access_status as enum ('unverified', 'verified_open', 'verified_restricted', 'verified_closed');

create table public.landmarks (
  slug text primary key,
  destination_slug text not null references public.destinations (slug),
  section_ar text not null,
  section_en text not null,
  name_ar text not null,
  name_en text not null,
  name_en_reviewed boolean not null default false,
  type public.landmark_type not null,
  parent_slug text references public.landmarks (slug),
  flags text[] not null default '{}',
  source_scope text not null default 'governorate' check (source_scope in ('governorate', 'landmark')),
  source_url text,
  access_status public.access_status not null default 'unverified',
  last_verified_at timestamptz,
  -- Operational fields stay NULL (= unknown) until verified with a source.
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  opening_hours text,
  ticket_info text,
  image_url text,
  image_license text,
  sort_order smallint not null,
  unique (slug, destination_slug),
  check (parent_slug is null or parent_slug <> slug),
  check ((latitude is null) = (longitude is null)),
  check (image_url is null or image_license is not null)
);

create table public.interests (
  slug text primary key,
  name_en text not null,
  name_ar text not null,
  sort_order smallint not null unique
);

alter table public.governorates enable row level security;
alter table public.destinations enable row level security;
alter table public.landmarks enable row level security;
alter table public.interests enable row level security;

create policy "reference: public read" on public.governorates for select to anon, authenticated using (true);
create policy "reference: public read" on public.destinations for select to anon, authenticated using (true);
create policy "reference: public read" on public.landmarks for select to anon, authenticated using (true);
create policy "reference: public read" on public.interests for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Trip requests
-- ---------------------------------------------------------------------------
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  current_step smallint not null default 1 check (current_step between 1 and 7),
  arrival_date date,
  departure_date date,
  arrival_time time,
  departure_time time,
  arrival_day_available boolean not null default false,
  departure_day_available boolean not null default false,
  travelers integer check (travelers between 1 and 100),
  trip_type text check (trip_type in ('multi_day', 'day_trip', 'layover')),
  companions text check (companions in ('solo', 'couple', 'family', 'friends', 'group')),
  budget_amount numeric(12, 2) check (budget_amount > 0 and budget_amount <= 10000000),
  budget_currency text check (budget_currency in ('USD', 'EUR', 'GBP', 'EGP')),
  budget_basis text check (budget_basis in ('per_person', 'group')),
  budget_categories text[] not null default '{}' check (
    budget_categories <@ array['flights','accommodation','local_transport','entry_tickets','food','guide_fee','activities']
  ),
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  check (departure_date is null or arrival_date is null or departure_date >= arrival_date),
  check (trip_type is distinct from 'day_trip' or departure_date is null or departure_date = arrival_date),
  -- A submitted request must be complete.
  check (status = 'draft' or (
    arrival_date is not null and departure_date is not null and travelers is not null
    and trip_type is not null and companions is not null and budget_amount is not null
    and budget_currency is not null and budget_basis is not null and cardinality(budget_categories) > 0
  ))
);

create index trips_owner_idx on public.trips (owner_id, updated_at desc);

create trigger trips_touch before update on public.trips
  for each row execute function public.touch_updated_at();

create table public.trip_destinations (
  trip_id uuid not null references public.trips (id) on delete cascade,
  destination_slug text not null references public.destinations (slug),
  primary key (trip_id, destination_slug)
);

create table public.trip_interests (
  trip_id uuid not null references public.trips (id) on delete cascade,
  interest_slug text not null references public.interests (slug),
  primary key (trip_id, interest_slug)
);

-- The composite foreign keys guarantee (in the database, not just the UI) that a selected landmark
-- belongs to one of the trip's selected destinations; removing a destination removes its landmarks.
create table public.trip_landmarks (
  -- Direct FK to trips as well, so the API can embed selections under a trip.
  trip_id uuid not null references public.trips (id) on delete cascade,
  destination_slug text not null,
  landmark_slug text not null,
  primary key (trip_id, landmark_slug),
  foreign key (trip_id, destination_slug)
    references public.trip_destinations (trip_id, destination_slug) on delete cascade,
  foreign key (landmark_slug, destination_slug)
    references public.landmarks (slug, destination_slug)
);

-- Submission rules that need other tables or the current date.
create function public.check_trip_submission() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.status = 'submitted' and (tg_op = 'INSERT' or old.status is distinct from 'submitted'
      or new.arrival_date is distinct from old.arrival_date) then
    if new.arrival_date < current_date then
      raise exception 'arrival_date_in_past' using errcode = 'check_violation';
    end if;
    if not exists (select 1 from public.trip_destinations where trip_id = new.id) then
      raise exception 'destination_required' using errcode = 'check_violation';
    end if;
    if not exists (select 1 from public.trip_interests where trip_id = new.id) then
      raise exception 'interest_required' using errcode = 'check_violation';
    end if;
    new.submitted_at = coalesce(new.submitted_at, now());
  end if;
  return new;
end;
$$;

create trigger trips_check_submission before insert or update on public.trips
  for each row execute function public.check_trip_submission();

alter table public.trips enable row level security;
alter table public.trip_destinations enable row level security;
alter table public.trip_interests enable row level security;
alter table public.trip_landmarks enable row level security;

-- Authorization: only the owner, and only accounts with the tourist role may create trips.
create policy "trips: owner read" on public.trips
  for select to authenticated using (owner_id = (select auth.uid()));
create policy "trips: tourist insert own" on public.trips
  for insert to authenticated
  with check (owner_id = (select auth.uid()) and (select public.current_app_role()) = 'tourist');
create policy "trips: owner update" on public.trips
  for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "trips: owner delete" on public.trips
  for delete to authenticated using (owner_id = (select auth.uid()));

create function public.owns_trip(p_trip_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.trips where id = p_trip_id and owner_id = auth.uid())
$$;

create policy "trip_destinations: owner all" on public.trip_destinations
  for all to authenticated using ((select public.owns_trip(trip_id))) with check ((select public.owns_trip(trip_id)));
create policy "trip_interests: owner all" on public.trip_interests
  for all to authenticated using ((select public.owns_trip(trip_id))) with check ((select public.owns_trip(trip_id)));
create policy "trip_landmarks: owner all" on public.trip_landmarks
  for all to authenticated using ((select public.owns_trip(trip_id))) with check ((select public.owns_trip(trip_id)));

-- Atomically replace a trip's selections. security invoker → all RLS policies above still apply.
-- Returns the landmark slugs that were dropped because their destination was removed.
create function public.save_trip_selections(
  p_trip_id uuid,
  p_destinations text[],
  p_interests text[],
  p_landmarks text[]
) returns text[]
language plpgsql security invoker set search_path = '' as $$
declare
  dropped text[];
begin
  if not public.owns_trip(p_trip_id) then
    raise exception 'trip_not_found' using errcode = 'insufficient_privilege';
  end if;

  select coalesce(array_agg(l.slug), '{}') into dropped
  from unnest(coalesce(p_landmarks, '{}')) as s(slug)
  join public.landmarks l on l.slug = s.slug
  where not (l.destination_slug = any (coalesce(p_destinations, '{}')));

  delete from public.trip_destinations
   where trip_id = p_trip_id and not (destination_slug = any (coalesce(p_destinations, '{}')));
  insert into public.trip_destinations (trip_id, destination_slug)
    select p_trip_id, d from unnest(coalesce(p_destinations, '{}')) d
    on conflict do nothing;

  delete from public.trip_interests where trip_id = p_trip_id;
  insert into public.trip_interests (trip_id, interest_slug)
    select p_trip_id, i from unnest(coalesce(p_interests, '{}')) i
    on conflict do nothing;

  delete from public.trip_landmarks where trip_id = p_trip_id;
  insert into public.trip_landmarks (trip_id, destination_slug, landmark_slug)
    select p_trip_id, l.destination_slug, l.slug
    from unnest(coalesce(p_landmarks, '{}')) s(slug)
    join public.landmarks l on l.slug = s.slug
    where l.destination_slug = any (coalesce(p_destinations, '{}'))
    on conflict do nothing;

  update public.trips set updated_at = now() where id = p_trip_id;
  return dropped;
end;
$$;

revoke execute on function public.save_trip_selections(uuid, text[], text[], text[]) from anon, public;
grant execute on function public.save_trip_selections(uuid, text[], text[], text[]) to authenticated;
