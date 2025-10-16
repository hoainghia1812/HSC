# ✅ Checklist Deploy Vercel - Fix "Không thấy bộ đề"

## 🎯 Các bước thực hiện (5-10 phút)

### **BƯỚC 1: Tắt RLS trên Supabase** 🔒

1. Mở **Supabase Dashboard**: https://app.supabase.com
2. Chọn project của bạn
3. Vào **SQL Editor** (bên trái)
4. Paste và chạy script này:

```sql
-- Tắt Row Level Security
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers DISABLE ROW LEVEL SECURITY;

-- Kiểm tra kết quả
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('question_sets', 'questions');
```

**Kết quả mong đợi:**

```
tablename       | rowsecurity
----------------|------------
question_sets   | false
questions       | false
```

✅ **Done!**

---

### **BƯỚC 2: Copy Environment Variables từ Supabase** 📋

1. Vẫn ở **Supabase Dashboard**
2. Vào **Settings** → **API** (bên trái dưới)
3. Scroll xuống phần **Project API keys**

**Copy 3 giá trị này:**

| Tên              | Giá trị                     | Vị trí                                             |
| ---------------- | --------------------------- | -------------------------------------------------- |
| **URL**          | `https://xxxxx.supabase.co` | Project URL                                        |
| **anon public**  | `eyJhbGc...`                | anon / public (key bên trái)                       |
| **service_role** | `eyJhbGc...`                | service_role (key bên phải, click "Reveal" để xem) |

⚠️ **Lưu ý:**

- Không share **service_role** key công khai!
- Copy đầy đủ, không bỏ sót ký tự nào

---

### **BƯỚC 3: Thêm Environment Variables trên Vercel** 🚀

1. Mở **Vercel Dashboard**: https://vercel.com
2. Chọn project của bạn
3. Vào **Settings** (tab ở trên)
4. Vào **Environment Variables** (bên trái)
5. Thêm **3 biến** sau:

#### **Biến 1:**

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co  (từ Supabase)
Environments: ✅ Production ✅ Preview ✅ Development
```

Click **Save**

#### **Biến 2:**

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc...  (anon key từ Supabase)
Environments: ✅ Production ✅ Preview ✅ Development
```

Click **Save**

#### **Biến 3:**

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGc...  (service_role key từ Supabase)
Environments: ✅ Production ✅ Preview ✅ Development
```

Click **Save**

✅ **Done! Bạn sẽ thấy 3 biến trong danh sách**

---

### **BƯỚC 4: Commit & Push Code mới** 💻

Code đã được fix để hoạt động trên Vercel!

```bash
# Trong terminal
cd f:\TracNghiem\my-app

git add .
git commit -m "Fix: Use absolute path for API calls on Vercel"
git push
```

**Vercel sẽ tự động deploy!**

---

### **BƯỚC 5: Đợi Deploy xong** ⏳

1. Vào **Vercel Dashboard** → **Deployments**
2. Xem deployment mới nhất
3. Đợi đến khi:
   - Status: ✅ **Ready** (màu xanh)
   - Build: ✅ **Success**

Thời gian: ~1-3 phút

---

### **BƯỚC 6: Test kết quả** 🎉

#### **Test 1: Kiểm tra API**

Mở browser:

```
https://your-app.vercel.app/api/practice/question-sets
```

**Kết quả mong đợi:**

```json
{
  "questionSets": [
    {
      "id": "uuid...",
      "title": "Tên bộ đề",
      "questionCount": 10,
      "created_at": "2024-..."
    }
  ],
  "total": 1,
  "success": true
}
```

✅ **Nếu thấy data** → API hoạt động!

❌ **Nếu thấy `questionSets: []`**:

- Database chưa có dữ liệu
- Hoặc RLS chưa tắt
- Quay lại **Bước 1**

❌ **Nếu thấy `"error": "Database not configured"`**:

- Environment variables chưa đúng
- Quay lại **Bước 3**
- **QUAN TRỌNG:** Sau khi sửa env vars, phải **Redeploy** (xem Bước 7)

#### **Test 2: Kiểm tra trang Practice**

Mở browser:

```
https://your-app.vercel.app/practice
```

**Phải thấy:**

- ✨ Các card bộ đề đẹp mắt
- 📊 Stats: Số bộ đề, câu hỏi
- 🔍 Search bar

---

### **BƯỚC 7: Troubleshooting (nếu cần)** 🔧

#### **Nếu vẫn thấy "Chưa có đề thi nào":**

**A. Kiểm tra Vercel Logs:**

1. Vercel Dashboard → **Logs** (tab trên)
2. Filter: **All** hoặc **Errors**
3. Tìm errors liên quan đến:
   - `Database not configured`
   - `Failed to fetch`
   - `Supabase`

**B. Redeploy thủ công:**

Nếu đã thêm env vars nhưng quên redeploy:

1. Vercel Dashboard → **Deployments**
2. Click vào deployment mới nhất
3. Click **... (3 dots)** → **Redeploy**
4. Chọn **Use existing Build Cache**: ❌ **KHÔNG check**
5. Click **Redeploy**

**C. Kiểm tra Database có dữ liệu:**

Trong **Supabase SQL Editor**:

```sql
SELECT
  (SELECT COUNT(*) FROM question_sets) as total_sets,
  (SELECT COUNT(*) FROM questions) as total_questions;
```

Nếu `total_sets = 0`:

- Database trống!
- Phải tạo bộ đề:
  - Login admin: `https://your-app.vercel.app/login`
  - Vào: `https://your-app.vercel.app/admin/question-sets`
  - Tạo bộ đề + thêm câu hỏi

---

## 🎯 Quick Reference

### **Environment Variables cần thiết:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### **SQL Script tắt RLS:**

```sql
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
```

### **Test URLs:**

- API: `https://your-app.vercel.app/api/practice/question-sets`
- Page: `https://your-app.vercel.app/practice`
- Admin: `https://your-app.vercel.app/admin/question-sets`

---

## 📞 Still Having Issues?

### **Check Vercel Build Logs:**

```
Vercel Dashboard → Deployments → Latest → Building
```

Look for errors during:

- ✅ **Installing dependencies**
- ✅ **Building**
- ✅ **Deploying**

### **Check Supabase Connection:**

Test trong Supabase SQL Editor:

```sql
-- Kiểm tra connection
SELECT NOW();

-- Kiểm tra tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Kiểm tra data
SELECT * FROM question_sets LIMIT 5;
```

### **Common Errors:**

| Error                     | Cause                   | Solution                |
| ------------------------- | ----------------------- | ----------------------- |
| "Database not configured" | Env vars missing        | Add env vars + redeploy |
| `questionSets: []`        | RLS blocking or no data | Disable RLS + add data  |
| "Failed to fetch"         | Network issue           | Check Vercel logs       |
| 404 on /practice          | Build error             | Check build logs        |

---

## ✅ Final Checklist

Trước khi báo lỗi, đảm bảo:

- [ ] RLS đã tắt cho tất cả tables
- [ ] 3 env vars đã thêm trên Vercel (với ALL environments)
- [ ] Code đã được push (commit mới)
- [ ] Vercel đã deploy xong (status = Ready)
- [ ] API endpoint trả về data: `/api/practice/question-sets`
- [ ] Database có ít nhất 1 bộ đề với câu hỏi
- [ ] Đã đợi ít nhất 2-3 phút sau khi deploy

---

## 🎉 Success!

Nếu tất cả đúng, bạn sẽ thấy:

✅ Trang `/practice` hiển thị đầy đủ bộ đề  
✅ Design đẹp với gradient cards  
✅ Search bar hoạt động  
✅ Pagination mượt mà  
✅ Stats hiển thị chính xác

**Congratulations! 🎊**

---

**Created**: 2024-10-16  
**Version**: 1.0  
**Status**: ✅ Production Ready
