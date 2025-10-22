import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { Database } from '@/types/database'

type QuestionSetWithRelations = {
  id: string
  title: string
  created_by: string
  created_at: string
  users: {
    full_name: string
  } | null
  questions: { count: number } | unknown[]
}

type QuestionSetInsert = Database['public']['Tables']['question_sets']['Insert']

// Get all question sets
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

    // Get question sets with creator info and question count
    const { data: questionSets, error } = await supabaseAdmin
      .from('question_sets')
      .select(`
        id,
        title,
        created_by,
        created_at,
        users!question_sets_created_by_fkey(full_name),
        questions(id)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch question sets:', error)
      return NextResponse.json({ error: 'Failed to fetch question sets' }, { status: 500 })
    }

    // Format the data with type assertion
    const formattedQuestionSets = (questionSets as QuestionSetWithRelations[])?.map(set => ({
      id: set.id,
      title: set.title,
      created_by: set.created_by,
      creator_name: set.users?.full_name || 'Unknown',
      question_count: Array.isArray(set.questions) ? set.questions.length : (set.questions as { count: number })?.count || 0,
      created_at: set.created_at
    })) || []

    return NextResponse.json({ questionSets: formattedQuestionSets })

  } catch (error) {
    console.error('Admin question sets API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new question set
export async function POST(request: NextRequest) {
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

    const { title } = await request.json()
    
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Create question set
    const questionSetData: QuestionSetInsert = {
      title: title.trim(),
      created_by: user.id
    }
    
    const { data, error } = await supabaseAdmin
      .from('question_sets')
      .insert([questionSetData] as never)
      .select()
      .single()

    if (error) {
      console.error('Failed to create question set:', error)
      return NextResponse.json({ error: 'Failed to create question set' }, { status: 500 })
    }

    return NextResponse.json({ questionSet: data })

  } catch (error) {
    console.error('Admin create question set API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
