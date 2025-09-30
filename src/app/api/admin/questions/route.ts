import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// Get questions by set ID
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

    // Get setId from query params
    const { searchParams } = new URL(request.url)
    const setId = searchParams.get('setId')

    if (!setId) {
      return NextResponse.json({ error: 'Missing setId parameter' }, { status: 400 })
    }

    // Get questions for the set (schema: content, option_a..d, correct_option)
    const { data: questions, error } = await supabaseAdmin
      .from('questions')
      .select('id, content, option_a, option_b, option_c, option_d, correct_option, created_at')
      .eq('question_set_id', setId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to fetch questions:', error)
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }
    return NextResponse.json({ questions: questions || [] })

  } catch (error) {
    console.error('Admin questions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new question
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

    const { 
      question_set_id, 
      content, 
      option_a, 
      option_b, 
      option_c, 
      option_d, 
      correct_option 
    } = await request.json()
    
    // Validate required fields
    if (!question_set_id || !content?.trim() || !option_a?.trim() || 
        !option_b?.trim() || !option_c?.trim() || !option_d?.trim() || 
        !correct_option) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate correct_option
    if (!['A', 'B', 'C', 'D'].includes(correct_option)) {
      return NextResponse.json({ error: 'Invalid correct_option' }, { status: 400 })
    }

    // Create question (new schema with flat columns)
    const insertPayload = {
      question_set_id,
      content: content.trim(),
      option_a: option_a.trim(),
      option_b: option_b.trim(),
      option_c: option_c.trim(),
      option_d: option_d.trim(),
      correct_option
    }

    const { data, error } = await supabaseAdmin
      .from('questions')
      // @ts-expect-error - Supabase type issue with insert array
      .insert([insertPayload])
      .select('id, content, option_a, option_b, option_c, option_d, correct_option, created_at')
      .single()

    if (error) {
      console.error('Failed to create question:', error)
      return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
    }
    // Return created row
    if (!data) {
      return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
    }
    return NextResponse.json({ question: data })

  } catch (error) {
    console.error('Admin create question API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
