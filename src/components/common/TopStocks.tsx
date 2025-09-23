'use client'

import React from 'react'
import { useStockData } from '@/hooks/useStockData'
import { Card, CardContent } from '@/components/ui/Card'
import { formatPrice, formatVolume } from '@/services/stockApi'
import { StockPrice } from '@/services/stockApi'

interface StockCardProps {
  stock: StockPrice
  index: number
}

function StockCard({ stock, index }: StockCardProps) {
  const isUp = stock.changePercent >= 0
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-blue-600">{stock.symbol}</h3>
            <p className="text-sm text-gray-600 truncate">{stock.name}</p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-semibold ${
            isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">{formatPrice(stock.price)}</span>
          <div className={`text-2xl ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {isUp ? '↗' : '↘'}
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          <div className="flex justify-between">
            <span>Thay đổi:</span>
            <span className={isUp ? 'text-green-600' : 'text-red-600'}>
              {isUp ? '+' : ''}{formatPrice(stock.change)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>KLGD:</span>
            <span>{formatVolume(stock.volume)}</span>
          </div>
        </div>
        
        {/* Mini chart */}
        <div className="mt-3 h-8">
          <svg className="w-full h-full" viewBox="0 0 100 20">
            <path
              d={generateMiniChart(stock.changePercent)}
              fill="none"
              stroke={isUp ? "#10b981" : "#ef4444"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        {/* Last updated */}
        <div className="text-xs text-gray-400 mt-2 text-center">
          Cập nhật: {new Date(stock.lastUpdated).toLocaleTimeString('vi-VN')}
        </div>
      </CardContent>
    </Card>
  )
}

function generateMiniChart(changePercent: number): string {
  const isUp = changePercent >= 0
  const amplitude = Math.min(Math.abs(changePercent) / 5, 8) // Scale down for mini chart
  
  if (isUp) {
    return `M 5 15 L 25 ${15 - amplitude * 0.3} L 45 ${15 - amplitude * 0.6} L 65 ${15 - amplitude * 0.4} L 85 ${15 - amplitude}`
  } else {
    return `M 5 5 L 25 ${5 + amplitude * 0.3} L 45 ${5 + amplitude * 0.6} L 65 ${5 + amplitude * 0.4} L 85 ${5 + amplitude}`
  }
}

export function TopStocks() {
  const { data, loading, error } = useStockData(60000) // Refresh every minute

  if (loading && !data) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top cổ phiếu được quan tâm
            </h2>
            <p className="text-gray-600">Đang tải dữ liệu thị trường...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Không thể tải dữ liệu</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (!data || !data.mostActive.length) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Top cổ phiếu được quan tâm
          </h2>
          <p className="text-gray-600">
            Dữ liệu thực từ thị trường chứng khoán Việt Nam
          </p>
        </div>

        {/* Most Active Stocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {data.mostActive.slice(0, 8).map((stock, index) => (
            <StockCard key={stock.symbol} stock={stock} index={index} />
          ))}
        </div>

        {/* Top Gainers & Losers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Gainers */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Top tăng giá
              </h3>
              <div className="space-y-3">
                {data.topGainers.slice(0, 5).map((stock, index) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-green-800">{stock.symbol}</div>
                      <div className="text-sm text-green-600">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700">{formatPrice(stock.price)}</div>
                      <div className="text-sm text-green-600">+{stock.changePercent.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                <span className="mr-2">📉</span>
                Top giảm giá
              </h3>
              <div className="space-y-3">
                {data.topLosers.slice(0, 5).map((stock, index) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-red-800">{stock.symbol}</div>
                      <div className="text-sm text-red-600">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-700">{formatPrice(stock.price)}</div>
                      <div className="text-sm text-red-600">{stock.changePercent.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
