'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Question {
  id: string
  content: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: 'A' | 'B' | 'C' | 'D'
  created_at: string
}

interface QuestionSet {
  id: string
  title: string
}

const TinyMCEEditor = dynamic(
  () => import('@tinymce/tinymce-react').then((m) => m.Editor),
  { ssr: false }
)

export default function QuestionsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedSetId = searchParams.get('set')

  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A' as 'A' | 'B' | 'C' | 'D'
  })

  const ITEMS_PER_PAGE = 20

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

  useEffect(() => {
    if (selectedSetId) {
      setCurrentPage(1) // Reset to page 1 when changing question set
      fetchQuestions(selectedSetId)
    }
  }, [selectedSetId])

  useEffect(() => {
    // Reset to page 1 when search query changes
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    // Show/hide scroll to top button based on scroll position
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const fetchQuestions = async (setId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/questions?setId=${setId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    }
  }

  const createQuestion = async () => {
    if (!selectedSetId) {
      alert('Vui lòng chọn bộ đề')
      return
    }

    if (!newQuestion.content.trim() || !newQuestion.option_a.trim() || !newQuestion.option_b.trim() || !newQuestion.option_c.trim() || !newQuestion.option_d.trim()) {
      alert('Vui lòng nhập đầy đủ nội dung và 4 đáp án')
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_set_id: selectedSetId,
          content: newQuestion.content,
          option_a: newQuestion.option_a,
          option_b: newQuestion.option_b,
          option_c: newQuestion.option_c,
          option_d: newQuestion.option_d,
          correct_option: newQuestion.correct_option
        })
      })

      if (response.ok) {
        setNewQuestion({
          content: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_option: 'A'
        })
        setShowCreateForm(false)
        fetchQuestions(selectedSetId)
      } else {
        alert('Có lỗi khi tạo câu hỏi')
      }
    } catch (error) {
      console.error('Failed to create question:', error)
      alert('Có lỗi khi tạo câu hỏi')
    }
  }

  const updateQuestion = async () => {
    if (!editingQuestion) return

    if (!editingQuestion.content.trim() || !editingQuestion.option_a.trim() || !editingQuestion.option_b.trim() || !editingQuestion.option_c.trim() || !editingQuestion.option_d.trim()) {
      alert('Vui lòng nhập đầy đủ nội dung và 4 đáp án')
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editingQuestion.content,
          option_a: editingQuestion.option_a,
          option_b: editingQuestion.option_b,
          option_c: editingQuestion.option_c,
          option_d: editingQuestion.option_d,
          correct_option: editingQuestion.correct_option
        })
      })

      if (response.ok) {
        setShowEditForm(false)
        setEditingQuestion(null)
        if (selectedSetId) {
          fetchQuestions(selectedSetId)
        }
      } else {
        alert('Có lỗi khi cập nhật câu hỏi')
      }
    } catch (error) {
      console.error('Failed to update question:', error)
      alert('Có lỗi khi cập nhật câu hỏi')
    }
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok && selectedSetId) {
        fetchQuestions(selectedSetId)
      } else {
        alert('Có lỗi khi xóa câu hỏi')
      }
    } catch (error) {
      console.error('Failed to delete question:', error)
      alert('Có lỗi khi xóa câu hỏi')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Helper function to highlight search term in HTML content
  const highlightText = (html: string, searchTerm: string) => {
    if (!searchTerm.trim()) return html
    
    const query = searchTerm.trim()
    
    // Don't highlight if searching by question number
    const numberMatch = query.match(/^(?:câu|cau|câu hỏi|cau hoi)?\s*(\d+)$/i)
    if (numberMatch || /^\d+$/.test(query)) {
      return html
    }
    
    // Create a case-insensitive regex to find the search term
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    
    // Replace text nodes only, not HTML tags
    const div = document.createElement('div')
    div.innerHTML = html
    
    const highlightNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ''
        if (regex.test(text)) {
          const span = document.createElement('span')
          span.innerHTML = text.replace(regex, '<mark class="bg-yellow-200 font-semibold">$1</mark>')
          node.parentNode?.replaceChild(span, node)
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(highlightNode)
      }
    }
    
    Array.from(div.childNodes).forEach(highlightNode)
    return div.innerHTML
  }

  // Filter questions based on search query - keep original index
  const filteredQuestionsWithIndex = questions.map((question, index) => ({
    ...question,
    originalIndex: index
  })).filter((question) => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase().trim()
    const questionNumber = (question.originalIndex + 1).toString()
    
    // Check if searching by question number (e.g., "câu 1", "câu hỏi 15", or just "15")
    const numberMatch = query.match(/^(?:câu|cau|câu hỏi|cau hoi)?\s*(\d+)$/i)
    if (numberMatch) {
      const searchNumber = numberMatch[1]
      return questionNumber === searchNumber
    }
    
    // Also check for direct number match
    if (/^\d+$/.test(query)) {
      return questionNumber === query
    }
    
    // Create a temporary div to parse HTML and get text content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = question.content
    
    // Get text content (this automatically removes all HTML tags)
    const contentText = (tempDiv.textContent || tempDiv.innerText || '')
      .replace(/\s+/g, ' ')  // Replace multiple spaces/newlines with single space
      .trim()
      .toLowerCase()
    
    // Search only in content (not in options)
    return contentText.includes(query)
  })

  const filteredQuestions = filteredQuestionsWithIndex

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex)

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
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                title="Quay lại"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Câu hỏi</h1>
            </div>
            {selectedSetId && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Thêm câu hỏi
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Set Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn bộ đề để quản lý câu hỏi:
          </label>
          <select
            value={selectedSetId || ''}
            onChange={(e) => {
              const setId = e.target.value
              if (setId) {
                router.push(`/admin/questions?set=${setId}`)
              } else {
                router.push('/admin/questions')
              }
            }}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 font-medium"
          >
            
            {questionSets.map(set => (
              <option key={set.id} value={set.id}>{set.title}</option>
            ))}
          </select>
        </div>

        {/* Search Box */}
        {selectedSetId && questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="relative">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm: 'câu 1', '15' hoặc nội dung như 'Giá trị chào bán'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                Tìm thấy <span className="font-semibold text-indigo-600">{filteredQuestions.length}</span> câu hỏi
              </p>
            )}
          </div>
        )}

        {/* Create Question Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Thêm câu hỏi mới</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung câu hỏi:</label>
                  {/** TinyMCE rich text editor for question content */}
                  <TinyMCEEditor
                    tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
                    value={newQuestion.content}
                    onEditorChange={(value: string) =>
                      setNewQuestion({ ...newQuestion, content: value })
                    }
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: ['advlist', 'lists', 'paste', 'autolink', 'link', 'table'],
                      toolbar:
                        'undo redo | bold italic underline | forecolor backcolor | numlist bullist | outdent indent | table | removeformat | markcorrect markstem',

                      // Keep formatting when pasting
                      paste_as_text: false,
                      paste_merge_formats: true,
                      paste_retain_style_properties: 'all',
                      paste_webkit_styles: 'all',
                      paste_word_valid_elements: '*[*]',
                      paste_data_images: false,

                      // Allow elements/styles related to bold
                      valid_elements: '*[*]',
                      extended_valid_elements: 'strong/b,em/i,u,span[style],p,ol,ul,li',
                      valid_styles: {
                        '*': 'font-weight,font-style,color,text-decoration,font-size,font-family',
                      },

                      // Normalize: convert font-weight >= 600 to <strong>
                      paste_preprocess: (_plugin, args) => {
                        try {
                          const parser = new DOMParser()
                          const doc = parser.parseFromString(args.content, 'text/html')
                          const spans = Array.from(doc.querySelectorAll('span'))
                          spans.forEach((span) => {
                            const style = (span.getAttribute('style') || '').toLowerCase()
                            const isBold = /font-weight\s*:\s*(bold|[6-9]00)/i.test(style)
                            const isFamilyBold = /font-family\s*:\s*[^;]*bold/i.test(style)
                            if (isBold || isFamilyBold) {
                              const strong = doc.createElement('strong')
                              strong.innerHTML = span.innerHTML
                              span.replaceWith(strong)
                            }
                          })
                          args.content = doc.body.innerHTML
                        } catch {
                          // ignore lỗi parse
                        }
                      },

                      // Styles
                      content_style:
                        'body { font-family: Inter, ui-sans-serif, system-ui; font-size:14px; color:#000000; } strong, b { color: #000000; font-weight: 700; } li.correct-answer { font-weight: 700; color: #000000; }',

                      setup: (editor) => {
                        editor.ui.registry.addButton('markcorrect', {
                          text: 'Đúng',
                          tooltip: 'Đánh dấu đáp án đúng',
                          onAction: () => {
                            const node = editor.selection.getNode()
                            const li =
                              node && (node.nodeName === 'LI'
                                ? node
                                : editor.dom.getParent(node, 'li'))
                            if (!li) {
                              editor.notificationManager.open({
                                text: 'Hãy đặt con trỏ vào một đáp án (dòng li)',
                                type: 'info',
                              })
                              return
                            }
                            // Clear correct-answer in same list
                            const parentList =
                              editor.dom.getParent(li, 'ol,ul') || li.parentElement
                            if (parentList) {
                              Array.from(parentList.querySelectorAll('li.correct-answer')).forEach(
                                (el) => {
                                  el.classList.remove('correct-answer')
                                  const childStrong = el.querySelector('strong')
                                  if (childStrong && childStrong.parentElement === el) {
                                    childStrong.replaceWith(...Array.from(childStrong.childNodes))
                                  }
                                }
                              )
                            }
                            // Toggle current li
                            const html = li.innerHTML
                            if (li.classList.contains('correct-answer')) {
                              li.classList.remove('correct-answer')
                              const onlyStrong =
                                li.firstElementChild?.tagName === 'STRONG' &&
                                li.children.length === 1
                              if (onlyStrong) {
                                const strong = li.firstElementChild as HTMLElement
                                strong.replaceWith(...Array.from(strong.childNodes))
                              }
                            } else {
                              li.classList.add('correct-answer')
                              if (!/^\s*<strong>[\s\S]*<\/strong>\s*$/i.test(html)) {
                                li.innerHTML = `<strong>${html}</strong>`
                              }
                            }
                          },
                        })
                        editor.ui.registry.addButton('markstem', {
                          text: 'Đậm câu hỏi',
                          tooltip: 'Bôi đậm phần câu hỏi trước danh sách đáp án',
                          onAction: () => {
                            const body = editor.getBody()
                            const firstList = body.querySelector('ol, ul')
                            const children = Array.from(body.children)
                            for (const child of children) {
                              if (child === firstList) break
                              const tag = child.tagName
                              if (tag === 'P' || tag === 'DIV' || /^H[1-6]$/.test(tag)) {
                                const el = child as HTMLElement
                                const html = el.innerHTML
                                if (!html || html.trim() === '') continue
                                if (!/^\s*<strong>[\s\S]*<\/strong>\s*$/i.test(html)) {
                                  el.innerHTML = `<strong>${html}</strong>`
                                }
                              }
                            }
                          },
                        })
                      },
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án A</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-900" value={newQuestion.option_a} onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án B</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-900" value={newQuestion.option_b} onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án C</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-900" value={newQuestion.option_c} onChange={(e) => setNewQuestion({ ...newQuestion, option_c: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án D</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-900" value={newQuestion.option_d} onChange={(e) => setNewQuestion({ ...newQuestion, option_d: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án đúng</label>
                  <select className="w-full px-3 py-2 border rounded text-gray-900" value={newQuestion.correct_option} onChange={(e) => setNewQuestion({ ...newQuestion, correct_option: e.target.value as 'A'|'B'|'C'|'D' })}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={createQuestion}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tạo câu hỏi
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Question Modal */}
        {showEditForm && editingQuestion && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Chỉnh sửa câu hỏi</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung câu hỏi:</label>
                  {/** TinyMCE rich text editor for question content */}
                  <TinyMCEEditor
                    tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
                    value={editingQuestion.content}
                    onEditorChange={(value: string) =>
                      setEditingQuestion({ ...editingQuestion, content: value })
                    }
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: ['advlist', 'lists', 'paste', 'autolink', 'link', 'table'],
                      toolbar:
                        'undo redo | bold italic underline | forecolor backcolor | numlist bullist | outdent indent | table | removeformat | markcorrect markstem',

                      // Keep formatting when pasting
                      paste_as_text: false,
                      paste_merge_formats: true,
                      paste_retain_style_properties: 'all',
                      paste_webkit_styles: 'all',
                      paste_word_valid_elements: '*[*]',
                      paste_data_images: false,

                      // Allow elements/styles related to bold
                      valid_elements: '*[*]',
                      extended_valid_elements: 'strong/b,em/i,u,span[style],p,ol,ul,li',
                      valid_styles: {
                        '*': 'font-weight,font-style,color,text-decoration,font-size,font-family',
                      },

                      // Normalize: convert font-weight >= 600 to <strong>
                      paste_preprocess: (_plugin, args) => {
                        try {
                          const parser = new DOMParser()
                          const doc = parser.parseFromString(args.content, 'text/html')
                          const spans = Array.from(doc.querySelectorAll('span'))
                          spans.forEach((span) => {
                            const style = (span.getAttribute('style') || '').toLowerCase()
                            const isBold = /font-weight\s*:\s*(bold|[6-9]00)/i.test(style)
                            const isFamilyBold = /font-family\s*:\s*[^;]*bold/i.test(style)
                            if (isBold || isFamilyBold) {
                              const strong = doc.createElement('strong')
                              strong.innerHTML = span.innerHTML
                              span.replaceWith(strong)
                            }
                          })
                          args.content = doc.body.innerHTML
                        } catch {
                          // ignore lỗi parse
                        }
                      },

                      // Styles
                      content_style:
                        'body { font-family: Inter, ui-sans-serif, system-ui; font-size:14px; color:#000000; } strong, b { color: #000000; font-weight: 700; } li.correct-answer { font-weight: 700; color: #000000; }',

                      setup: (editor) => {
                        editor.ui.registry.addButton('markcorrect', {
                          text: 'Đúng',
                          tooltip: 'Đánh dấu đáp án đúng',
                          onAction: () => {
                            const node = editor.selection.getNode()
                            const li =
                              node && (node.nodeName === 'LI'
                                ? node
                                : editor.dom.getParent(node, 'li'))
                            if (!li) {
                              editor.notificationManager.open({
                                text: 'Hãy đặt con trỏ vào một đáp án (dòng li)',
                                type: 'info',
                              })
                              return
                            }
                            // Clear correct-answer in same list
                            const parentList =
                              editor.dom.getParent(li, 'ol,ul') || li.parentElement
                            if (parentList) {
                              Array.from(parentList.querySelectorAll('li.correct-answer')).forEach(
                                (el) => {
                                  el.classList.remove('correct-answer')
                                  const childStrong = el.querySelector('strong')
                                  if (childStrong && childStrong.parentElement === el) {
                                    childStrong.replaceWith(...Array.from(childStrong.childNodes))
                                  }
                                }
                              )
                            }
                            // Toggle current li
                            const html = li.innerHTML
                            if (li.classList.contains('correct-answer')) {
                              li.classList.remove('correct-answer')
                              const onlyStrong =
                                li.firstElementChild?.tagName === 'STRONG' &&
                                li.children.length === 1
                              if (onlyStrong) {
                                const strong = li.firstElementChild as HTMLElement
                                strong.replaceWith(...Array.from(strong.childNodes))
                              }
                            } else {
                              li.classList.add('correct-answer')
                              if (!/^\s*<strong>[\s\S]*<\/strong>\s*$/i.test(html)) {
                                li.innerHTML = `<strong>${html}</strong>`
                              }
                            }
                          },
                        })
                        editor.ui.registry.addButton('markstem', {
                          text: 'Đậm câu hỏi',
                          tooltip: 'Bôi đậm phần câu hỏi trước danh sách đáp án',
                          onAction: () => {
                            const body = editor.getBody()
                            const firstList = body.querySelector('ol, ul')
                            const children = Array.from(body.children)
                            for (const child of children) {
                              if (child === firstList) break
                              const tag = child.tagName
                              if (tag === 'P' || tag === 'DIV' || /^H[1-6]$/.test(tag)) {
                                const el = child as HTMLElement
                                const html = el.innerHTML
                                if (!html || html.trim() === '') continue
                                if (!/^\s*<strong>[\s\S]*<\/strong>\s*$/i.test(html)) {
                                  el.innerHTML = `<strong>${html}</strong>`
                                }
                              }
                            }
                          },
                        })
                      },
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án A</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-900" value={editingQuestion.option_a} onChange={(e) => setEditingQuestion({ ...editingQuestion, option_a: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án B</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-900" value={editingQuestion.option_b} onChange={(e) => setEditingQuestion({ ...editingQuestion, option_b: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án C</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-900" value={editingQuestion.option_c} onChange={(e) => setEditingQuestion({ ...editingQuestion, option_c: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án D</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-900" value={editingQuestion.option_d} onChange={(e) => setEditingQuestion({ ...editingQuestion, option_d: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án đúng</label>
                  <select className="w-full px-3 py-2 border rounded text-gray-900" value={editingQuestion.correct_option} onChange={(e) => setEditingQuestion({ ...editingQuestion, correct_option: e.target.value as 'A'|'B'|'C'|'D' })}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={updateQuestion}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingQuestion(null)
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        {selectedSetId ? (
          questions.length > 0 ? (
            <>
              <div className="space-y-4">
                {currentQuestions.map((question) => (
                  <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Câu {question.originalIndex + 1}
                      </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingQuestion(question)
                          setShowEditForm(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div
                    className="prose max-w-none text-gray-800 mb-4"
                    dangerouslySetInnerHTML={{ __html: highlightText(question.content, searchQuery) }}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    <div className={`${question.correct_option === 'A' ? 'bg-green-200 border-green-400 text-gray-900 font-semibold' : 'text-gray-900'} border p-3 rounded`}>
                      <strong>A.</strong> {question.correct_option === 'A' ? <strong>{question.option_a}</strong> : question.option_a}
                    </div>
                    <div className={`${question.correct_option === 'B' ? 'bg-green-200 border-green-400 text-gray-900 font-semibold' : 'text-gray-900'} border p-3 rounded`}>
                      <strong>B.</strong> {question.correct_option === 'B' ? <strong>{question.option_b}</strong> : question.option_b}
                    </div>
                    <div className={`${question.correct_option === 'C' ? 'bg-green-200 border-green-400 text-gray-900 font-semibold' : 'text-gray-900'} border p-3 rounded`}>
                      <strong>C.</strong> {question.correct_option === 'C' ? <strong>{question.option_c}</strong> : question.option_c}
                    </div>
                    <div className={`${question.correct_option === 'D' ? 'bg-green-200 border-green-400 text-gray-900 font-semibold' : 'text-gray-900'} border p-3 rounded`}>
                      <strong>D.</strong> {question.correct_option === 'D' ? <strong>{question.option_d}</strong> : question.option_d}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Đáp án đúng: <span className="font-medium text-green-600">{question.correct_option}</span>
                  </p>
                </div>
              ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Trước
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
                        return (
                          <span key={page} className="px-2 py-2 text-gray-500">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau →
                  </button>
                </div>
              )}

              {/* Page info */}
              <div className="mt-4 text-center text-sm text-gray-600">
                Hiển thị câu {startIndex + 1} - {Math.min(endIndex, filteredQuestions.length)} / {filteredQuestions.length}
                {searchQuery && filteredQuestions.length < questions.length && (
                  <span className="text-gray-500"> (đã lọc từ {questions.length} câu)</span>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <span className="text-6xl mb-4 block">❓</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có câu hỏi nào</h3>
              <p className="text-gray-600 mb-6">Hãy thêm câu hỏi đầu tiên cho bộ đề này!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                + Thêm câu hỏi
              </button>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chọn bộ đề</h3>
            <p className="text-gray-600">Vui lòng chọn một bộ đề để quản lý câu hỏi</p>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          title="Cuộn lên đầu trang"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
