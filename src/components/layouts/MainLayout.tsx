'use client'

import React from 'react'
import { cn } from '@/utils'

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
              
              {/* Navigation will be added here */}
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/home" className="text-gray-600 hover:text-green-600 transition-colors">
                  Trang chủ
                </a>
                <a href="/certificates" className="text-gray-600 hover:text-green-600 transition-colors">
                  Chứng chỉ
                </a>
                <a href="/practice" className="text-gray-600 hover:text-green-600 transition-colors">
                  Luyện tập
                </a>
                <a href="/exams" className="text-gray-600 hover:text-green-600 transition-colors">
                  Thi thử
                </a>
              </nav>

              {/* User menu will be added here */}
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                  Đăng nhập
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Đăng ký
                </button>
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
