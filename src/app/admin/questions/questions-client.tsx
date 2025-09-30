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
  const [showBulkForm, setShowBulkForm] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [isBulkImporting, setIsBulkImporting] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A' as 'A' | 'B' | 'C' | 'D'
  })

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
      fetchQuestions(selectedSetId)
    }
  }, [selectedSetId])

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

  const selectedSet = questionSets.find(set => set.id === selectedSetId)

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
                <h1 className="text-3xl font-bold text-gray-900">❓ Quản lý Câu hỏi</h1>
                {selectedSet && (
                  <p className="text-gray-600 mt-1">Bộ đề: {selectedSet.title} ({questions.length} câu)</p>
                )}
              </div>
            </div>
            {selectedSetId && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Thêm câu hỏi
              </button>
            )}
            {selectedSetId && (
              <button
                onClick={() => setShowBulkForm(true)}
                className="ml-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ⇪ Nhập hàng loạt
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
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Chọn bộ đề --</option>
            {questionSets.map(set => (
              <option key={set.id} value={set.id}>{set.title}</option>
            ))}
          </select>
        </div>

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
                        'body { font-family: Inter, ui-sans-serif, system-ui; font-size:14px; color:#111827; } li.correct-answer { font-weight: 700; }',

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
                    <input className="w-full px-3 py-2 border rounded" value={newQuestion.option_a} onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án B</label>
                    <input className="w-full px-3 py-2 border rounded" value={newQuestion.option_b} onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án C</label>
                    <input className="w-full px-3 py-2 border rounded" value={newQuestion.option_c} onChange={(e) => setNewQuestion({ ...newQuestion, option_c: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án D</label>
                    <input className="w-full px-3 py-2 border rounded" value={newQuestion.option_d} onChange={(e) => setNewQuestion({ ...newQuestion, option_d: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án đúng</label>
                  <select className="w-full px-3 py-2 border rounded" value={newQuestion.correct_option} onChange={(e) => setNewQuestion({ ...newQuestion, correct_option: e.target.value as 'A'|'B'|'C'|'D' })}>
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

        {/* Bulk Import Modal */}
        {showBulkForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Nhập câu hỏi hàng loạt</h3>
              <div className="space-y-3 text-sm text-gray-600 mb-3">
                <p>- Hỗ trợ định dạng: mỗi câu bắt đầu bằng &quot;Câu X:&quot; rồi đến 4 dòng a./b./c./d.</p>
                <p>- Có thể dán trực tiếp đoạn văn bản nhiều câu; hệ thống tự tách theo &quot;Câu X:&quot;.</p>
                <p>- Bạn có thể <span className="font-medium">bôi đậm</span> dòng đáp án đúng ngay trong ô nhập để hệ thống nhận dạng đáp án đúng.</p>
                <p>- Hoặc thêm marker trên dòng đáp án: <code>(đúng)</code>, <code>(correct)</code>, <code>[x]</code>, <code>✓</code>, <code>✔</code>. Nếu không có, mặc định chọn A.</p>
              </div>
              <div className="border border-gray-300 rounded-lg">
                <TinyMCEEditor
                  tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
                  value={bulkText}
                  onEditorChange={(value: string) => setBulkText(value)}
                  init={{
                    height: 320,
                    menubar: false,
                    plugins: ['advlist', 'lists', 'paste', 'autolink'],
                    toolbar: 'undo redo | bold italic underline | numlist bullist | removeformat',
                    paste_as_text: false,
                    paste_merge_formats: true,
                    paste_retain_style_properties: 'all',
                    paste_webkit_styles: 'all',
                    paste_word_valid_elements: '*[*]',
                    valid_elements: '*[*]',
                    extended_valid_elements: 'strong/b,em/i,u,span[style],p,ol,ul,li,br',
                    valid_styles: {
                      '*': 'font-weight,font-style,color,text-decoration,font-size,font-family',
                    },
                    content_style:
                      'body { font-family: Inter, ui-sans-serif, system-ui; font-size:14px; color:#111827; }',
                  }}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  disabled={isBulkImporting}
                  onClick={async () => {
                    if (!selectedSetId) return
                    const rawHtml = bulkText.trim()
                    if (!rawHtml) { alert('Vui lòng dán dữ liệu'); return }
                    const parser = new DOMParser()
                    const doc = parser.parseFromString(rawHtml, 'text/html')
                    const htmlLines: { text: string; bold: boolean }[] = []
                    const isBoldEl = (el: Element) => {
                      if (el.querySelector('strong, b')) return true
                      const withWeight = el.querySelector('span[style*="font-weight" i]') as HTMLElement | null
                      if (withWeight) {
                        const v = withWeight.getAttribute('style') || ''
                        if (/font-weight\s*:\s*(bold|[6-9]00)/i.test(v)) return true
                      }
                      const withFamily = el.querySelector('span[style*="font-family" i]') as HTMLElement | null
                      if (withFamily) {
                        const v = withFamily.getAttribute('style') || ''
                        if (/font-family\s*:\s*[^;]*bold/i.test(v)) return true
                      }
                      return false
                    }
                    const pushLine = (el: Element) => {
                      const text = (el.textContent || '').trim()
                      if (!text) return
                      htmlLines.push({ text, bold: isBoldEl(el) })
                    }
                    Array.from(doc.body.children).forEach((child) => {
                      const tag = child.tagName
                      if (tag === 'P' || tag === 'DIV' || /^H[1-6]$/.test(tag)) {
                        pushLine(child)
                      } else if (tag === 'OL' || tag === 'UL') {
                        Array.from(child.querySelectorAll('li')).forEach((li) => pushLine(li))
                      }
                    })
                    if (htmlLines.length === 0) { alert('Không có nội dung hợp lệ'); return }

                    const toText = (arr: { text: string; bold: boolean }[]) => arr.map(x => x.text).join('\n')
                    const textAll = toText(htmlLines)
                    const parts = textAll
                      .split(/(?=\bCâu\s*\d+\s*:\s*)/i)
                      .map(s => s.trim())
                      .filter(Boolean)
                    if (parts.length === 0) { alert('Không tìm thấy "Câu X:"'); return }

                    const optLine = /^(?:[a-dA-D])[\.|\)|:|-]\s*(.+)$/
                    const hasCorrectMarker = (t: string) => /(^\s*\*)|(\(\s*đúng\s*\)|(\(\s*correct\s*\))|\[\s*x\s*\]|✓|✔)/i.test(t)
                    const stripCorrectMarker = (t: string) => t.replace(/^\s*\*/, '').replace(/(\(\s*đúng\s*\)|(\(\s*correct\s*\))|\[\s*x\s*\]|✓|✔)/gi, '').trim()

                    setIsBulkImporting(true)
                    let success = 0
                    let fail = 0
                    try {
                      const token = localStorage.getItem('auth_token')
                      let searchStartIdx = 0
                      for (const block of parts) {
                        // Separate stem and option lines
                        const lines = block.split(/\n+/).map(s => s.trim()).filter(Boolean)
                        // Remove the first line label "Câu X:" from stem
                        const first = lines[0] || ''
                        const stem = first.replace(/^Câu\s*\d+\s*:\s*/i, '').trim()
                        const optionLines = lines.slice(1).filter(l => optLine.test(l))
                        if (optionLines.length < 4) { fail++; continue }
                        const optMatches = optionLines.slice(0,4).map(l => l.match(optLine))
                        const texts = optMatches.map(m => (m && m[1] ? m[1] : '').trim())
                        if (texts.some(t => !t)) { fail++; continue }
                        // Determine correct option: prefer bold in HTML, else marker, else A
                        let correctIndex = -1
                        // Walk htmlLines by blocks starting at next "Câu X:" from the last pointer
                        const blockStartIdx = htmlLines.findIndex((l, idx) => idx >= searchStartIdx && /^Câu\s*\d+\s*:/i.test(l.text))
                        if (blockStartIdx >= 0) {
                          const optionHtmlLines = htmlLines
                            .slice(blockStartIdx + 1)
                            .filter(l => optLine.test(l.text))
                            .slice(0, 4)
                          if (optionHtmlLines.length >= 4) {
                            correctIndex = optionHtmlLines.findIndex(l => l.bold)
                            // advance pointer past this block's options
                            searchStartIdx = blockStartIdx + 1 + optionHtmlLines.length
                          }
                        }
                        if (correctIndex < 0) {
                          // Leading * on option lines
                          correctIndex = optionLines.findIndex(l => /^\s*\*/.test(l))
                        }
                        if (correctIndex < 0) {
                          correctIndex = optionLines.findIndex(l => hasCorrectMarker(l))
                        }
                        const letters: Array<'A'|'B'|'C'|'D'> = ['A','B','C','D']
                        const cleanedTexts = texts.map((t) => stripCorrectMarker(t))
                        const payload = {
                          question_set_id: selectedSetId,
                          content: stem,
                          option_a: cleanedTexts[0],
                          option_b: cleanedTexts[1],
                          option_c: cleanedTexts[2],
                          option_d: cleanedTexts[3],
                          correct_option: letters[(correctIndex >= 0 ? correctIndex : 0)]
                        }
                        const res = await fetch('/api/admin/questions', {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(payload)
                        })
                        if (res.ok) success++; else fail++
                      }
                      alert(`Đã nhập: ${success} thành công, ${fail} thất bại`)
                      setShowBulkForm(false)
                      setBulkText('')
                      if (selectedSetId) fetchQuestions(selectedSetId)
                    } catch (e) {
                      console.error('Bulk import error:', e)
                      alert('Có lỗi khi nhập hàng loạt')
                    } finally {
                      setIsBulkImporting(false)
                    }
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isBulkImporting ? 'Đang nhập...' : 'Nhập'}
                </button>
                <button
                  disabled={isBulkImporting}
                  onClick={() => setShowBulkForm(false)}
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
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Câu {index + 1}
                    </h3>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                  
                  <div
                    className="prose max-w-none text-gray-800 mb-4"
                    dangerouslySetInnerHTML={{ __html: question.content }}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    <div className={`${question.correct_option === 'A' ? 'bg-green-100 border-green-300 font-semibold' : 'bg-gray-100'} border p-3 rounded`}>
                      <strong>A.</strong> {question.correct_option === 'A' ? <strong>{question.option_a}</strong> : question.option_a}
                    </div>
                    <div className={`${question.correct_option === 'B' ? 'bg-green-100 border-green-300 font-semibold' : 'bg-gray-100'} border p-3 rounded`}>
                      <strong>B.</strong> {question.correct_option === 'B' ? <strong>{question.option_b}</strong> : question.option_b}
                    </div>
                    <div className={`${question.correct_option === 'C' ? 'bg-green-100 border-green-300 font-semibold' : 'bg-gray-100'} border p-3 rounded`}>
                      <strong>C.</strong> {question.correct_option === 'C' ? <strong>{question.option_c}</strong> : question.option_c}
                    </div>
                    <div className={`${question.correct_option === 'D' ? 'bg-green-100 border-green-300 font-semibold' : 'bg-gray-100'} border p-3 rounded`}>
                      <strong>D.</strong> {question.correct_option === 'D' ? <strong>{question.option_d}</strong> : question.option_d}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Đáp án đúng: <span className="font-medium text-green-600">{question.correct_option}</span>
                  </p>
                </div>
              ))}
            </div>
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
    </div>
  )
}
