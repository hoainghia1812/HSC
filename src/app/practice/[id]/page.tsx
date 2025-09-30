import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import PracticeQuestions from '@/components/practice/practice-questions'
import { QuestionOption } from '@/types/database'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata(props: Promise<PageProps>): Promise<Metadata> {
  const { params } = await props
  const { data: questionSet, error } = await supabaseAdmin
    .from('question_sets')
    .select('title')
    .eq('id', params.id)
    .single()

  if (error || !questionSet) {
    return {
      title: 'Không tìm thấy | Trắc nghiệm online',
    }
  }

  const set = questionSet as { title: string }
  return {
    title: `${set.title} | Trắc nghiệm online`,
    description: `Luyện tập bộ đề ${set.title}`,
  }
}

interface QuestionSetRow { id: string; title: string }

async function getQuestionSet(id: string) {
  // Fetch set title
  const { data: setRow, error: setErr } = await supabaseAdmin
    .from('question_sets')
    .select('id, title')
    .eq('id', id)
    .single()
  if (setErr || !setRow) {
    console.error('Error fetching question set title:', setErr)
    return null
  }

  // Fetch questions in flat schema and map to component shape
  const { data: questions, error: qErr } = await supabaseAdmin
    .from('questions')
    .select('id, content, option_a, option_b, option_c, option_d, correct_option')
    .eq('question_set_id', id)
    .order('created_at', { ascending: true })

  if (qErr) {
    console.error('Error fetching questions:', qErr)
    return null
  }

  type FlatQuestion = { id: string; content: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_option: 'A'|'B'|'C'|'D' }
  const mapped = ((questions as FlatQuestion[]) || []).map((q: FlatQuestion) => {
    const opts: QuestionOption[] = [
      { id: 'A', text: q.option_a, is_correct: q.correct_option === 'A' },
      { id: 'B', text: q.option_b, is_correct: q.correct_option === 'B' },
      { id: 'C', text: q.option_c, is_correct: q.correct_option === 'C' },
      { id: 'D', text: q.option_d, is_correct: q.correct_option === 'D' },
    ]
    return {
      id: q.id,
      question_text: q.content,
      question_type: 'multiple_choice' as const,
      options: opts,
      explanation: null as string | null,
    }
  })

  return { id: (setRow as QuestionSetRow).id, title: (setRow as QuestionSetRow).title, questions: mapped }
}

export default async function PracticeQuestionSetPage(props: Promise<PageProps>) {
  const { params } = await props
  const questionSet = await getQuestionSet(params.id)

  if (!questionSet) {
    notFound()
  }

  return (
    <PracticeQuestions 
      questions={questionSet.questions}
      title={questionSet.title}
      timeLimit={45}
    />
  )
}