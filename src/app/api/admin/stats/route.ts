import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token and check admin role
    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get stats from database
    const [usersResult, questionSetsResult, questionsResult, resultsResult] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact' }),
      supabaseAdmin.from('question_sets').select('id', { count: 'exact' }),
      supabaseAdmin.from('questions').select('id', { count: 'exact' }),
      supabaseAdmin.from('user_results').select('id', { count: 'exact' })
    ])

    return NextResponse.json({
      totalUsers: usersResult.count || 0,
      totalQuestionSets: questionSetsResult.count || 0,
      totalQuestions: questionsResult.count || 0,
      totalResults: resultsResult.count || 0
    })

  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
