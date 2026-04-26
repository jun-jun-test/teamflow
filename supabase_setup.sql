-- ============================================================
-- チーム進捗ツール - Supabase テーブル作成 SQL
-- Supabaseダッシュボードの「SQL Editor」を開き、
-- このファイルの内容をすべてコピーして貼り付け、「Run」を押してください
-- ============================================================

-- タスクテーブル
create table if not exists tasks (
  id   text primary key,
  data jsonb default '{}'
);

-- KPIテーブル
create table if not exists kpis (
  id   text primary key,
  data jsonb default '{}'
);

-- ワークフロー（フロー＋ステップ）テーブル
create table if not exists flows (
  id   text primary key,
  data jsonb default '{}'
);

-- ボトルネックテーブル
create table if not exists bottlenecks (
  id   text primary key,
  data jsonb default '{}'
);

-- ============================================================
-- Row Level Security（RLS）の設定
-- 「チームURLを知っている人なら誰でもアクセスできる」設定です
-- ============================================================

alter table tasks       enable row level security;
alter table kpis        enable row level security;
alter table flows       enable row level security;
alter table bottlenecks enable row level security;

create policy "public_all" on tasks       for all using (true) with check (true);
create policy "public_all" on kpis        for all using (true) with check (true);
create policy "public_all" on flows       for all using (true) with check (true);
create policy "public_all" on bottlenecks for all using (true) with check (true);
