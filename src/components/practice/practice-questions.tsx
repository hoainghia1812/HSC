'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
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
  timeLimit?: number // thời gian làm bài (phút)
}

const PRIMARY_COLOR = '#17a2b8'

export default function PracticeQuestions({ questions, title, timeLimit = 45 }: PracticeQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60) // convert to seconds
  const [showMobileNav, setShowMobileNav] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  // Countdown timer
  useEffect(() => {
    if (showResults || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showResults, timeRemaining])

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
    setTimeRemaining(timeLimit * 60)
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
    const timeTaken = timeLimit * 60 - timeRemaining

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border-2 overflow-hidden" style={{ borderColor: PRIMARY_COLOR }}>
          {/* Header */}
          <div className="p-8 text-center" style={{ backgroundColor: `${PRIMARY_COLOR}10` }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: PRIMARY_COLOR }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Kết quả bài thi
            </h2>
            <p className="text-gray-600">{title}</p>
          </div>
          
          {/* Score */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white rounded-xl border-2" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
                <div className="text-4xl font-bold mb-2 text-gray-800">
                  {score}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Câu đúng</div>
              </div>

              <div className="text-center p-6 bg-white rounded-xl border-2" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
                <div className="text-4xl font-bold mb-2 text-gray-800">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">Điểm số</div>
              </div>

              <div className="text-center p-6 bg-white rounded-xl border-2" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
                <div className="text-4xl font-bold mb-2 text-gray-800">
                  {formatTime(timeTaken)}
                </div>
                <div className="text-sm text-gray-600">Thời gian làm bài</div>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-8">
              <p className="text-lg font-semibold text-gray-800">
                {percentage >= 80 ? '🎉 Xuất sắc! Bạn đã hoàn thành rất tốt.' :
                 percentage >= 60 ? '👍 Tốt! Bạn đã nắm được phần lớn kiến thức.' :
                 percentage >= 40 ? '📚 Bạn cần cố gắng hơn nữa.' :
                 '💪 Hãy xem lại bài học và thử lại nhé.'}
              </p>
            </div>

            {/* Detail */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-4 text-gray-800">Chi tiết kết quả:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số câu:</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Câu đã làm:</span>
                  <span className="font-semibold">{Object.keys(selectedAnswers).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Câu đúng:</span>
                  <span className="font-semibold text-green-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Câu sai:</span>
                  <span className="font-semibold text-red-600">{Object.keys(selectedAnswers).length - score}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleRetry}
                className="flex-1 text-white font-semibold py-3"
                style={{ backgroundColor: PRIMARY_COLOR }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                  Làm lại
                </Button>
              <Button 
                onClick={() => window.location.href = '/practice'}
                variant="outline"
                className="flex-1 font-semibold py-3 border-2"
                style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
              >
                Về danh sách đề
              </Button>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header - Info Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-2" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold mb-1 text-gray-800">{title}</h1>
              <p className="text-sm text-gray-600">Tổng số câu: {totalQuestions}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: timeRemaining < 300 ? '#fee2e2' : `${PRIMARY_COLOR}10` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={timeRemaining < 300 ? '#ef4444' : PRIMARY_COLOR}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-mono text-lg font-bold" style={{ color: timeRemaining < 300 ? '#ef4444' : PRIMARY_COLOR }}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Progress */}
              <div className="hidden md:block text-sm text-gray-600">
                Đã làm: <span className="font-semibold text-gray-800">{answeredCount}/{totalQuestions}</span>
              </div>
            </div>
        </div>
        
        {/* Progress bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300" 
              style={{ width: `${progress}%`, backgroundColor: PRIMARY_COLOR }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator - Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-6 border-2" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
              <h3 className="font-semibold mb-4 pb-2 border-b text-gray-800">
                Danh sách câu hỏi
              </h3>
              <div className="grid grid-cols-5 gap-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(index)}
                    className="aspect-square rounded-lg font-semibold text-sm transition-all"
                    style={{
                      backgroundColor: selectedAnswers[q.id] 
                        ? PRIMARY_COLOR
                        : currentQuestionIndex === index 
                        ? `${PRIMARY_COLOR}20`
                        : '#f3f4f6',
                      color: selectedAnswers[q.id] 
                        ? 'white'
                        : currentQuestionIndex === index
                        ? PRIMARY_COLOR
                        : '#6b7280',
                      border: currentQuestionIndex === index ? `2px solid ${PRIMARY_COLOR}` : '2px solid transparent'
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-4 border-2" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
              {/* Question Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}</div>
                  <div className="text-xs text-gray-400">Chọn 1 đáp án đúng</div>
          </div>
        </div>

              {/* Question Text */}
              <div 
                className="text-lg font-medium mb-6 leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }}
              />

              {/* Options */}
              <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id

                return (
                    <label
                    key={option.id}
                      className="flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                      style={{
                        borderColor: isSelected ? PRIMARY_COLOR : '#e5e7eb',
                        backgroundColor: isSelected ? `${PRIMARY_COLOR}10` : 'white'
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(option.id)}
                        className="mt-1 mr-3"
                        style={{ accentColor: PRIMARY_COLOR }}
                      />
                      <div className="flex-1">
                        <span className="font-semibold mr-2 text-gray-800">
                          {option.id}.
                        </span>
                        <span className="text-gray-800">
                          {option.text}
                      </span>
                  </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 font-semibold"
                style={{ 
                  backgroundColor: currentQuestionIndex === 0 ? '#e5e7eb' : PRIMARY_COLOR,
                  color: currentQuestionIndex === 0 ? '#9ca3af' : 'white'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Câu trước
          </Button>

            <Button
                onClick={handleSubmit}
                className="px-6 py-3 text-white font-semibold"
                style={{ backgroundColor: `${PRIMARY_COLOR}80` }}
              >
                Nộp bài
            </Button>

            <Button
              onClick={handleNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="flex items-center gap-2 px-6 py-3 font-semibold"
                style={{ 
                  backgroundColor: currentQuestionIndex === totalQuestions - 1 ? '#e5e7eb' : PRIMARY_COLOR,
                  color: currentQuestionIndex === totalQuestions - 1 ? '#9ca3af' : 'white'
                }}
            >
              Câu tiếp theo
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Button>
            </div>
          </div>
        </div>

        {/* Mobile Question Navigator - Bottom Sheet */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileNav(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 text-white"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {showMobileNav && (
            <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileNav(false)}>
              <div 
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Danh sách câu hỏi
                  </h3>
                  <button onClick={() => setShowMobileNav(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {questions.map((q, index) => (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(index)}
                      className="aspect-square rounded-lg font-semibold text-sm"
                      style={{
                        backgroundColor: selectedAnswers[q.id] 
                          ? PRIMARY_COLOR
                          : currentQuestionIndex === index 
                          ? `${PRIMARY_COLOR}20`
                          : '#f3f4f6',
                        color: selectedAnswers[q.id] 
                          ? 'white'
                          : currentQuestionIndex === index
                          ? PRIMARY_COLOR
                          : '#6b7280',
                        border: currentQuestionIndex === index ? `2px solid ${PRIMARY_COLOR}` : '2px solid transparent'
                      }}
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