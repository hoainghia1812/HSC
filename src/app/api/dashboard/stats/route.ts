import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyTokenEdge } from '@/lib/jwt-edge'
import { Database } from '@/types/database'

type UserResult = Database['public']['Tables']['user_results']['Row']

interface QuestionSetStats {
  [key: string]: {
    count: number
    totalScore: number
    bestScore: number
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Không có token xác thực' 
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify token
    const decoded = await verifyTokenEdge(token)
    if (!decoded) {
      return NextResponse.json({ 
        error: 'Token không hợp lệ' 
      }, { status: 401 })
    }

    const userId = decoded.id

    // Fetch all user results for stats calculation
    const { data: results, error } = await supabase
      .from('user_results')
      .select('*')
      .eq('user_id', userId) as { data: UserResult[] | null; error: unknown }

    if (error) {
      console.error('Error fetching user stats:', error)
      return NextResponse.json({ 
        error: 'Lỗi khi lấy thống kê',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }

    // Calculate statistics
    const totalTests = results?.length || 0
    const totalQuestions = results?.reduce((sum, r) => sum + r.total_questions, 0) || 0
    const totalCorrect = results?.reduce((sum, r) => sum + r.correct_count, 0) || 0
    const totalWrong = results?.reduce((sum, r) => sum + r.wrong_count, 0) || 0
    const averageScore = totalTests > 0 && results
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalTests)
      : 0
    const highestScore = totalTests > 0 && results
      ? Math.max(...results.map(r => r.score))
      : 0
    const lowestScore = totalTests > 0 && results
      ? Math.min(...results.map(r => r.score))
      : 0
    const accuracyRate = totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0

    // Get recent results (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentResults = results?.filter(r => 
      new Date(r.taken_at) >= sevenDaysAgo
    ) || []

    const recentTestsCount = recentResults.length

    // Calculate trend (comparing last 5 tests with previous 5 tests)
    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (totalTests >= 10 && results) {
      const lastFive = results.slice(0, 5).reduce((sum, r) => sum + r.score, 0) / 5
      const previousFive = results.slice(5, 10).reduce((sum, r) => sum + r.score, 0) / 5
      if (lastFive > previousFive + 5) trend = 'up'
      else if (lastFive < previousFive - 5) trend = 'down'
    }

    // Get best performance by question set
    const questionSetStats = results?.reduce((acc: QuestionSetStats, result) => {
      const setId = result.question_set_id
      if (!acc[setId]) {
        acc[setId] = {
          count: 0,
          totalScore: 0,
          bestScore: 0
        }
      }
      acc[setId].count++
      acc[setId].totalScore += result.score
      acc[setId].bestScore = Math.max(acc[setId].bestScore, result.score)
      return acc
    }, {} as QuestionSetStats) || {}

    return NextResponse.json({
      stats: {
        totalTests,
        totalQuestions,
        totalCorrect,
        totalWrong,
        averageScore,
        highestScore,
        lowestScore,
        accuracyRate,
        recentTestsCount,
        trend,
        questionSetStats
      }
    })

  } catch (error) {
    console.error('Error in dashboard stats API:', error)
    return NextResponse.json({ 
      error: 'Lỗi server',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

