-- Bảng người dùng
create table users (
    id uuid primary key default gen_random_uuid (),
    full_name text,
    email text unique,
    phone text unique not null,
    birth_date date,
    password_hash text not null,
    role text not null default 'user' check (
        role in (
            'admin',
            'user',
            'vip1',
            'vip2',
            'vip3'
        )
    ),
    created_at timestamp default now()
);

-- Bảng bộ câu hỏi
create table question_sets (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    created_by uuid references users (id) on delete set null,
    created_at timestamp default now()
);

-- Bảng câu hỏi
create table questions (
    id uuid primary key default gen_random_uuid (),
    question_set_id uuid references question_sets (id) on delete cascade,
    content text not null,
    option_a text not null,
    option_b text not null,
    option_c text not null,
    option_d text not null,
    correct_option char(1) not null check (
        correct_option in ('A', 'B', 'C', 'D')
    ),
    created_at timestamp default now()
);

-- Bảng kết quả làm bài (tổng hợp)
create table user_results (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references users (id) on delete cascade,
    question_set_id uuid references question_sets (id) on delete cascade,
    total_questions int not null,
    correct_count int not null,
    wrong_count int not null,
    score int not null, -- % hoặc thang điểm
    taken_at timestamp default now()
);

-- Bảng câu trả lời chi tiết
create table user_answers (
    id uuid primary key default gen_random_uuid (),
    result_id uuid references user_results (id) on delete cascade,
    question_id uuid references questions (id) on delete cascade,
    chosen_option char(1) not null check (
        chosen_option in ('A', 'B', 'C', 'D')
    ),
    is_correct boolean not null
);

-- Trigger tự động check đúng/sai khi insert vào user_answers
create or replace function check_answer_correct()
returns trigger as $$
begin
  if (new.chosen_option = (select correct_option from questions where id = new.question_id)) then
    new.is_correct := true;
  else
    new.is_correct := false;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_check_answer
before insert on user_answers
for each row
execute function check_answer_correct();

-- Trigger tự động update thống kê (correct_count, wrong_count, total_questions, score)
create or replace function update_user_results_stats()
returns trigger as $$
begin
  update user_results
  set 
    correct_count = (select count(*) from user_answers ua where ua.result_id = new.result_id and ua.is_correct = true),
    wrong_count   = (select count(*) from user_answers ua where ua.result_id = new.result_id and ua.is_correct = false),
    total_questions = (select count(*) from user_answers ua where ua.result_id = new.result_id),
    score = (
      (select count(*) from user_answers ua where ua.result_id = new.result_id and ua.is_correct = true) * 100
      / nullif((select count(*) from user_answers ua where ua.result_id = new.result_id), 0)
    )
  where id = new.result_id;
  return null;
end;
$$ language plpgsql;

create trigger trg_update_results
after insert or update on user_answers
for each row
execute function update_user_results_stats();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
alter table users enable row level security;

alter table question_sets enable row level security;

alter table questions enable row level security;

alter table user_results enable row level security;

alter table user_answers enable row level security;

-- USERS table policies
-- Users can read their own data
create policy "Users can view own profile"
  on users for select
  using (auth.uid()::text = id::text);

-- Users can update their own profile
create policy "Users can update own profile"
  on users for update
  using (auth.uid()::text = id::text);

-- QUESTION_SETS table policies
-- Everyone can read question sets (for practice)
create policy "Anyone can view question sets" on question_sets for
select to public using (true);

-- Only admins can create question sets
create policy "Only admins can create question sets"
  on question_sets for insert
  with check (
    exists (
      select 1 from users
      where users.id::text = auth.uid()::text
      and users.role = 'admin'
    )
  );

-- Only admins can update question sets
create policy "Only admins can update question sets"
  on question_sets for update
  using (
    exists (
      select 1 from users
      where users.id::text = auth.uid()::text
      and users.role = 'admin'
    )
  );

-- Only admins can delete question sets
create policy "Only admins can delete question sets"
  on question_sets for delete
  using (
    exists (
      select 1 from users
      where users.id::text = auth.uid()::text
      and users.role = 'admin'
    )
  );

-- QUESTIONS table policies
-- Everyone can read questions (for practice)
create policy "Anyone can view questions" on questions for
select to public using (true);

-- Only admins can create questions
create policy "Only admins can create questions"
  on questions for insert
  with check (
    exists (
      select 1 from users
      where users.id::text = auth.uid()::text
      and users.role = 'admin'
    )
  );

-- Only admins can update questions
create policy "Only admins can update questions"
  on questions for update
  using (
    exists (
      select 1 from users
      where users.id::text = auth.uid()::text
      and users.role = 'admin'
    )
  );

-- Only admins can delete questions
create policy "Only admins can delete questions"
  on questions for delete
  using (
    exists (
      select 1 from users
      where users.id::text = auth.uid()::text
      and users.role = 'admin'
    )
  );

-- USER_RESULTS table policies
-- Users can only view their own results
create policy "Users can view own results"
  on user_results for select
  using (auth.uid()::text = user_id::text);

-- Users can create their own results
create policy "Users can create own results"
  on user_results for insert
  with check (auth.uid()::text = user_id::text);

-- Admins can view all results
create policy "Admins can view all results"
  on user_results for select
  using (
    exists (
      select 1 from users
      where users.id::text = auth.uid()::text
      and users.role = 'admin'
    )
  );

-- USER_ANSWERS table policies
-- Users can view their own answers
create policy "Users can view own answers"
  on user_answers for select
  using (
    exists (
      select 1 from user_results
      where user_results.id = user_answers.result_id
      and user_results.user_id::text = auth.uid()::text
    )
  );

-- Users can create their own answers
create policy "Users can create own answers"
  on user_answers for insert
  with check (
    exists (
      select 1 from user_results
      where user_results.id = user_answers.result_id
      and user_results.user_id::text = auth.uid()::text
    )
  );

-- Admins can view all answers
create policy "Admins can view all answers"
  on user_answers for select
  using (
    exists (
      select 1 from users
      where users.id::text = auth.uid()::text
      and users.role = 'admin'
    )
  );