'use client'

import { useState, useEffect, useCallback } from 'react'
import { stockApi, MarketOverview, StockPrice } from '@/services/stockApi'
import { ApiResponse } from '@/types'

interface UseStockDataReturn {
  data: MarketOverview | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  lastUpdated: Date | null
}

export function useStockData(refreshInterval: number = 30000): UseStockDataReturn {
  const [data, setData] = useState<MarketOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const response: ApiResponse<MarketOverview> = await stockApi.getMarketData()
      
      if (response.success && response.data) {
        setData(response.data)
        setLastUpdated(new Date())
      } else {
        setError(response.error || 'Failed to fetch market data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up interval for auto-refresh
    const interval = setInterval(() => {
      fetchData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdated
  }
}

interface UseStockPriceReturn {
  data: StockPrice | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useStockPrice(symbol: string): UseStockPriceReturn {
  const [data, setData] = useState<StockPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStockData = useCallback(async () => {
    if (!symbol) return

    try {
      setError(null)
      setLoading(true)
      const response = await stockApi.getStockData(symbol)
      
      if (response.success && response.data) {
        setData(response.data)
      } else {
        setError(response.error || `Failed to fetch ${symbol} data`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [symbol])

  const refresh = useCallback(async () => {
    await fetchStockData()
  }, [fetchStockData])

  useEffect(() => {
    fetchStockData()
  }, [fetchStockData])

  return {
    data,
    loading,
    error,
    refresh
  }
}

// Hook for ticker data (faster refresh)
export function useTickerData(refreshInterval: number = 5000) {
  const [tickerData, setTickerData] = useState<StockPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const response = await stockApi.getMarketData()
        if (response.success && response.data) {
          // Combine indices and top stocks for ticker
          const indices = response.data.indices.map(index => ({
            symbol: index.index,
            name: index.index,
            price: index.value,
            change: index.change,
            changePercent: index.changePercent,
            volume: index.volume,
            lastUpdated: index.lastUpdated
          }))
          
          const topStocks = response.data.mostActive.slice(0, 8)
          setTickerData([...indices, ...topStocks])
        }
      } catch (error) {
        console.error('Ticker data fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchTickerData()

    // Set up faster refresh for ticker
    const interval = setInterval(fetchTickerData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  return { tickerData, loading }
}

// Hook for market stats
export function useMarketStats() {
  const { data, loading, error } = useStockData(60000) // Refresh every minute
  
  const stats = data ? [
    {
      label: 'Tổng KLGD',
      value: data.marketStats.totalVolume,
      format: 'volume',
      icon: '📊'
    },
    {
      label: 'Tổng GTGD',
      value: data.marketStats.totalValue,
      format: 'billion',
      icon: '💰'
    },
    {
      label: 'Mã tăng',
      value: data.marketStats.advances,
      format: 'number',
      icon: '📈',
      color: 'green'
    },
    {
      label: 'Mã giảm',
      value: data.marketStats.declines,
      format: 'number',
      icon: '📉',
      color: 'red'
    }
  ] : []

  return { stats, loading, error }
}
