import { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import PracticeList from '@/components/practice/PracticeList'

export const metadata: Metadata = {
  title: 'Danh sách Bộ Đề Trắc Nghiệm | Luyện tập online',
  description: 'Luyện tập với các bộ đề trắc nghiệm chất lượng cao',
}

export const dynamic = 'force-dynamic'

async function getBaseUrl() {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}`
}

async function getQuestionSets() {
  try {
    console.log('Fetching question sets from API...')
    
    // ✅ Sử dụng headers() để lấy đúng host trên Vercel
    const baseUrl = await getBaseUrl()
    const url = `${baseUrl}/api/practice/question-sets`
    console.log('API URL:', url)
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    console.log('Response status:', res.status)
    console.log('Response ok:', res.ok)
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('API Error Response:', errorText)
      return []
    }
    
    const data = await res.json()
    console.log('API Response data:', data)
    console.log('Question sets count:', data.questionSets?.length || 0)
    
    // Always return an array, even if empty
    return Array.isArray(data.questionSets) ? data.questionSets : []
  } catch (error) {
    console.error('Fetch error:', error)
    return []
  }
}

export default async function PracticePage() {
  const questionSets = await getQuestionSets()
  
  console.log('PracticePage - questionSets:', questionSets)
  console.log('PracticePage - questionSets length:', questionSets?.length || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-indigo-100 text-indigo-600 font-semibold hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-md hover:shadow-lg group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12 text-center">
            {/* Badge */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-sm opacity-50"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="url(#gradient)">
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Luyện tập trắc nghiệm online
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Kho Đề Thi Trắc Nghiệm
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600 font-medium">
              Hơn <span className="text-indigo-600 font-bold">{questionSets.length}</span> bộ đề chất lượng cao
              <br />
              <span className="text-sm text-slate-500">Lựa chọn đề thi phù hợp và bắt đầu chinh phục điểm cao</span>
            </p>
          </div>

          {/* Practice List Component with Search & Pagination */}
          <PracticeList questionSets={questionSets} />
        </div>
      </div>
    </div>
  )
}