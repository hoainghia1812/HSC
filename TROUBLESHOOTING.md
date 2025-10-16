# 🔧 Troubleshooting: Trang /practice không hiển thị bộ đề

## ❓ Vấn đề

Trang `http://localhost:3000/practice` không hiển thị các bộ đề từ database.

## ✅ Checklist kiểm tra

### 1. **Dev Server đang chạy?**

```bash
npm run dev
```

Đảm bảo server chạy trên `http://localhost:3000`

### 2. **Database có dữ liệu?**

#### Cách kiểm tra:

1. Mở **Supabase Dashboard**
2. Vào **Table Editor** → Chọn table `question_sets`
3. Xem có bộ đề nào không?

#### Nếu KHÔNG có dữ liệu:

**Tạo bộ đề mới:**

1. Đăng nhập với tài khoản **admin**:

   - Email: `admin@example.com`
   - Password: (mật khẩu admin của bạn)

2. Vào: `http://localhost:3000/admin/question-sets`

3. Click **"+ Tạo bộ đề mới"**

4. Nhập tên bộ đề (ví dụ: "Toán Học Lớp 10")

5. Click **"Tạo"**

6. Thêm câu hỏi vào bộ đề:
   - Click **"Quản lý câu hỏi"**
   - Thêm ít nhất 5-10 câu hỏi

### 3. **RLS (Row Level Security) đã tắt?**

Đây là **nguyên nhân phổ biến nhất**!

#### Kiểm tra:

1. Vào **Supabase Dashboard**
2. Vào **SQL Editor**
3. Chạy query này:

```sql
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('question_sets', 'questions');
```

#### Kết quả mong đợi:

```
tablename       | rowsecurity
----------------|------------
question_sets   | false
questions       | false
```

#### Nếu `rowsecurity = true`:

**Chạy script fix:**

```sql
-- TẮT RLS cho các bảng
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers DISABLE ROW LEVEL SECURITY;
```

> 📖 **Chi tiết**: Xem file `fix-rls-policies.sql` hoặc `docs/fix-question-sets-visibility.md`

### 4. **Environment Variables đúng chưa?**

Kiểm tra file `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### Cách lấy keys:

1. Vào **Supabase Dashboard**
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Sau khi sửa `.env.local`**, PHẢI restart dev server:

```bash
# Ctrl+C để stop
npm run dev  # Chạy lại
```

### 5. **Test API trực tiếp**

Mở browser và truy cập:

```
http://localhost:3000/api/practice/question-sets
```

#### Kết quả mong đợi:

```json
{
  "questionSets": [
    {
      "id": "uuid-here",
      "title": "Toán Học Lớp 10",
      "questionCount": 10,
      "created_at": "2024-10-16T..."
    }
  ],
  "total": 1,
  "success": true
}
```

#### Nếu trả về `questionSets: []`:

- ✅ API hoạt động
- ❌ Database KHÔNG có dữ liệu
- 👉 Quay lại **Bước 2** để tạo bộ đề

#### Nếu có lỗi:

```json
{
  "error": "Failed to fetch question sets",
  "details": "..."
}
```

- ❌ Có vấn đề với database connection
- 👉 Kiểm tra **Environment Variables** (Bước 4)
- 👉 Kiểm tra **RLS** (Bước 3)

### 6. **Console Logs**

#### Trong Browser:

1. Mở trang `http://localhost:3000/practice`
2. Mở **DevTools** (F12)
3. Vào tab **Console**
4. Xem có lỗi gì không?

#### Trong Terminal (Server logs):

Xem output của `npm run dev`:

```bash
Fetching question sets from API...
API URL: http://localhost:3000/api/practice/question-sets
Response status: 200
Found X question sets for practice
```

### 7. **Clear Cache & Rebuild**

Nếu vẫn không được:

```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

Hoặc trên Windows:

```bash
# Stop server (Ctrl+C)
rmdir /s .next
npm run dev
```

---

## 🐛 Các lỗi phổ biến

### Lỗi 1: "Database not configured"

**Nguyên nhân**: Environment variables chưa set

**Giải pháp**: Xem **Bước 4** ở trên

---

### Lỗi 2: "Failed to fetch question sets"

**Nguyên nhân**: RLS đang chặn

**Giải pháp**:

1. Chạy script tắt RLS (xem **Bước 3**)
2. File `fix-rls-policies.sql` có sẵn trong project

---

### Lỗi 3: Trang hiển thị "Chưa có đề thi nào"

**Nguyên nhân**: Database trống

**Giải pháp**: Tạo bộ đề mới (xem **Bước 2**)

---

### Lỗi 4: API trả về `questionSets: []` nhưng database có dữ liệu

**Nguyên nhân**: RLS policies đang chặn

**Giải pháp**:

```sql
-- Trong Supabase SQL Editor
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
```

---

## 📞 Vẫn chưa được?

### Debug chi tiết:

1. **Check Supabase connection:**

Vào `http://localhost:3000/api/test-db` (nếu có endpoint này)

2. **Check database tables:**

```sql
-- Trong Supabase SQL Editor
SELECT
  (SELECT COUNT(*) FROM question_sets) as total_sets,
  (SELECT COUNT(*) FROM questions) as total_questions;
```

3. **Check user permissions:**

```sql
-- Kiểm tra user admin
SELECT id, email, role FROM users WHERE role = 'admin';
```

4. **Enable verbose logging:**

Thêm vào file `.env.local`:

```
NODE_ENV=development
DEBUG=*
```

---

## ✅ Checklist cuối cùng

Trước khi báo lỗi, đảm bảo:

- [ ] Dev server đang chạy (`npm run dev`)
- [ ] Database có ít nhất 1 bộ đề với câu hỏi
- [ ] RLS đã tắt cho `question_sets` và `questions`
- [ ] Environment variables đúng trong `.env.local`
- [ ] Đã restart server sau khi sửa `.env.local`
- [ ] API `/api/practice/question-sets` trả về dữ liệu
- [ ] Không có lỗi trong browser console
- [ ] Không có lỗi trong terminal logs

---

## 🎯 Quick Fix (Nhanh nhất)

```bash
# 1. Stop server
Ctrl+C

# 2. Tắt RLS (trong Supabase SQL Editor)
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

# 3. Restart server
npm run dev

# 4. Tạo bộ đề mới (nếu chưa có):
# - Đăng nhập admin
# - Vào /admin/question-sets
# - Tạo bộ đề + thêm câu hỏi

# 5. Reload trang /practice
```

---

**Last Updated**: 2024-10-16  
**Status**: ✅ Active
