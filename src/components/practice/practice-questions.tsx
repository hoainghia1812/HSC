'use client'

import { useState, useEffect } from 'react'
import { QuestionOption } from '@/types/database'

interface Question {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'essay'
  options: QuestionOption[]
  explanation: string | null
}

interface PracticeQuestionsProps {
  questions: Question[]
  title: string
  timeLimit?: number // thời gian làm bài (phút) - không sử dụng nữa, giữ để tương thích
}

// Theme colors matching practice page (indigo-purple gradient)

export default function PracticeQuestions({ questions, title }: PracticeQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0) // Đếm từ 0
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [showDetailType, setShowDetailType] = useState<'correct' | 'incorrect' | null>(null) // Hiển thị chi tiết câu đúng/sai

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  // Countup timer - đếm lên từ 0
  useEffect(() => {
    if (showResults) return

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setShowMobileNav(false)
  }

  const calculateScore = () => {
    let correctCount = 0
    Object.entries(selectedAnswers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId)
      if (question) {
        const selectedOption = question.options.find(o => o.id === answerId)
        if (selectedOption?.is_correct) correctCount++
      }
    })
    return correctCount
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const handleRetry = () => {
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)
    setShowResults(false)
    setTimeElapsed(0)
    setShowDetailType(null)
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Chưa có câu hỏi nào trong bộ đề này.</p>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / totalQuestions) * 100)
    const timeTaken = timeElapsed

    // Phân loại câu đúng/sai
    const correctQuestions = questions.filter(q => {
      const answerId = selectedAnswers[q.id]
      if (!answerId) return false
      const selectedOption = q.options.find(o => o.id === answerId)
      return selectedOption?.is_correct
    })

    const incorrectQuestions = questions.filter(q => {
      const answerId = selectedAnswers[q.id]
      if (!answerId) return false
      const selectedOption = q.options.find(o => o.id === answerId)
      return !selectedOption?.is_correct
    })

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-indigo-100 overflow-hidden">
            {/* Header */}
            <div className="p-10 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border-b-2 border-indigo-100">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Kết quả bài thi
              </h2>
              <p className="text-slate-600 font-medium text-lg">{title}</p>
            </div>
          
            {/* Score */}
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition"></div>
                  <div className="relative text-center p-8 bg-white rounded-2xl border-2 border-indigo-100 shadow-lg">
                    <div className="text-5xl font-black mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {score}/{totalQuestions}
                    </div>
                    <div className="text-sm font-bold text-slate-600">Câu đúng</div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition"></div>
                  <div className="relative text-center p-8 bg-white rounded-2xl border-2 border-purple-100 shadow-lg">
                    <div className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {percentage}%
                    </div>
                    <div className="text-sm font-bold text-slate-600">Điểm số</div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition"></div>
                  <div className="relative text-center p-8 bg-white rounded-2xl border-2 border-blue-100 shadow-lg">
                    <div className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {formatTime(timeTaken)}
                    </div>
                    <div className="text-sm font-bold text-slate-600">Thời gian làm bài</div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="text-center mb-10">
                <div className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
                  <p className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {percentage >= 80 ? '🎉 Xuất sắc! Bạn đã hoàn thành rất tốt.' :
                     percentage >= 60 ? '👍 Tốt! Bạn đã nắm được phần lớn kiến thức.' :
                     percentage >= 40 ? '📚 Bạn cần cố gắng hơn nữa.' :
                     '💪 Hãy xem lại bài học và thử lại nhé.'}
                  </p>
                </div>
              </div>

              {/* Detail */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 mb-8 border-2 border-indigo-100">
                <h3 className="font-black text-xl mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Chi tiết kết quả:</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-indigo-100">
                    <span className="text-slate-600 font-medium">Tổng số câu:</span>
                    <span className="font-black text-indigo-600 text-lg">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-indigo-100">
                    <span className="text-slate-600 font-medium">Câu đã làm:</span>
                    <span className="font-black text-indigo-600 text-lg">{Object.keys(selectedAnswers).length}</span>
                  </div>
                  <button 
                    onClick={() => setShowDetailType(showDetailType === 'correct' ? null : 'correct')}
                    className={`flex justify-between items-center p-4 bg-white rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                      showDetailType === 'correct' ? 'border-emerald-400 shadow-md scale-[1.02]' : 'border-emerald-100 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-emerald-600 font-medium">Câu đúng:</span>
                    <span className="font-black text-emerald-600 text-lg">{score}</span>
                  </button>
                  <button 
                    onClick={() => setShowDetailType(showDetailType === 'incorrect' ? null : 'incorrect')}
                    className={`flex justify-between items-center p-4 bg-white rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                      showDetailType === 'incorrect' ? 'border-red-400 shadow-md scale-[1.02]' : 'border-red-100 hover:border-red-300'
                    }`}
                  >
                    <span className="text-red-600 font-medium">Câu sai:</span>
                    <span className="font-black text-red-600 text-lg">{Object.keys(selectedAnswers).length - score}</span>
                  </button>
                </div>
              </div>

              {/* Hiển thị chi tiết câu đúng/sai */}
              {showDetailType && (
                <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-indigo-100 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`font-black text-xl ${showDetailType === 'correct' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {showDetailType === 'correct' ? '✓ Các câu trả lời đúng' : '✗ Các câu trả lời sai'}
                    </h3>
                    <button 
                      onClick={() => setShowDetailType(null)}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {(showDetailType === 'correct' ? correctQuestions : incorrectQuestions).map((question) => {
                      const userAnswerId = selectedAnswers[question.id]
                      const correctOption = question.options.find(o => o.is_correct)
                      
                      return (
                        <div key={question.id} className="border-2 border-slate-200 rounded-xl p-6 bg-slate-50">
                          <div className="flex items-start gap-3 mb-4">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                              showDetailType === 'correct' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}>
                              {questions.indexOf(question) + 1}
                            </div>
                            <div 
                              className="flex-1 text-slate-800 font-semibold"
                              dangerouslySetInnerHTML={{ __html: question.question_text }}
                            />
                          </div>
                          
                          <div className="space-y-2 ml-11">
                            {question.options.map(option => {
                              const isCorrect = option.is_correct
                              const isUserAnswer = option.id === userAnswerId
                              
                              return (
                                <div 
                                  key={option.id}
                                  className={`p-3 rounded-lg border-2 ${
                                    isCorrect && isUserAnswer ? 'bg-emerald-50 border-emerald-300' :
                                    isCorrect ? 'bg-emerald-50 border-emerald-300' :
                                    isUserAnswer ? 'bg-red-50 border-red-300' :
                                    'bg-white border-slate-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                                      isCorrect ? 'bg-emerald-500 text-white' :
                                      isUserAnswer ? 'bg-red-500 text-white' :
                                      'bg-slate-200 text-slate-600'
                                    }`}>
                                      {option.id}
                                    </span>
                                    <span className={`flex-1 ${
                                      isCorrect ? 'text-emerald-900 font-semibold' :
                                      isUserAnswer ? 'text-red-900 font-semibold' :
                                      'text-slate-600'
                                    }`}>
                                      {option.text}
                                    </span>
                                    {isCorrect && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {showDetailType === 'incorrect' && (
                            <div className="mt-4 ml-11 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                  <strong>Đáp án đúng:</strong> {correctOption?.id}. {correctOption?.text}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-black rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Làm lại
                </button>
                <button 
                  onClick={() => window.location.href = '/practice'}
                  className="flex-1 px-8 py-4 bg-white hover:bg-slate-50 text-indigo-600 font-black rounded-xl border-2 border-indigo-200 hover:border-indigo-400 shadow-lg hover:shadow-xl transition-all"
                >
                  Về danh sách đề
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main exam interface
  const answeredCount = Object.keys(selectedAnswers).length
  const progress = (answeredCount / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decoration matching practice page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Header - Info Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 mb-8 border-2 border-indigo-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={() => window.history.back()}
                className="flex-shrink-0 p-2.5 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-indigo-100 text-indigo-600 font-semibold hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-md hover:shadow-lg group"
                title="Quay lại"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">{title}</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg transition-all bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="#6366f1">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-mono text-xl font-bold text-indigo-600">
                  {formatTime(timeElapsed)}
                </span>
              </div>

              {/* Progress */}
              <div className="hidden md:block text-sm text-slate-600">
                Đã làm: <span className="font-bold text-indigo-600">{answeredCount}/{totalQuestions}</span>
              </div>
            </div>
        </div>
        
        {/* Progress bar */}
          <div className="mt-5 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator - Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 sticky top-6 border-2 border-indigo-100">
              <h3 className="font-black text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-3 border-b-2 border-indigo-100">
                Danh sách câu hỏi
              </h3>
              <div className="grid grid-cols-5 gap-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(index)}
                    className={`aspect-square rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg ${
                      selectedAnswers[q.id]
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white scale-105'
                        : currentQuestionIndex === index
                        ? 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 border-2 border-indigo-400'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border-2 border-indigo-100">
              {/* Question Header */}
              <div className="flex items-center gap-4 mb-8 pb-5 border-b-2 border-indigo-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl font-black text-xl text-white bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <div className="text-sm font-bold text-indigo-600">Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}</div>
                  <div className="text-xs text-slate-500 font-medium">Chọn 1 đáp án đúng nhất</div>
                </div>
              </div>

              {/* Question Text */}
              <div 
                className="text-lg font-semibold mb-8 leading-relaxed text-slate-800"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }}
              />

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option.id

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className={`group flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-xl ${
                        isSelected 
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-400 shadow-lg scale-[1.02]'
                          : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50 shadow-md'
                      }`}
                    >
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold mr-4 flex-shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                      }`}>
                        {option.id}
                      </span>
                      <span className={`font-medium flex-1 ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {option.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`group flex items-center gap-2 px-6 py-4 border-2 rounded-xl font-bold shadow-lg transition-all ${
                  currentQuestionIndex === 0
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-xl'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${currentQuestionIndex !== 0 && 'group-hover:-translate-x-1 transition-transform'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Câu trước</span>
              </button>

              <button
                onClick={handleSubmit}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                Nộp bài
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className={`group flex items-center gap-2 px-6 py-4 border-2 rounded-xl font-bold shadow-lg transition-all ${
                  currentQuestionIndex === totalQuestions - 1
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-xl'
                }`}
              >
                <span className="hidden sm:inline">Câu tiếp theo</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${currentQuestionIndex !== totalQuestions - 1 && 'group-hover:translate-x-1 transition-transform'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Question Navigator - Bottom Sheet */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileNav(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center z-40 text-white bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {showMobileNav && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowMobileNav(false)}>
              <div 
                className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto shadow-2xl border-t-4 border-indigo-500"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Danh sách câu hỏi
                  </h3>
                  <button 
                    onClick={() => setShowMobileNav(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {questions.map((q, index) => (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`aspect-square rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg ${
                        selectedAnswers[q.id]
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white scale-105'
                          : currentQuestionIndex === index
                          ? 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 border-2 border-indigo-400'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}