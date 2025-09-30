import { Suspense } from 'react'
import QuestionsClient from './questions-client'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div></div>}>
      <QuestionsClient />
    </Suspense>
  )
}
