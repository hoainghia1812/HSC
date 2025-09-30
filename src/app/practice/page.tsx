import { Metadata } from 'next'
import PracticeList from '@/components/practice/PracticeList'

export const metadata: Metadata = {
  title: 'Danh sách Bộ Đề Trắc Nghiệm | Luyện tập online',
  description: 'Luyện tập với các bộ đề trắc nghiệm chất lượng cao',
}

export const dynamic = 'force-dynamic'

async function getQuestionSets() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/practice/question-sets`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch question sets')
    const data = await res.json()
    return data.questionSets
  } catch (error) {
    console.error('Error fetching question sets:', error)
    return []
  }
}

export default async function PracticePage() {
  const questionSets = await getQuestionSets()

  return (
    <div className="min-h-screen bg-white">

      <div className="relative">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-lg opacity-20 animate-pulse" style={{ backgroundColor: '#17a2b8' }} />
                <div className="relative bg-white backdrop-blur-sm rounded-2xl px-5 py-2.5 shadow-lg border-2" style={{ borderColor: '#17a2b8' }}>
                  <div className="flex items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#17a2b8">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    <span className="text-sm font-semibold" style={{ color: '#17a2b8' }}>
                      Luyện tập thông minh
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3">
              <span style={{ color: '#17a2b8' }}>
                Danh sách Bộ Đề Trắc Nghiệm
              </span>
            </h1>
            
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#17a2b8' }}>
              Chọn bộ đề phù hợp và bắt đầu luyện tập ngay
            </p>
          </div>

          {/* Practice List Component with Search & Pagination */}
          <PracticeList questionSets={questionSets} />
        </div>
      </div>
    </div>
  )
}