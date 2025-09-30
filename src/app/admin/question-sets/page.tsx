'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface QuestionSet {
  id: string
  title: string
  created_by: string
  creator_name: string
  question_count: number
  created_at: string
}

export default function AdminQuestionSets() {
  const router = useRouter()
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSetTitle, setNewSetTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'admin') {
        router.push('/dashboard')
        return
      }
    } catch (error) {
      console.error('Invalid token:', error)
      router.push('/login')
      return
    }

    fetchQuestionSets()
  }, [router])

  const fetchQuestionSets = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/admin/question-sets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setQuestionSets(data.questionSets || [])
      }
    } catch (error) {
      console.error('Failed to fetch question sets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createQuestionSet = async () => {
    if (!newSetTitle.trim()) {
      alert('Vui lòng nhập tên bộ đề')
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/admin/question-sets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newSetTitle.trim() })
      })

      if (response.ok) {
        setNewSetTitle('')
        setShowCreateForm(false)
        fetchQuestionSets()
      } else {
        alert('Có lỗi khi tạo bộ đề')
      }
    } catch (error) {
      console.error('Failed to create question set:', error)
      alert('Có lỗi khi tạo bộ đề')
    }
  }

  const deleteQuestionSet = async (setId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bộ đề này? Tất cả câu hỏi trong bộ đề cũng sẽ bị xóa.')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/question-sets/${setId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchQuestionSets()
      } else {
        alert('Có lỗi khi xóa bộ đề')
      }
    } catch (error) {
      console.error('Failed to delete question set:', error)
      alert('Có lỗi khi xóa bộ đề')
    }
  }

  const filteredQuestionSets = questionSets.filter(set =>
    set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.creator_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 mr-4">
                ← Quay lại Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📚 Quản lý Bộ đề</h1>
                <p className="text-gray-600 mt-1">Tổng cộng: {filteredQuestionSets.length} bộ đề</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Tạo bộ đề mới
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Tạo bộ đề mới</h3>
              <input
                type="text"
                placeholder="Nhập tên bộ đề..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                value={newSetTitle}
                onChange={(e) => setNewSetTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createQuestionSet()}
              />
              <div className="flex gap-2">
                <button
                  onClick={createQuestionSet}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tạo
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewSetTitle('')
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm bộ đề theo tên hoặc người tạo..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Question Sets Grid */}
        {filteredQuestionSets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestionSets.map((set) => (
              <div key={set.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{set.title}</h3>
                  <div className="flex gap-2 ml-2">
                    <Link
                      href={`/admin/questions?set=${set.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => deleteQuestionSet(set.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>👤 Tạo bởi: <span className="font-medium">{set.creator_name}</span></p>
                  <p>❓ Số câu hỏi: <span className="font-medium">{set.question_count}</span></p>
                  <p>📅 Ngày tạo: <span className="font-medium">{new Date(set.created_at).toLocaleDateString('vi-VN')}</span></p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/questions?set=${set.id}`}
                    className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded text-center text-sm transition-colors"
                  >
                    Quản lý câu hỏi
                  </Link>
                  <button
                    onClick={() => {
                      // Preview functionality could be added here
                      alert('Chức năng xem trước đang được phát triển')
                    }}
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded text-center text-sm transition-colors"
                  >
                    Xem trước
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bộ đề nào</h3>
            <p className="text-gray-600 mb-6">Hãy tạo bộ đề đầu tiên để bắt đầu!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              + Tạo bộ đề mới
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
