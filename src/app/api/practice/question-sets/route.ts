import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Get all available question sets for practice
export async function GET() {
  try {
    // Get question sets with question count
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
      return NextResponse.json({ error: 'Failed to fetch question sets' }, { status: 500 })
    }

    // Format the data
    type QuestionSetWithCount = {
      id: string
      title: string
      created_at: string
      questions: { count: number } | unknown[]
    }

    const formattedQuestionSets = ((questionSets as QuestionSetWithCount[]) || []).map(set => ({
      id: set.id,
      title: set.title,
      questionCount: Array.isArray(set.questions) ? set.questions.length : (set.questions as { count: number })?.count || 0,
      created_at: set.created_at
    }))

    return NextResponse.json({ questionSets: formattedQuestionSets })

  } catch (error) {
    console.error('Practice question sets API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
