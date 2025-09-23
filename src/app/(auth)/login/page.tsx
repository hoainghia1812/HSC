import { LoginForm } from '@/components/forms/LoginForm'
import { MainLayout } from '@/components/layouts/MainLayout'

export default function LoginPage() {
  return (
    <MainLayout showHeader={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">TN</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TracNghiem
            </h1>
            <p className="text-gray-600 mt-2">Nền tảng trắc nghiệm online hiện đại</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  )
}

export const metadata = {
  title: 'Đăng nhập - TracNghiem',
  description: 'Đăng nhập vào tài khoản TracNghiem của bạn'
}
