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