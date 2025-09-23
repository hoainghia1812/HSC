# 🚀 Hướng dẫn Setup Dự án TracNghiem

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt dependencies](#cài-đặt-dependencies)
- [Cấu hình Supabase](#cấu-hình-supabase)
- [Chạy dự án](#chạy-dự-án)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)

## 🔧 Yêu cầu hệ thống

- Node.js 18.0 trở lên
- npm hoặc yarn
- Tài khoản Supabase

## 📦 Cài đặt dependencies

Bạn đã cài sẵn Next.js, Tailwind CSS và Supabase. Nếu cần thêm dependencies:

```bash
# Cài thêm các package cần thiết
npm install @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
npm install clsx tailwind-merge
npm install lucide-react # Cho icons
npm install @headlessui/react # Cho UI components nâng cao
```

## ⚙️ Cấu hình Supabase

1. **Tạo project Supabase:**

   - Truy cập [supabase.com](https://supabase.com)
   - Tạo project mới
   - Lấy URL và API keys

2. **Tạo file `.env.local`:**

   ```bash
   cp .env.example .env.local
   ```

3. **Cập nhật `.env.local`:**

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Tạo bảng profiles trong Supabase:**

   ```sql
   -- Chạy script này trong Supabase SQL Editor
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     full_name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Profiles are viewable by users who created them" ON profiles
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can update their own profiles" ON profiles
     FOR UPDATE USING (auth.uid() = user_id);
   ```

## 🚀 Chạy dự án

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📁 Cấu trúc thư mục

```
my-app/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── (auth)/            # Auth routes group
│   │   │   └── login/
│   │   ├── (dashboard)/       # Dashboard routes group
│   │   │   └── dashboard/
│   │   ├── api/               # API routes
│   │   │   └── auth/
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── common/           # Common components
│   │   ├── forms/            # Form components
│   │   │   └── LoginForm.tsx
│   │   ├── layouts/          # Layout components
│   │   │   └── MainLayout.tsx
│   │   └── modals/           # Modal components
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.ts
│   ├── lib/                  # Libraries and configurations
│   │   └── supabase.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── database.ts
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   └── index.ts
│   ├── constants/            # Constants and configurations
│   │   └── index.ts
│   ├── stores/               # State management (Zustand/Redux)
│   ├── styles/               # Additional styles
│   ├── data/                 # Static data and mocks
│   └── middleware.ts         # Next.js middleware
├── public/                   # Static assets
├── docs/                     # Documentation
└── package.json
```

## 🎨 Design System

Dự án sử dụng design system với:

- **Màu sắc:** Gradient từ blue đến purple, tông màu nhẹ nhàng
- **Typography:** Inter font với Vietnamese support
- **Components:** Các component UI tái sử dụng với Tailwind CSS
- **Animations:** Smooth transitions và hover effects

## 🔒 Authentication Flow

1. User đăng ký/đăng nhập qua Supabase Auth
2. Middleware kiểm tra session cho protected routes
3. Auth hooks quản lý user state
4. Auto redirect dựa trên auth status

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible layouts với CSS Grid và Flexbox

## 🛠️ Development Tips

1. **Component Development:**

   - Tạo component trong `src/components/ui/` cho basic UI
   - Sử dụng `cn()` utility để merge Tailwind classes

2. **Type Safety:**

   - Cập nhật `src/types/database.ts` khi thay đổi DB schema
   - Sử dụng TypeScript để đảm bảo type safety

3. **Styling:**
   - Ưu tiên Tailwind CSS utilities
   - Tạo custom components cho UI patterns phức tạp

## 🐛 Troubleshooting

**Lỗi Supabase connection:**

- Kiểm tra `.env.local` có đúng keys không
- Đảm bảo Supabase project đang active

**Build errors:**

- Chạy `npm run build` để check TypeScript errors
- Kiểm tra imports và exports

**Styling issues:**

- Xóa `.next` folder và restart dev server
- Kiểm tra Tailwind config

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

✨ **Happy Coding!** Nếu có câu hỏi, tạo issue hoặc liên hệ team phát triển.
