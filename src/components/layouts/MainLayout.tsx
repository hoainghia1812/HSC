'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Menu button on mobile (left side) */}
                {!loading && (
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 -ml-2 text-gray-600 hover:text-green-600 transition-colors"
                    aria-label="Toggle menu"
                  >
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      {mobileMenuOpen ? (
                        <path d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                )}
                
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">ST</span>
                </div>
                <Link href="/">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  SecuriTest
                </h1>
                </Link>
              </div>
              
              {/* Navigation - Desktop */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  href="/" 
                  className={cn(
                    "transition-colors",
                    pathname === '/' 
                      ? "text-green-600 font-semibold" 
                      : "text-gray-600 hover:text-green-600"
                  )}
                >
                  Trang chủ
                </Link>
                <Link 
                  href="/certificates" 
                  className={cn(
                    "transition-colors",
                    pathname === '/certificates' 
                      ? "text-green-600 font-semibold" 
                      : "text-gray-600 hover:text-green-600"
                  )}
                >
                  Chứng chỉ
                </Link>
                <Link 
                  href="/about" 
                  className={cn(
                    "transition-colors",
                    pathname === '/about' 
                      ? "text-green-600 font-semibold" 
                      : "text-gray-600 hover:text-green-600"
                  )}
                >
                  Về chúng tôi
                </Link>
                {user && (
                  <>
                    <Link 
                      href="/practice" 
                      className={cn(
                        "transition-colors",
                        pathname?.startsWith('/practice') 
                          ? "text-green-600 font-semibold" 
                          : "text-gray-600 hover:text-green-600"
                      )}
                    >
                      Luyện tập
                    </Link>
                    <Link 
                      href="/exams" 
                      className={cn(
                        "transition-colors",
                        pathname?.startsWith('/exams') 
                          ? "text-green-600 font-semibold" 
                          : "text-gray-600 hover:text-green-600"
                      )}
                    >
                      Thi thử
                    </Link>
                  </>
                )}
              </nav>

              {/* User menu */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                ) : user ? (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* User Info */}
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    {/* User Avatar Dropdown */}
                    <div className="relative group">
                      <button className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm hover:shadow-lg transition-all">
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
                  <Link 
                    href="/login" 
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>

          </div>
        </header>
      )}

      {/* Sidebar Menu for logged out users on mobile */}
      {!user && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl md:hidden animate-slide-in-left">
            <div className="flex flex-col h-full">
              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }
                
                @keyframes slideInLeft {
                  from {
                    transform: translateX(-100%);
                  }
                  to {
                    transform: translateX(0);
                  }
                }
                
                .animate-fade-in {
                  animation: fadeIn 0.2s ease-out;
                }
                
                .animate-slide-in-left {
                  animation: slideInLeft 0.3s ease-out;
                }
              `}</style>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ST</span>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    SecuriTest
                  </h2>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  <Link 
                    href="/" 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                      pathname === '/' 
                        ? "text-green-600 bg-green-50 font-semibold" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">🏠</span>
                    <span className="font-medium">Trang chủ</span>
                  </Link>
                  
                  <Link 
                    href="/certificates" 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                      pathname === '/certificates' 
                        ? "text-green-600 bg-green-50 font-semibold" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">📋</span>
                    <span className="font-medium">Chứng chỉ</span>
                  </Link>

                  <Link 
                    href="/about" 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                      pathname === '/about' 
                        ? "text-green-600 bg-green-50 font-semibold" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">✨</span>
                    <span className="font-medium">Về chúng tôi</span>
                  </Link>
                </div>
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t bg-gray-50">
                    <Link 
                      href="/login" 
                  className="block w-full mb-2 px-4 py-2.5 text-center text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      href="/register" 
                  className="block w-full px-4 py-2.5 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                    >
                  Đăng ký ngay
                    </Link>
              </div>
            </div>
          </div>
                  </>
                )}

      {/* Sidebar Menu for logged in users on mobile */}
      {user && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl md:hidden animate-slide-in-left">
            <div className="flex flex-col h-full">
              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }
                
                @keyframes slideInLeft {
                  from {
                    transform: translateX(-100%);
                  }
                  to {
                    transform: translateX(0);
                  }
                }
                
                .animate-fade-in {
                  animation: fadeIn 0.2s ease-out;
                }
                
                .animate-slide-in-left {
                  animation: slideInLeft 0.3s ease-out;
                }
              `}</style>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ST</span>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    SecuriTest
                  </h2>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b bg-gradient-to-r from-green-50/50 to-blue-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  <div className="pb-2">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Menu chính
                    </p>
                  </div>

                  <Link 
                    href="/" 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                      pathname === '/' 
                        ? "text-green-600 bg-green-50 font-semibold" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">🏠</span>
                    <span className="font-medium">Trang chủ</span>
                  </Link>
                  
                  <Link 
                    href="/certificates" 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                      pathname === '/certificates' 
                        ? "text-green-600 bg-green-50 font-semibold" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">📋</span>
                    <span className="font-medium">Chứng chỉ</span>
                  </Link>

                  <Link 
                    href="/about" 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                      pathname === '/about' 
                        ? "text-green-600 bg-green-50 font-semibold" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">✨</span>
                    <span className="font-medium">Về chúng tôi</span>
                  </Link>

                  <Link 
                    href="/practice" 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                      pathname?.startsWith('/practice') 
                        ? "text-green-600 bg-green-50 font-semibold" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">📚</span>
                    <span className="font-medium">Luyện tập</span>
                  </Link>

                  <Link 
                    href="/exams" 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group",
                      pathname?.startsWith('/exams') 
                        ? "text-green-600 bg-green-50 font-semibold" 
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">📝</span>
                    <span className="font-medium">Thi thử</span>
                  </Link>
                </div>
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 text-center text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  <span className="text-lg">🚪</span>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={cn('flex-1', showSidebar && 'flex')}>
        {/* Sidebar */}
        {showSidebar && (
          <aside className="hidden lg:block w-64 bg-white border-r shadow-sm">
            <div className="p-6">
              <nav className="space-y-2">
                {/* Sidebar navigation will be added here */}
              </nav>
            </div>
          </aside>
        )}

        {/* Content */}
        <main className={cn('flex-1', showSidebar ? 'overflow-hidden' : 'w-full')}>
          {children}
        </main>
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="sm:col-span-2 lg:col-span-1">
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
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Chứng chỉ</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Hành nghề CK</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Quản lý quỹ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Phân tích CK</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Môi giới CK</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Hỗ trợ</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Báo lỗi</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Theo dõi chúng tôi</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Facebook</span>
                    <span className="text-xl">📘</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    <span className="text-xl">🐦</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Instagram</span>
                    <span className="text-xl">📷</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
              <p>&copy; 2024 SecuriTest. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
