import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Get all available question sets for practice - PUBLIC ACCESS
// All users can see all question sets created by any admin
export async function GET() {
  try {
    console.log('Fetching question sets for practice...')
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase environment variables not configured')
      return NextResponse.json({ 
        error: 'Database not configured',
        questionSets: [],
        total: 0
      }, { status: 200 })
    }
    
    // Get question sets with question count - NO AUTHENTICATION REQUIRED
    // This ensures all users can see all question sets
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
      // Return empty array instead of error to prevent page crash
      return NextResponse.json({ 
        error: 'Failed to fetch question sets',
        questionSets: [],
        total: 0,
        details: error.message
      }, { status: 200 })
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
      
      console.log(`Question set: ${set.title}, Questions: ${questionCount}`)
      
      return {
        id: set.id,
        title: set.title,
        questionCount,
        created_at: set.created_at
      }
    })

    console.log(`Found ${formattedQuestionSets.length} question sets for practice`)

    // Always return 200 status with data
    return NextResponse.json({ 
      questionSets: formattedQuestionSets,
      total: formattedQuestionSets.length,
      success: true
    })

  } catch (error) {
    console.error('Practice question sets API error:', error)
    // Return empty array instead of error to prevent page crash
    return NextResponse.json(
      { 
        error: 'Internal server error',
        questionSets: [],
        total: 0,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 }
    )
  }
}