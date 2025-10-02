import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      question_set_id,
      content,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option
    } = await request.json()

    if (!question_set_id || !content?.trim() || !option_a?.trim() || !option_b?.trim() || !option_c?.trim() || !option_d?.trim() || !correct_option) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (!['A','B','C','D'].includes(correct_option)) {
      return NextResponse.json({ error: 'Invalid correct_option' }, { status: 400 })
    }

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
      .insert([insertPayload] as never)
      .select('id, content, option_a, option_b, option_c, option_d, correct_option, created_at')
      .single()

    if (error || !data) {
      console.error('Practice create question error:', error)
      return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
    }

    return NextResponse.json({ question: data })
  } catch (error) {
    console.error('Practice create question API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


