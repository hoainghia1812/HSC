# 🔧 Khắc phục vấn đề: User không thấy bộ đề mà Admin tạo

## 📋 Mô tả vấn đề

Khi admin tạo một bộ đề mới, người dùng thông thường đăng nhập vào không thể thấy bộ đề đó trong trang `/practice`.

## 🔍 Nguyên nhân

**Row Level Security (RLS)** của Supabase đang chặn quyền truy cập.

### Chi tiết:

1. **Supabase mặc định BẬT RLS** cho tất cả các bảng
2. Khi RLS được bật nhưng **không có policies**, không ai có thể truy cập dữ liệu (trừ service role key)
3. Mặc dù API của bạn đang dùng `supabaseAdmin` với service role key (có thể bypass RLS), nhưng có thể:
   - RLS policies đang conflict
   - Hoặc có vấn đề với cách Supabase xử lý RLS trong một số trường hợp

## ✅ Giải pháp

### Bước 1: Kiểm tra RLS trong Supabase Dashboard

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Database** → **Tables**
4. Kiểm tra bảng `question_sets` và `questions`
5. Xem có thông báo "RLS is enabled" không

### Bước 2: Chạy Script SQL để fix

#### **Option 1: TẮT RLS (Khuyến nghị)** ⭐

Vì ứng dụng đang dùng custom JWT authentication (không dùng Supabase Auth), cách đơn giản nhất là **TẮT RLS hoàn toàn**.

1. Mở **Supabase Dashboard**
2. Vào **SQL Editor**
3. Chạy script sau:

```sql
-- Tắt RLS cho tất cả các bảng
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers DISABLE ROW LEVEL SECURITY;
```

**LƯU Ý:** Việc tắt RLS an toàn trong trường hợp này vì:

- Tất cả authentication/authorization đã được xử lý ở API layer
- API sử dụng service role key với `supabaseAdmin`
- Không có public endpoints trực tiếp query database

#### **Option 2: GIỮ RLS và tạo policies cho phép tất cả** (Nếu muốn giữ RLS)

Nếu bạn vẫn muốn giữ RLS (cho tương lai), có thể tạo policies cho phép tất cả:

```sql
-- Enable RLS
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Xóa policies cũ (nếu có)
DROP POLICY IF EXISTS "Anyone can view question sets" ON question_sets;
DROP POLICY IF EXISTS "Anyone can view questions" ON questions;

-- Tạo policies mới cho phép mọi thao tác
-- Vì authorization đã được handle ở API layer
CREATE POLICY "Allow all on question_sets"
    ON question_sets
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all on questions"
    ON questions
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

### Bước 3: Chạy Script có sẵn

Tôi đã tạo sẵn file `fix-rls-policies.sql` trong thư mục `my-app/`.

**Cách sử dụng:**

1. Mở file `fix-rls-policies.sql`
2. Copy toàn bộ nội dung
3. Vào **Supabase Dashboard** → **SQL Editor**
4. Paste và chạy script

Script này sẽ:

- Xóa tất cả policies cũ (nếu có)
- **TẮT RLS** cho tất cả các bảng (mặc định)
- Có option để BẬT RLS với policies cho phép tất cả (nếu cần)

### Bước 4: Kiểm tra kết quả

Sau khi chạy script:

1. **Trong Supabase SQL Editor**, chạy query này để verify:

```sql
-- Kiểm tra RLS status
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'question_sets', 'questions', 'user_results', 'user_answers');
```

Kết quả mong muốn: `rowsecurity = false` cho tất cả các bảng

2. **Test trong ứng dụng:**
   - Admin: Tạo một bộ đề mới
   - User: Đăng xuất và đăng nhập lại
   - Vào `/practice` → Phải thấy bộ đề mới

## 🎯 Tại sao giải pháp này hoạt động?

### Kiến trúc hiện tại:

```
Client → Next.js API Routes → Supabase Database
              ↓
     (Custom JWT Auth + Authorization logic)
              ↓
        supabaseAdmin (service role key)
```

- **Authentication**: Xử lý bằng JWT custom (không dùng Supabase Auth)
- **Authorization**: Logic check role ở API layer
- **Database access**: Tất cả requests đi qua `supabaseAdmin` với service role key

### Khi TẮT RLS:

✅ `supabaseAdmin` có toàn quyền truy cập database  
✅ Không có conflict với policies  
✅ Đơn giản, dễ maintain  
✅ An toàn vì không có public database access

## 🔐 Bảo mật

**Có an toàn không khi tắt RLS?**

✅ **AN TOÀN** trong trường hợp này vì:

1. **Không có public database access**

   - Frontend không trực tiếp query Supabase
   - Tất cả requests đi qua Next.js API routes

2. **Authentication/Authorization ở API layer**

   - Mỗi API route đã có logic check token
   - Admin routes yêu cầu role = 'admin'
   - User routes có các kiểm tra phù hợp

3. **Service Role Key được bảo vệ**
   - Key chỉ dùng ở server-side (API routes)
   - Không expose ra client
   - Lưu trong `.env.local` (không commit)

### Nếu muốn tăng cường bảo mật trong tương lai:

Có thể migrate sang **Supabase Auth** thay vì custom JWT:

- RLS policies sẽ hoạt động tốt hơn với `auth.uid()`
- Tích hợp tốt với Supabase ecosystem
- Có nhiều tính năng built-in (password reset, email verification, etc.)

## 📝 Checklist sau khi fix

- [ ] Chạy script `fix-rls-policies.sql` trong Supabase SQL Editor
- [ ] Verify RLS đã tắt (chạy query kiểm tra)
- [ ] Test: Admin tạo bộ đề mới
- [ ] Test: User có thể thấy bộ đề mới
- [ ] Update file `setup-database.sql` cho lần setup database tiếp theo
- [ ] Document quyết định này trong code comments

## 🆘 Nếu vẫn chưa được

### Debug steps:

1. **Kiểm tra logs:**

   ```bash
   # Xem server logs
   npm run dev
   ```

   - Xem console logs khi fetch `/api/practice/question-sets`
   - Tìm errors từ Supabase

2. **Kiểm tra network:**

   - Mở Chrome DevTools → Network tab
   - Gọi `/api/practice/question-sets`
   - Xem response trả về gì

3. **Kiểm tra trực tiếp trong database:**

   ```sql
   -- Trong Supabase SQL Editor
   SELECT id, title, created_at, created_by
   FROM question_sets
   ORDER BY created_at DESC;
   ```

   - Xác nhận bộ đề đã được tạo thành công

4. **Kiểm tra environment variables:**

   - Đảm bảo `SUPABASE_SERVICE_ROLE_KEY` đúng trong `.env.local`
   - Restart dev server sau khi thay đổi env vars

5. **Clear cache:**
   ```bash
   # Xóa .next folder và rebuild
   rm -rf .next
   npm run dev
   ```

---

## 📚 References

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Service Role Key](https://supabase.com/docs/guides/api/api-keys)
- [Next.js API Routes Security](https://nextjs.org/docs/api-routes/introduction)

---

**Cập nhật:** ${new Date().toLocaleDateString('vi-VN')}
