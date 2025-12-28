-- Create accounts table
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted boolean default false,
  "dateCreated" timestamp with time zone,
  "planType" text,
  "paymentStatus" text,
  password text,
  "firstName" text,
  "lastName1" text,
  "lastName2" text,
  email text unique,
  rut text unique,
  phone text,
  "check" boolean,
  type text,
  "subscriptionsCount" integer,
  "recoverToken" text,
  "expirationDate" timestamp with time zone,
  "addedSubscriptionsCount" integer
);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted boolean default false,
  name text,
  rut text,
  "accountId" uuid references public.accounts(id)
);

-- Create settings table
create table public.settings (
  id text primary key,
  price numeric,
  "offerPrice" numeric,
  "discountText" text
);

-- Insert list settings row
insert into public.settings (id, price, "offerPrice", "discountText")
values ('--', 24000, 0, '')
on conflict (id) do nothing;

-- Create paymentData table
create table public."paymentData" (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  "accountId" uuid references public.accounts(id),
  "dateCreated" timestamp with time zone,
  "paymentData" jsonb
);

-- Enable Row Level Security (RLS) - Optional/Recommended
alter table public.accounts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.settings enable row level security;
alter table public."paymentData" enable row level security;

-- Create policies (Basic example - open for now to match typical Firebase migration behavior, 
-- but strictly you should lock this down)
create policy "Public accounts are viewable by everyone" on public.accounts for select using (true);
create policy "Users can insert their own account" on public.accounts for insert with check (true);
create policy "Users can update their own account" on public.accounts for update using (true);

create policy "Public settings are viewable by everyone" on public.settings for select using (true);
create policy "Public subscriptions are viewable by everyone" on public.subscriptions for select using (true);
create policy "Public subscriptions are insertable by everyone" on public.subscriptions for insert with check (true);

create policy "Public paymentData are viewable by everyone" on public."paymentData" for select using (true);
create policy "Public paymentData are insertable by everyone" on public."paymentData" for insert with check (true);
