'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthUser } from '@/types'

interface UserResult {
  id: string
  user_id: string
  question_set_id: string
  total_questions: number
  correct_count: number
  wrong_count: number
  score: number
  taken_at: string
  question_sets: {
    id: string
    title: string
  }
}

interface DashboardStats {
  totalTests: number
  totalQuestions: number
  totalCorrect: number
  totalWrong: number
  averageScore: number
  highestScore: number
  lowestScore: number
  accuracyRate: number
  recentTestsCount: number
  trend: 'up' | 'down' | 'stable'
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<UserResult[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
      
      // Fetch dashboard data
      fetchDashboardData(token)
    } catch {
      router.push('/login')
      return
    }
  }, [router, currentPage])

  const fetchDashboardData = async (token: string) => {
    setLoading(true)
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      // Fetch results
      const resultsResponse = await fetch(`/api/dashboard/results?page=${currentPage}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json()
        setResults(resultsData.results)
        setTotalPages(resultsData.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50'
    if (score >= 60) return 'text-blue-600 bg-blue-50'
    if (score >= 40) return 'text-amber-600 bg-amber-50'
    return 'text-rose-600 bg-rose-50'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return '🏆 Xuất sắc'
    if (score >= 60) return '⭐ Khá'
    if (score >= 40) return '📚 Trung bình'
    return '💪 Cần cố gắng'
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈'
    if (trend === 'down') return '📉'
    return '➡️'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ST</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SecuriTest Dashboard
                </h1>
                <p className="text-sm text-gray-600">Quản lý học tập của bạn</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 text-rose-600 border-2 border-rose-500 rounded-xl hover:bg-rose-50 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl p-8 text-white mb-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-3">
            Chào mừng trở lại, {user.full_name}! 👋
          </h2>
          <p className="text-purple-100 text-lg">
            Hãy tiếp tục hành trình chinh phục chứng chỉ chứng khoán của bạn
          </p>
          {stats && stats.trend && (
            <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-2xl mr-2">{getTrendIcon(stats.trend)}</span>
              <span className="font-medium">
                {stats.trend === 'up' ? 'Tiến bộ vượt bậc!' : 
                 stats.trend === 'down' ? 'Cần cố gắng thêm!' : 
                 'Giữ vững phong độ!'}
              </span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
                <span className="text-3xl">📝</span>
              </div>
              <span className="text-3xl font-bold text-purple-600">
                {stats?.totalTests || 0}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Bài thi đã làm</h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats?.recentTestsCount || 0} bài trong 7 ngày qua
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                <span className="text-3xl">📊</span>
              </div>
              <span className="text-3xl font-bold text-blue-600">
                {stats?.averageScore || 0}%
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Điểm trung bình</h3>
            <p className="text-sm text-gray-500 mt-1">
              Cao nhất: {stats?.highestScore || 0}%
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl">
                <span className="text-3xl">✅</span>
              </div>
              <span className="text-3xl font-bold text-emerald-600">
                {stats?.totalCorrect || 0}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Câu trả lời đúng</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tổng {stats?.totalQuestions || 0} câu hỏi
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-pink-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl">
                <span className="text-3xl">🎯</span>
              </div>
              <span className="text-3xl font-bold text-pink-600">
                {stats?.accuracyRate || 0}%
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Tỷ lệ chính xác</h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats?.totalWrong || 0} câu sai
            </p>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">📚</span>
              Lịch sử làm bài
            </h3>
            <p className="text-sm text-gray-600 mt-1">Chi tiết kết quả các bài thi của bạn</p>
          </div>

          {results.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-gray-600 text-lg mb-2">Chưa có kết quả làm bài nào</p>
              <p className="text-gray-500 text-sm">Hãy bắt đầu làm bài thi đầu tiên của bạn!</p>
              <button
                onClick={() => router.push('/practice')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              >
                Bắt đầu luyện tập
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Bộ câu hỏi
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Số câu
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Đúng
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Sai
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Điểm
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Xếp loại
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {results.map((result, index) => (
                      <tr 
                        key={result.id}
                        className="hover:bg-purple-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {result.question_sets?.title || 'Không có tiêu đề'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-semibold text-gray-900">
                            {result.total_questions}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
                            ✓ {result.correct_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-700">
                            ✗ {result.wrong_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-4 py-2 rounded-xl text-lg font-bold ${getScoreColor(result.score)}`}>
                            {result.score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium">
                            {getScoreBadge(result.score)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(result.taken_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      ← Trang trước
                    </button>
                    <span className="text-sm text-gray-700">
                      Trang <span className="font-semibold">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Trang sau →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">🚀</span>
            Hành động nhanh
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push('/practice')}
              className="group p-6 border-2 border-purple-200 rounded-2xl hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg"
            >
              <div className="text-4xl mb-3">📚</div>
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600">Bắt đầu luyện tập</h4>
              <p className="text-sm text-gray-600">Ôn tập câu hỏi theo chủ đề</p>
            </button>
            
            <button 
              onClick={() => router.push('/practice')}
              className="group p-6 border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg"
            >
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">Thi thử</h4>
              <p className="text-sm text-gray-600">Kiểm tra kiến thức với đề thi thật</p>
            </button>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group p-6 border-2 border-emerald-200 rounded-2xl hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg"
            >
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600">Xem kết quả</h4>
              <p className="text-sm text-gray-600">Theo dõi tiến độ và điểm số</p>
            </button>
            
            <button 
              onClick={() => router.push('/certificates')}
              className="group p-6 border-2 border-amber-200 rounded-2xl hover:border-amber-400 hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg"
            >
              <div className="text-4xl mb-3">🏆</div>
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600">Chứng chỉ</h4>
              <p className="text-sm text-gray-600">Quản lý chứng chỉ đã đạt được</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
