'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

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
const PRIMARY_COLOR = '#17a2b8'

export default function PracticeList({ questionSets }: PracticeListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Debug logging
  console.log('PracticeList received questionSets:', questionSets)
  console.log('QuestionSets length:', questionSets?.length || 0)

  // Lọc theo tìm kiếm
  const filteredSets = useMemo(() => {
    if (!searchQuery.trim()) return questionSets
    
    const query = searchQuery.toLowerCase()
    return questionSets.filter(set => 
      set.title.toLowerCase().includes(query) ||
      (set.description && set.description.toLowerCase().includes(query))
    )
  }, [questionSets, searchQuery])

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
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 rounded-2xl blur opacity-10" style={{ backgroundColor: PRIMARY_COLOR }} />
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bộ đề theo tên..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-2xl border-2 bg-white shadow-lg focus:outline-none focus:ring-4 transition-all text-gray-800 placeholder:text-gray-400"
              style={{ 
                borderColor: `${PRIMARY_COLOR}40`,
                '--tw-ring-color': `${PRIMARY_COLOR}20`
              } as React.CSSProperties}
              onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
              onBlur={(e) => e.target.style.borderColor = `${PRIMARY_COLOR}40`}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute left-5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke={PRIMARY_COLOR}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Search Results Info */}
        {searchQuery && (
          <p className="text-center mt-4 text-gray-600">
            Tìm thấy <span className="font-bold" style={{ color: PRIMARY_COLOR }}>{filteredSets.length}</span> bộ đề
          </p>
        )}
      </div>

      {/* Question Sets Grid */}
      {currentSets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-10" style={{ backgroundColor: PRIMARY_COLOR }} />
            <div className="relative bg-white rounded-full p-8 shadow-xl border-2" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có đề thi nào'}
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {searchQuery 
              ? `Không tìm thấy bộ đề nào phù hợp với "${searchQuery}". Thử tìm kiếm với từ khóa khác.`
              : 'Hiện tại chưa có bộ đề trắc nghiệm nào. Vui lòng quay lại sau.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSets.map((set) => {
              return (
                <div key={set.id} className="group">
                  <div className="relative h-full">
                    {/* Hover glow effect */}
                    <div 
                      className="absolute -inset-0.5 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300" 
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    />
                    
                    {/* Card */}
                    <div className="relative h-full bg-white rounded-3xl shadow-lg border-2 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
                      {/* Top decoration */}
                      <div className="h-2" style={{ backgroundColor: PRIMARY_COLOR }} />
                      
                      <div className="p-6">
                        {/* Icon */}
                        <div className="mb-4">
                          <div className="inline-flex p-3 rounded-2xl" style={{ backgroundColor: PRIMARY_COLOR }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]" style={{ color: PRIMARY_COLOR }}>
                          {set.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm mb-4 line-clamp-2 min-h-[2.5rem]" style={{ color: PRIMARY_COLOR }}>
                          {set.description || `${set.questionCount} câu hỏi trắc nghiệm`}
                        </p>

                        {/* Info */}
                        <div className="flex items-center gap-4 mb-6 text-sm" style={{ color: PRIMARY_COLOR }}>
                          <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">{set.questionCount} câu</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">{new Date(set.created_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Link href={`/practice/${set.id}`} className="block">
                          <Button 
                            className="w-full text-white font-semibold py-3 transition-all duration-300 group-hover:scale-[1.02] hover:shadow-lg"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                          >
                            <span>Bắt đầu làm</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-white border-2 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all shadow-sm"
                style={{ 
                  borderColor: `${PRIMARY_COLOR}40`,
                  color: PRIMARY_COLOR 
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
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
                        className="min-w-[2.5rem] h-10 px-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                        style={
                          page === currentPage
                            ? { 
                                backgroundColor: PRIMARY_COLOR, 
                                color: 'white',
                                transform: 'scale(1.05)'
                              }
                            : { 
                                backgroundColor: 'white',
                                borderWidth: '2px',
                                borderColor: `${PRIMARY_COLOR}40`,
                                color: PRIMARY_COLOR
                              }
                        }
                      >
                        {page}
                      </button>
                    )
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 py-2 text-gray-400">
                        ...
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
                className="px-4 py-2 rounded-xl bg-white border-2 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all shadow-sm"
                style={{ 
                  borderColor: `${PRIMARY_COLOR}40`,
                  color: PRIMARY_COLOR 
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Pagination Info */}
          {totalPages > 1 && (
            <p className="text-center mt-4 text-sm" style={{ color: PRIMARY_COLOR }}>
              Trang {currentPage} / {totalPages} • Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredSets.length)} trong {filteredSets.length} bộ đề
            </p>
          )}
        </>
      )}
    </div>
  )
}