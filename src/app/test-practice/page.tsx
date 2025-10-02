import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Practice Page',
  description: 'Test page for debugging practice functionality',
}

export default async function TestPracticePage() {
  // Test API call
  let testData = null
  let error = null

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/test-db`, {
      cache: 'no-store'
    })
    
    if (res.ok) {
      testData = await res.json()
    } else {
      error = await res.text()
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Test Practice Page</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Data:</h2>
            <pre className="bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>

          {error && (
            <div className="bg-red-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-red-800">Error:</h2>
              <pre className="bg-white p-4 rounded border overflow-auto text-red-600">
                {error}
              </pre>
            </div>
          )}

          <div className="bg-blue-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Environment Check:</h2>
            <p>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}</p>
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
