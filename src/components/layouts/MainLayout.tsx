'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/utils'
import { AuthUser } from '@/types'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  showHeader?: boolean
  showFooter?: boolean
  showSidebar?: boolean
}

export function MainLayout({ 
  children, 
  className,
  showHeader = true,
  showFooter = true,
  showSidebar = false 
}: MainLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as AuthUser
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    // Clear cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    setUser(null)
    router.push('/')
  }
  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50',
      className
    )}>
      {/* Header */}
      {showHeader && (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ST</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  SecuriTest
                </h1>
              </div>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
                  Trang chủ
                </Link>
                <Link href="/certificates" className="text-gray-600 hover:text-green-600 transition-colors">
                  Chứng chỉ
                </Link>
                {user && (
                  <>
                    <Link href="/practice" className="text-gray-600 hover:text-green-600 transition-colors">
                      Luyện tập
                    </Link>
                    <Link href="/exams" className="text-gray-600 hover:text-green-600 transition-colors">
                      Thi thử
                    </Link>
                  </>
                )}
              </nav>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                ) : user ? (
                  <div className="flex items-center space-x-3">
                    {/* User Info */}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    {/* User Avatar Dropdown */}
                    <div className="relative group">
                      <button className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm hover:shadow-lg transition-all">
                        {user.full_name.charAt(0).toUpperCase()}
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          <Link 
                            href="/dashboard" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            📊 Dashboard
                          </Link>
                          <Link 
                            href="/profile" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            👤 Hồ sơ cá nhân
                          </Link>
                          {user.role === 'admin' && (
                            <Link 
                              href="/admin" 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              ⚙️ Quản trị
                            </Link>
                          )}
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            🚪 Đăng xuất
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      href="/register" 
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className={cn('flex-1', showSidebar && 'flex')}>
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-white border-r shadow-sm">
            <div className="p-6">
              <nav className="space-y-2">
                {/* Sidebar navigation will be added here */}
              </nav>
            </div>
          </aside>
        )}

        {/* Content */}
        <main className={cn('flex-1', showSidebar ? 'overflow-hidden' : 'container mx-auto px-4 py-8')}>
          {children}
        </main>
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded">
                    <span className="text-white font-bold text-xs flex items-center justify-center h-full">ST</span>
                  </div>
                  <span className="font-bold">SecuriTest</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Nền tảng ôn thi chứng khoán chuyên nghiệp, giúp bạn chinh phục mọi chứng chỉ.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Chứng chỉ</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Hành nghề CK</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Quản lý quỹ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Phân tích CK</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Môi giới CK</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Hỗ trợ</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Báo lỗi</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Theo dõi chúng tôi</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Facebook</span>
                    {/* Facebook icon */}
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    {/* Twitter icon */}
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Instagram</span>
                    {/* Instagram icon */}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 SecuriTest. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
