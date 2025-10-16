# 🚀 Vercel Deployment Guide - Fix "Không thấy bộ đề"

## ❌ Vấn đề

Deploy lên Vercel thành công nhưng trang `/practice` không hiển thị bộ đề.

## 🎯 Nguyên nhân & Giải pháp

### **1. Environment Variables chưa được set** ⚠️ QUAN TRỌNG NHẤT

#### Kiểm tra:

1. Vào **Vercel Dashboard**
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**
4. Kiểm tra có các biến này chưa:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

#### Nếu CHƯA có, thêm ngay:

1. Mở **Supabase Dashboard**
2. Vào **Settings** → **API**
3. Copy các giá trị:

**Trên Vercel, thêm:**

| Name                            | Value                       | Environments                     |
| ------------------------------- | --------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...`                | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbGc...`                | Production, Preview, Development |

⚠️ **LƯU Ý:**

- Chọn **ALL** environments (Production, Preview, Development)
- Click **Save** sau mỗi biến

#### Sau khi thêm:

**BẮT BUỘC phải Redeploy:**

```
Vercel Dashboard → Deployments → Latest → ... menu → Redeploy
```

Hoặc:

```bash
# Push commit mới
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

### **2. Fix Fetch URL trong Production** 🔧

**Vấn đề:** Code hiện tại:

```typescript
const url = `${
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
}/api/practice/question-sets`;
```

Khi deploy lên Vercel:

- `NEXT_PUBLIC_BASE_URL` có thể không được set
- Fallback về `localhost:3000` → **LỖI**!

**Giải pháp:** Dùng relative path thay vì full URL

---

### **3. RLS vẫn đang BẬT trên Supabase** 🔒

#### Kiểm tra:

1. Vào **Supabase Dashboard**
2. Vào **SQL Editor**
3. Chạy query:

```sql
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('question_sets', 'questions');
```

#### Nếu `rowsecurity = true`:

**Tắt ngay:**

```sql
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers DISABLE ROW LEVEL SECURITY;
```

---

### **4. Database có dữ liệu chưa?** 📊

Kiểm tra trong **Supabase Table Editor**:

```sql
SELECT
  (SELECT COUNT(*) FROM question_sets) as total_sets,
  (SELECT COUNT(*) FROM questions) as total_questions;
```

Nếu `total_sets = 0`:

- Tạo bộ đề qua admin panel
- Hoặc import dữ liệu từ local

---

## 🔧 Fix Code (Khuyến nghị)

### **Option 1: Sử dụng Absolute Path (Khuyến nghị)** ⭐

Sửa file `src/app/practice/page.tsx`:

```typescript
async function getQuestionSets() {
  try {
    console.log("Fetching question sets from API...");

    // ✅ Dùng absolute path thay vì full URL
    // Hoạt động cho cả local và production
    const url = "/api/practice/question-sets";

    console.log("API URL:", url);

    const res = await fetch(url, {
      cache: "no-store",
      // ✅ Thêm headers nếu cần
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ... rest of the code
  } catch (error) {
    console.error("Error fetching question sets:", error);
    return [];
  }
}
```

**Tại sao dùng absolute path?**

- ✅ Hoạt động tốt trên Vercel
- ✅ Next.js tự động resolve URL
- ✅ Không cần config `NEXT_PUBLIC_BASE_URL`

---

### **Option 2: Dùng Dynamic Base URL**

Nếu muốn giữ full URL:

```typescript
async function getQuestionSets() {
  try {
    // ✅ Tự động detect base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");

    const url = `${baseUrl}/api/practice/question-sets`;

    // ... rest of the code
  } catch (error) {
    console.error("Error fetching question sets:", error);
    return [];
  }
}
```

Và set trên Vercel:

```
NEXT_PUBLIC_BASE_URL = https://your-app.vercel.app
```

---

## 🐛 Debug trên Vercel

### **1. Xem Logs:**

**Real-time logs:**

```
Vercel Dashboard → Project → Logs
```

Hoặc dùng CLI:

```bash
npm i -g vercel
vercel logs
```

### **2. Check Environment Variables:**

```bash
vercel env ls
```

### **3. Test API trực tiếp:**

Mở browser:

```
https://your-app.vercel.app/api/practice/question-sets
```

Phải trả về:

```json
{
  "questionSets": [...],
  "total": X,
  "success": true
}
```

Nếu trả về lỗi:

```json
{
  "error": "Database not configured",
  "questionSets": [],
  "total": 0
}
```

→ **Environment variables chưa được set!**

---

## ✅ Checklist Deploy Vercel

Trước khi deploy, đảm bảo:

### **Bước 1: Supabase**

- [ ] RLS đã tắt cho `question_sets` và `questions`
- [ ] Database có ít nhất 1 bộ đề với câu hỏi
- [ ] Copy đúng 3 keys: URL, anon key, service role key

### **Bước 2: Vercel Environment Variables**

- [ ] `NEXT_PUBLIC_SUPABASE_URL` đã set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` đã set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` đã set
- [ ] Tất cả chọn **ALL environments**

### **Bước 3: Code**

- [ ] Sử dụng absolute path (`/api/...`) thay vì full URL
- [ ] Hoặc set `NEXT_PUBLIC_BASE_URL` đúng

### **Bước 4: Redeploy**

- [ ] Redeploy sau khi thêm env vars
- [ ] Đợi deployment thành công (màu xanh)

### **Bước 5: Test**

- [ ] Test API: `https://your-app.vercel.app/api/practice/question-sets`
- [ ] Test Page: `https://your-app.vercel.app/practice`
- [ ] Check Vercel Logs nếu có lỗi

---

## 🚀 Quick Fix (Nhanh nhất)

```bash
# 1. Tắt RLS trên Supabase
# (Chạy trong Supabase SQL Editor)
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

# 2. Thêm Environment Variables trên Vercel
# → Settings → Environment Variables
# → Thêm 3 biến từ Supabase
# → Chọn ALL environments

# 3. Redeploy
# → Vercel Dashboard → Redeploy
# Hoặc:
git commit --allow-empty -m "Redeploy with env vars"
git push

# 4. Đợi 1-2 phút
# 5. Test: https://your-app.vercel.app/practice
```

---

## 🔍 Lỗi phổ biến

### **Lỗi 1: "Database not configured"**

**Nguyên nhân:** Environment variables chưa có trên Vercel

**Giải pháp:**

1. Thêm env vars trên Vercel
2. **BẮT BUỘC Redeploy**

---

### **Lỗi 2: API trả về `questionSets: []`**

**Nguyên nhân:**

- RLS đang chặn
- Hoặc database trống

**Giải pháp:**

1. Tắt RLS (xem trên)
2. Tạo bộ đề nếu database trống

---

### **Lỗi 3: "Failed to fetch"**

**Nguyên nhân:** Fetch URL không đúng

**Giải pháp:** Sử dụng absolute path (`/api/...`)

---

### **Lỗi 4: "This page could not be found"**

**Nguyên nhân:** Build error hoặc routing issue

**Giải pháp:**

1. Check Vercel build logs
2. Test local: `npm run build && npm start`

---

## 📊 So sánh Local vs Vercel

| Aspect      | Local Dev           | Vercel Production     |
| ----------- | ------------------- | --------------------- |
| Environment | `.env.local`        | Vercel Settings       |
| Base URL    | `localhost:3000`    | `your-app.vercel.app` |
| Logs        | Terminal            | Vercel Dashboard      |
| Hot Reload  | ✅                  | ❌ (phải redeploy)    |
| Cache       | Dev mode (no cache) | Edge cache            |

---

## 💡 Best Practices

### **1. Luôn dùng Absolute Paths cho API calls**

```typescript
// ✅ GOOD
fetch("/api/practice/question-sets");

// ❌ BAD
fetch("http://localhost:3000/api/practice/question-sets");
```

### **2. Log errors để debug**

```typescript
console.log("Fetching from:", url);
console.log("Response:", data);
console.error("Error:", error);
```

### **3. Set tất cả env vars cho ALL environments**

### **4. Test API endpoint trước khi test UI**

```
https://your-app.vercel.app/api/practice/question-sets
```

### **5. Dùng Vercel CLI để debug**

```bash
vercel logs --follow
```

---

## 📱 Contact Support

Nếu vẫn không được sau khi làm tất cả:

1. **Check Vercel Status**: https://www.vercel-status.com
2. **Supabase Status**: https://status.supabase.com
3. **Vercel Support**: support@vercel.com

---

## 🎯 TL;DR (Too Long, Didn't Read)

```bash
# 1. Tắt RLS trên Supabase SQL Editor
ALTER TABLE question_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

# 2. Thêm 3 env vars trên Vercel (Settings → Env Vars)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# 3. Redeploy (Deployments → Redeploy)

# 4. Test: https://your-app.vercel.app/api/practice/question-sets
```

---

**Last Updated**: 2024-10-16  
**Status**: ✅ Production Ready  
**Vercel Version**: Latest
