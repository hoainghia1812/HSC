import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Test database connection and question sets
export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabaseAdmin
      .from('question_sets')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('Database connection error:', testError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: testError.message 
      }, { status: 500 })
    }

    // Get all question sets
    const { data: questionSets, error } = await supabaseAdmin
      .from('question_sets')
      .select(`
        id,
        title,
        created_at,
        questions(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch question sets:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch question sets',
        details: error.message 
      }, { status: 500 })
    }

    console.log('Raw question sets from DB:', questionSets)

    // Format the data
    type QuestionSetWithCount = {
      id: string
      title: string
      created_at: string
      questions: { count: number } | unknown[]
    }

    const formattedQuestionSets = ((questionSets as QuestionSetWithCount[]) || []).map(set => {
      const questionCount = Array.isArray(set.questions) 
        ? set.questions.length 
        : (set.questions as { count: number })?.count || 0
      
      return {
        id: set.id,
        title: set.title,
        questionCount,
        created_at: set.created_at
      }
    })

    return NextResponse.json({ 
      success: true,
      questionSets: formattedQuestionSets,
      total: formattedQuestionSets.length,
      rawData: questionSets
    })

  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
