import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Nếu body là 1 object thì chuyển thành mảng 1 phần tử
    const questions = Array.isArray(body) ? body : [body]

    for (const q of questions) {
      if (
        !q.question_set_id ||
        !q.content?.trim() ||
        !q.option_a?.trim() ||
        !q.option_b?.trim() ||
        !q.option_c?.trim() ||
        !q.correct_option
      ) {
        return NextResponse.json(
          { error: 'Question, options A–C and correct_option are required' },
          { status: 400 }
        )
      }

      // Nếu không có option_d thì không được chọn đáp án D
      if (!q.option_d?.trim() && q.correct_option === 'D') {
        return NextResponse.json(
          { error: 'Cannot choose D when option_d is empty' },
          { status: 400 }
        )
      }

      // Nếu option_d trống thì chỉ cho phép A, B, C
      if (!q.option_d?.trim() && !['A', 'B', 'C'].includes(q.correct_option)) {
        return NextResponse.json(
          { error: 'correct_option must be A, B, or C when option_d is empty' },
          { status: 400 }
        )
      }

      // Nếu có option_d thì cho phép A, B, C, D
      if (q.option_d?.trim() && !['A', 'B', 'C', 'D'].includes(q.correct_option)) {
        return NextResponse.json({ error: 'Invalid correct_option' }, { status: 400 })
      }
    }

    // Chuẩn hóa dữ liệu
    const insertPayload = questions.map((q) => ({
      question_set_id: q.question_set_id,
      content: q.content.trim(),
      option_a: q.option_a.trim(),
      option_b: q.option_b.trim(),
      option_c: q.option_c.trim(),
      option_d: q.option_d?.trim() || "Không có đáp án",
      correct_option: q.correct_option
    }))

    const { data, error } = await supabaseAdmin
      .from('questions')
      .insert(insertPayload as never)
      .select(
        'id, content, option_a, option_b, option_c, option_d, correct_option, created_at'
      )

    if (error || !data) {
      console.error('Practice create question error:', error)
      return NextResponse.json({ error: 'Failed to create questions' }, { status: 500 })
    }

    return NextResponse.json({ questions: data })
  } catch (error) {
    console.error('Practice create question API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
