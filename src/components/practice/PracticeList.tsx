'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface QuestionSet {
  id: string
  title: string
  description?: string
  questionCount: number
  created_at: string
}

interface PracticeListProps {
  questionSets: QuestionSet[]
}

const ITEMS_PER_PAGE = 9

export default function PracticeList({ questionSets }: PracticeListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Debug logging
  console.log('PracticeList received questionSets:', questionSets)
  console.log('QuestionSets length:', questionSets?.length || 0)
  console.log('QuestionSets type:', typeof questionSets)
  console.log('Is Array:', Array.isArray(questionSets))

  // ✅ Defensive check: Đảm bảo questionSets là mảng
  const safeQuestionSets = useMemo(() => 
    Array.isArray(questionSets) ? questionSets : [],
    [questionSets]
  )

  // Lọc theo tìm kiếm
  const filteredSets = useMemo(() => {
    if (!searchQuery.trim()) return safeQuestionSets
    
    const query = searchQuery.toLowerCase()
    return safeQuestionSets.filter(set => 
      set.title.toLowerCase().includes(query) ||
      (set.description && set.description.toLowerCase().includes(query))
    )
  }, [safeQuestionSets, searchQuery])

  // Phân trang
  const totalPages = Math.ceil(filteredSets.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentSets = filteredSets.slice(startIndex, endIndex)

  // Reset về trang 1 khi search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative max-w-3xl mx-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-20"></div>
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-indigo-100 shadow-xl p-1.5 transition-all hover:shadow-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder=" Tìm kiếm bộ đề theo tên, nội dung..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-xl border-0 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              
              {/* Search button */}
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  title="Xóa tìm kiếm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-center mt-5">
            <p className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-100 shadow-md text-sm">
              <span className="text-slate-600">Tìm thấy</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full text-xs">
                {filteredSets.length}
              </span>
              <span className="text-slate-600">bộ đề</span>
            </p>
          </div>
        )}
      </div>

      {/* Question Sets Grid */}
      {currentSets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          {/* Empty state */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-2 border-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có đề thi nào'}
          </h3>
          
          <p className="text-slate-500 text-center max-w-md mb-6 leading-relaxed">
            {searchQuery 
              ? `Không tìm thấy bộ đề phù hợp với "${searchQuery}". Hãy thử từ khóa khác hoặc xóa bộ lọc.`
              : 'Hiện tại chưa có bộ đề trắc nghiệm nào. Vui lòng quay lại sau hoặc liên hệ quản trị viên.'}
          </p>
          
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentSets.map((set, index) => {
              // Alternating gradient colors for variety
              const gradients = [
                'from-indigo-500 to-purple-500',
                'from-purple-500 to-pink-500',
                'from-blue-500 to-indigo-500',
                'from-cyan-500 to-blue-500',
                'from-violet-500 to-purple-500',
                'from-indigo-500 to-blue-500',
              ]
              const gradient = gradients[index % gradients.length]
              
              return (
                <Link 
                  key={set.id} 
                  href={`/practice/${set.id}`} 
                  className="group block"
                >
                  <div className="relative h-full">
                    {/* Subtle hover glow */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                    
                    {/* Card Container */}
                    <div className="relative h-full bg-white rounded-2xl border border-slate-200/60 overflow-hidden transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1">
                      
                      {/* Top Accent */}
                      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                      
                      <div className="p-6">
                        {/* Title Section */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                            {set.title}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            {set.description || 'Bộ câu hỏi trắc nghiệm được tuyển chọn kỹ lưỡng'}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-slate-500 font-medium">Câu hỏi</div>
                              <div className="text-sm font-bold text-slate-800">{set.questionCount} câu</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-emerald-600 font-medium">100%</div>
                              <div className="text-sm font-bold text-emerald-700">Có trong đề thi</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}>
                          <span>Bắt đầu làm bài</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16">
              {/* Pagination controls */}
              <div className="flex items-center justify-center gap-3">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="group px-5 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-indigo-100 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-lg hover:shadow-xl disabled:hover:bg-white text-indigo-600"
                >
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">Trước</span>
                  </div>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first, last, current, and neighbors
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[3rem] h-12 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl ${
                            page === currentPage
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-110'
                              : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-3 py-2 text-slate-400 font-bold">
                          •••
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="group px-5 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-indigo-100 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-lg hover:shadow-xl disabled:hover:bg-white text-indigo-600"
                >
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">Sau</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Pagination Info */}
              <div className="text-center mt-6">
                <p className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-indigo-100 shadow-md text-sm text-slate-600">
                  <span className="font-semibold text-indigo-600">Trang {currentPage}</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-500">{totalPages}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">
                    Hiển thị <span className="font-semibold text-indigo-600">{startIndex + 1}-{Math.min(endIndex, filteredSets.length)}</span> trong <span className="font-semibold text-indigo-600">{filteredSets.length}</span> bộ đề
                  </span>
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}