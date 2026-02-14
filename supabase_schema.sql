-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Create the 'bins' table
create table if not exists bins (
  id uuid default gen_random_uuid() primary key,
  deviceId text not null,
  fillPercentage integer not null check (fillPercentage between 0 and 100),
  status text not null,
  createdAt timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table bins enable row level security;

-- 3. Create policies to allow public read/write (for demo purposes)
-- In production, you should restrict INSERT to authenticated service roles only.

-- Allow anyone to read status (Frontend)
create policy "Enable read access for all users" 
on bins for select 
using (true);

-- Allow anyone to insert status (ESP32)
-- Ideally, use a Service Key approach or simple API key. 
-- Since your prompt asked for public ESP32 access:
create policy "Enable insert access for all users" 
on bins for insert 
with check (true);

-- 4. Create the 'dustbin_registry' table for management
create table if not exists dustbin_registry (
  id uuid default gen_random_uuid() primary key,
  deviceid text unique not null,
  name text not null,
  details text,
  createdat timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable RLS for registry
alter table dustbin_registry enable row level security;

-- 6. Create policies for registry (Public for demo)
create policy "Enable select for all" on dustbin_registry for select using (true);
create policy "Enable insert for all" on dustbin_registry for insert with check (true);
create policy "Enable update for all" on dustbin_registry for update using (true);
create policy "Enable delete for all" on dustbin_registry for delete using (true);
