'use client'

import React from 'react'
import { useStockData } from '@/hooks/useStockData'
import { formatPrice, formatVolume } from '@/services/stockApi'
import { Button } from '@/components/ui/Button'

export function MarketData() {
  const { data, loading, error, refresh, lastUpdated } = useStockData(30000) // Refresh every 30 seconds

  if (loading && !data) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-white/20 rounded mb-3 sm:mb-4 mx-auto w-48 sm:w-64"></div>
            <div className="h-3 sm:h-4 bg-white/10 rounded mb-6 sm:mb-8 mx-auto w-64 sm:w-96"></div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-2xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/10 rounded-lg p-3 sm:p-4">
                  <div className="h-3 sm:h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-5 sm:h-6 bg-white/20 rounded mb-1"></div>
                  <div className="h-2 sm:h-3 bg-white/20 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-red-200 text-xs sm:text-sm mb-4">{error}</p>
            <Button 
              onClick={refresh} 
              variant="outline" 
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white text-sm"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!data) return null

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Market Info */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Dữ liệu thị trường 
              </h2>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={refresh} 
                  size="sm" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-3"
                  disabled={loading}
                >
                  {loading ? '⟳' : '↻'} <span className="hidden sm:inline">Làm mới</span>
                </Button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">
              Dữ liệu thực từ các nguồn uy tín, cập nhật liên tục
            </p>
            
            {lastUpdated && (
              <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">
                Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')}
              </p>
            )}
            
            {/* Market Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {data.indices.map((index) => (
                <div key={index.index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-yellow-400 font-semibold text-xs sm:text-sm">{index.index}</span>
                    <span className={`text-xs sm:text-sm ${
                      index.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold">{formatPrice(index.value)}</div>
                  <div className={`text-xs sm:text-sm ${
                    index.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {index.change >= 0 ? '+' : ''}{formatPrice(index.change)}
                  </div>
                </div>
              ))}
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-purple-400 font-semibold text-xs sm:text-sm">KLGD</span>
                  <span className="text-gray-300 text-xs sm:text-sm">Tổng</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold">{formatVolume(data.marketStats.totalVolume)}</div>
                <div className="text-gray-300 text-xs sm:text-sm">Khối lượng giao dịch</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-orange-400 font-semibold text-xs sm:text-sm">GTGD</span>
                  <span className="text-gray-300 text-xs sm:text-sm">Tỷ VNĐ</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold">{formatPrice(data.marketStats.totalValue)}</div>
                <div className="text-gray-300 text-xs sm:text-sm">Giá trị giao dịch</div>
              </div>
            </div>

            {/* Market breadth */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-green-500/20 rounded-lg p-2 sm:p-3">
                <div className="text-green-400 font-bold text-base sm:text-lg">{data.marketStats.advances}</div>
                <div className="text-green-300 text-xs sm:text-sm">Mã tăng</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-2 sm:p-3">
                <div className="text-red-400 font-bold text-base sm:text-lg">{data.marketStats.declines}</div>
                <div className="text-red-300 text-xs sm:text-sm">Mã giảm</div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-2 sm:p-3">
                <div className="text-yellow-400 font-bold text-base sm:text-lg">{data.marketStats.unchanged}</div>
                <div className="text-yellow-300 text-xs sm:text-sm">Đứng giá</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold">
                  Biểu đồ {data.indices[0]?.index || 'VN-Index'}
                </h3>
                <div className="flex space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    (data.indices[0]?.changePercent || 0) >= 0 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}>
                    {(data.indices[0]?.changePercent || 0) >= 0 ? '+' : ''}
                    {(data.indices[0]?.changePercent || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
              
              {/* Dynamic SVG Chart */}
              <div className="h-40 sm:h-48 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Dynamic chart line based on real data */}
                  <path
                    d={generateChartPath(data.indices[0]?.changePercent || 0)}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  
                  {/* Data points */}
                  <circle cx="380" cy={120 - ((data.indices[0]?.changePercent || 0) * 10)} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                </svg>
                
                {/* Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-1 sm:px-2">
                  <span>9:00</span>
                  <span className="hidden sm:inline">11:30</span>
                  <span>13:00</span>
                  <span className="hidden sm:inline">14:30</span>
                  <span>15:00</span>
                </div>
              </div>
              
              {/* Chart indicators */}
              <div className="flex items-center justify-between mt-3 sm:mt-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    <span>Tăng</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <span>Giảm</span>
                  </div>
                </div>
                <div className="text-gray-400 text-xs">
                  Live data
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper function to generate chart path based on real data
function generateChartPath(changePercent: number): string {
  const baseY = 120
  const amplitude = Math.abs(changePercent) * 10 // Scale the change
  const isPositive = changePercent >= 0
  
  // Generate a realistic intraday chart
  const points = [
    { x: 20, y: baseY },
    { x: 60, y: baseY - (isPositive ? amplitude * 0.3 : -amplitude * 0.2) },
    { x: 100, y: baseY - (isPositive ? amplitude * 0.6 : -amplitude * 0.4) },
    { x: 140, y: baseY - (isPositive ? amplitude * 0.4 : -amplitude * 0.6) },
    { x: 180, y: baseY - (isPositive ? amplitude * 0.8 : -amplitude * 0.3) },
    { x: 220, y: baseY - (isPositive ? amplitude * 0.7 : -amplitude * 0.7) },
    { x: 260, y: baseY - (isPositive ? amplitude * 0.9 : -amplitude * 0.5) },
    { x: 300, y: baseY - (isPositive ? amplitude * 0.8 : -amplitude * 0.8) },
    { x: 340, y: baseY - (isPositive ? amplitude * 0.95 : -amplitude * 0.9) },
    { x: 380, y: baseY - amplitude * (isPositive ? 1 : -1) }
  ]
  
  return points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')
}
