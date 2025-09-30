'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'

const TinyMCEEditor = dynamic(
  () => import('@tinymce/tinymce-react').then((m) => m.Editor),
  { ssr: false }
)

interface Props {
  questionSetId: string
}

export default function AddQuestionModal({ questionSetId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correct, setCorrect] = useState<'A'|'B'|'C'|'D'>('A')
  const [formError, setFormError] = useState('')


  const submit = async () => {
    setFormError('')
    if (!questionSetId) return
    if (!content.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setFormError('Vui lòng nhập đầy đủ nội dung và 4 đáp án')
      return
    }
    try {
      setSubmitting(true)
      const res = await fetch('/api/practice/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_set_id: questionSetId,
          content,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_option: correct
        })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to create question')
      }
      setContent('')
      setOptionA('')
      setOptionB('')
      setOptionC('')
      setOptionD('')
      setCorrect('A')
      setOpen(false)
      router.refresh() // Reload để hiển thị câu hỏi mới
    } catch (e) {
      console.error(e)
      setFormError('Không thể tạo câu hỏi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow hover:shadow-md transition-all duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Thêm câu hỏi
      </Button>
      {open && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur rounded-xl border border-white/60 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Thêm câu hỏi mới</h3>
              <button 
                onClick={() => setOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={submitting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung câu hỏi:</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <TinyMCEEditor
                    tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
                    value={content}
                    onEditorChange={(v: string) => setContent(v)}
                    init={{
                      height: 200,
                      menubar: false,
                      plugins: ['advlist', 'lists', 'paste', 'autolink', 'link'],
                      toolbar: 'undo redo | bold italic underline | numlist bullist | removeformat',
                      skin: 'oxide',
                      content_css: 'default',
                      statusbar: false,
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <div className="absolute left-3 top-2.5 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">A</div>
                  <input 
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" 
                    placeholder="Đáp án A"
                    value={optionA} 
                    onChange={(e) => setOptionA(e.target.value)} 
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-medium">B</div>
                  <input 
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" 
                    placeholder="Đáp án B"
                    value={optionB} 
                    onChange={(e) => setOptionB(e.target.value)} 
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">C</div>
                  <input 
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" 
                    placeholder="Đáp án C"
                    value={optionC} 
                    onChange={(e) => setOptionC(e.target.value)} 
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">D</div>
                  <input 
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all" 
                    placeholder="Đáp án D"
                    value={optionD} 
                    onChange={(e) => setOptionD(e.target.value)} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Đáp án đúng</label>
                <div className="flex space-x-4">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <label 
                      key={option}
                      className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${correct === option ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      <input 
                        type="radio" 
                        className="sr-only" 
                        name="correctAnswer" 
                        value={option} 
                        checked={correct === option} 
                        onChange={() => setCorrect(option as 'A'|'B'|'C'|'D')}
                      />
                      <span className={`font-medium ${correct === option ? 'text-indigo-700' : 'text-gray-700'}`}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <Button 
                disabled={submitting} 
                onClick={submit} 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow transition-all"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : 'Lưu câu hỏi'}
              </Button>
              <Button 
                disabled={submitting} 
                onClick={() => setOpen(false)} 
                variant="outline" 
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


