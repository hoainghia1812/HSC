'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthUser } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData) as AuthUser
      setUser(parsedUser)
    } catch {
      router.push('/login')
      return
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    // Clear cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ST</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SecuriTest Dashboard</h1>
                <p className="text-sm text-gray-600">Quản lý học tập của bạn</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Chào mừng trở lại, {user.full_name}! 👋
          </h2>
          <p className="text-green-100">
            Hãy tiếp tục hành trình chinh phục chứng chỉ chứng khoán của bạn
          </p>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Họ và tên:</span>
                <p className="text-gray-900">{user.full_name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Số điện thoại:</span>
                <p className="text-gray-900">{user.phone}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Vai trò:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role.startsWith('vip') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'admin' ? 'Quản trị viên' :
                   user.role === 'vip1' ? 'VIP 1' :
                   user.role === 'vip2' ? 'VIP 2' :
                   user.role === 'vip3' ? 'VIP 3' :
                   'Người dùng'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiến độ học tập</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Bài thi đã hoàn thành</span>
                  <span>0/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Điểm trung bình</span>
                  <span>--</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thành tích</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bài thi hoàn thành</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Điểm cao nhất</span>
                <span className="font-semibold">--</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thời gian học</span>
                <span className="font-semibold">0h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Hành động nhanh</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-medium text-gray-900">Bắt đầu luyện tập</h4>
              <p className="text-sm text-gray-600">Ôn tập câu hỏi theo chủ đề</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-medium text-gray-900">Thi thử</h4>
              <p className="text-sm text-gray-600">Kiểm tra kiến thức với đề thi thật</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-900">Xem kết quả</h4>
              <p className="text-sm text-gray-600">Theo dõi tiến độ và điểm số</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-left">
              <div className="text-2xl mb-2">🏆</div>
              <h4 className="font-medium text-gray-900">Chứng chỉ</h4>
              <p className="text-sm text-gray-600">Quản lý chứng chỉ đã đạt được</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
