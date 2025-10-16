-- =====================================================
-- FIX RLS POLICIES - MIGRATION SCRIPT
-- Chạy script này trong Supabase SQL Editor để fix vấn đề
-- user không thấy bộ đề mà admin tạo
-- =====================================================

-- Xóa tất cả policies cũ nếu có
DROP POLICY IF EXISTS "Users can view own profile" ON users;

DROP POLICY IF EXISTS "Users can update own profile" ON users;

DROP POLICY IF EXISTS "Anyone can view question sets" ON question_sets;

DROP POLICY IF EXISTS "Only admins can create question sets" ON question_sets;

DROP POLICY IF EXISTS "Only admins can update question sets" ON question_sets;

DROP POLICY IF EXISTS "Only admins can delete question sets" ON question_sets;

DROP POLICY IF EXISTS "Anyone can view questions" ON questions;

DROP POLICY IF EXISTS "Only admins can create questions" ON questions;

DROP POLICY IF EXISTS "Only admins can update questions" ON questions;

DROP POLICY IF EXISTS "Only admins can delete questions" ON questions;

DROP POLICY IF EXISTS "Users can view own results" ON user_results;

DROP POLICY IF EXISTS "Users can create own results" ON user_results;

DROP POLICY IF EXISTS "Admins can view all results" ON user_results;

DROP POLICY IF EXISTS "Users can view own answers" ON user_answers;

DROP POLICY IF EXISTS "Users can create own answers" ON user_answers;

DROP POLICY IF EXISTS "Admins can view all answers" ON user_answers;

-- =====================================================
-- GIẢI PHÁP 1: TẮT RLS (ĐƠN GIẢN NHẤT)
-- Vì app đang dùng custom JWT auth, không dùng Supabase Auth
-- nên tắt RLS sẽ đơn giản hơn
-- =====================================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;

ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

ALTER TABLE user_results DISABLE ROW LEVEL SECURITY;

ALTER TABLE user_answers DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- HOẶC GIẢI PHÁP 2: BẬT RLS VỚI POLICIES CHO PHÉP TẤT CẢ
-- (Uncomment phần này nếu muốn dùng RLS)
-- =====================================================

/*
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- USERS table - allow all operations (vì đang dùng custom auth)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);

-- QUESTION_SETS table - allow all operations
-- Vì logic authorization đã được handle ở API layer
CREATE POLICY "Allow all on question_sets" ON question_sets FOR ALL USING (true) WITH CHECK (true);

-- QUESTIONS table - allow all operations
CREATE POLICY "Allow all on questions" ON questions FOR ALL USING (true) WITH CHECK (true);

-- USER_RESULTS table - allow all operations
CREATE POLICY "Allow all on user_results" ON user_results FOR ALL USING (true) WITH CHECK (true);

-- USER_ANSWERS table - allow all operations
CREATE POLICY "Allow all on user_answers" ON user_answers FOR ALL USING (true) WITH CHECK (true);
*/

-- =====================================================
-- VERIFY: Kiểm tra kết quả
-- =====================================================

-- Kiểm tra RLS status
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE
    schemaname = 'public'
ORDER BY tablename;

-- Kiểm tra policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE
    schemaname = 'public'
ORDER BY tablename, policyname;