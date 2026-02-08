-- Imported problems (custom LeetCode imports, persisted per user)
create table user_imported_problems (
  user_id uuid references auth.users on delete cascade not null,
  problem_id text not null,
  problem_data jsonb not null,
  created_at timestamptz default now(),
  primary key (user_id, problem_id)
);

-- Notes per problem per user
create table user_notes (
  user_id uuid references auth.users on delete cascade not null,
  problem_id text not null,
  notes text not null default '',
  updated_at timestamptz default now(),
  primary key (user_id, problem_id)
);

-- AI chat history per problem per user
create table user_chats (
  user_id uuid references auth.users on delete cascade not null,
  problem_id text not null,
  messages jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, problem_id)
);

-- Enable Row Level Security
alter table user_imported_problems enable row level security;
alter table user_notes enable row level security;
alter table user_chats enable row level security;

-- RLS: users can only access their own rows
create policy "Users can view own imported problems"
  on user_imported_problems for select using (auth.uid() = user_id);
create policy "Users can insert own imported problems"
  on user_imported_problems for insert with check (auth.uid() = user_id);
create policy "Users can update own imported problems"
  on user_imported_problems for update using (auth.uid() = user_id);
create policy "Users can delete own imported problems"
  on user_imported_problems for delete using (auth.uid() = user_id);

create policy "Users can view own notes"
  on user_notes for select using (auth.uid() = user_id);
create policy "Users can insert own notes"
  on user_notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes"
  on user_notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes"
  on user_notes for delete using (auth.uid() = user_id);

create policy "Users can view own chats"
  on user_chats for select using (auth.uid() = user_id);
create policy "Users can insert own chats"
  on user_chats for insert with check (auth.uid() = user_id);
create policy "Users can update own chats"
  on user_chats for update using (auth.uid() = user_id);
create policy "Users can delete own chats"
  on user_chats for delete using (auth.uid() = user_id);
