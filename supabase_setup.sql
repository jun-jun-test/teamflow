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

-- 関連タスクテーブル
create table if not exists related_tasks (
  id   text primary key,
  data jsonb default '{}'
);

-- メンバー設定テーブル（単一レコード: id='prefs'）
create table if not exists member_prefs (
  id   text primary key,
  data jsonb default '{}'
);

-- スケジュールテーブル（単一レコード: id='seed_schedule'）
create table if not exists schedule (
  id   text primary key,
  data jsonb default '{}'
);

-- 通知テーブル
create table if not exists notifications (
  id   text primary key,
  data jsonb default '{}'
);

-- ============================================================
-- Row Level Security（RLS）の設定
-- 「チームURLを知っている人なら誰でもアクセスできる」設定です
-- ============================================================

alter table tasks         enable row level security;
alter table kpis          enable row level security;
alter table flows         enable row level security;
alter table bottlenecks   enable row level security;
alter table related_tasks enable row level security;
alter table member_prefs  enable row level security;
alter table schedule      enable row level security;
alter table notifications enable row level security;

create policy "public_all" on tasks         for all using (true) with check (true);
create policy "public_all" on kpis          for all using (true) with check (true);
create policy "public_all" on flows         for all using (true) with check (true);
create policy "public_all" on bottlenecks   for all using (true) with check (true);
create policy "public_all" on related_tasks for all using (true) with check (true);
create policy "public_all" on member_prefs  for all using (true) with check (true);
create policy "public_all" on schedule      for all using (true) with check (true);
create policy "public_all" on notifications for all using (true) with check (true);

-- ============================================================
-- Realtime（リアルタイム同期）の有効化
-- postgres_changes イベントを受け取るために必要です
-- ============================================================

alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table kpis;
alter publication supabase_realtime add table flows;
alter publication supabase_realtime add table bottlenecks;
alter publication supabase_realtime add table related_tasks;
alter publication supabase_realtime add table member_prefs;
alter publication supabase_realtime add table schedule;
alter publication supabase_realtime add table notifications;
