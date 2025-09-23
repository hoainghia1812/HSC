'use client'

import React from 'react'
import { useTickerData } from '@/hooks/useStockData'
import { formatPrice } from '@/services/stockApi'

export function StockTicker() {
  const { tickerData, loading } = useTickerData(10000) // Refresh every 10 seconds

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-2">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-sm">Đang tải dữ liệu thị trường...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-2 overflow-hidden">
      <div className="flex">
        <div className="flex items-center space-x-8 px-4 ticker-scroll">
          {tickerData.map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-semibold text-yellow-400">{item.symbol}</span>
              <span className="font-mono text-white">{formatPrice(item.price)}</span>
              <span className={`text-sm font-medium ${
                item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
              <span className="text-gray-500 mx-2">•</span>
            </div>
          ))}
          {/* Duplicate for seamless scroll */}
          {tickerData.map((item, index) => (
            <div key={`${item.symbol}-dup-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-semibold text-yellow-400">{item.symbol}</span>
              <span className="font-mono text-white">{formatPrice(item.price)}</span>
              <span className={`text-sm font-medium ${
                item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
              <span className="text-gray-500 mx-2">•</span>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .ticker-scroll {
          animation: tickerScroll 60s linear infinite;
        }
        
        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
