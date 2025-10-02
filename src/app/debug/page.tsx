import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Debug Page',
  description: 'Debug page for testing APIs',
}

export default async function DebugPage() {
  // Test multiple APIs
  const apis = [
    { name: 'Health Check', url: '/api/health' },
    { name: 'Simple Test', url: '/api/test-simple' },
    { name: 'Practice Question Sets', url: '/api/practice/question-sets' },
    { name: 'Test DB', url: '/api/test-db' }
  ]

  const results = await Promise.allSettled(
    apis.map(async (api) => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}${api.url}`, { cache: 'no-store' })
        const data = await res.json()
        return { ...api, status: res.status, data, success: res.ok }
      } catch (error) {
        return { ...api, status: 0, error: error instanceof Error ? error.message : 'Unknown error', success: false }
      }
    })
  )

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Debug Page</h1>
        
        <div className="space-y-6">
          {results.map((result, index) => {
            const api = apis[index]
            const isFulfilled = result.status === 'fulfilled'
            const data = isFulfilled ? result.value : null
            const error = !isFulfilled ? result.reason : null

            return (
              <div key={api.name} className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  {api.name}
                  <span className={`px-2 py-1 rounded text-sm ${
                    data?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {data?.status || 'Error'}
                  </span>
                </h2>
                
                <div className="mb-2">
                  <strong>URL:</strong> {api.url}
                </div>
                
                {data && (
                  <div className="mb-4">
                    <strong>Status:</strong> {data.status} {data.success ? '✅' : '❌'}
                  </div>
                )}
                
                <div className="bg-white p-4 rounded border overflow-auto max-h-96">
                  <pre className="text-sm">
                    {JSON.stringify(data || error, null, 2)}
                  </pre>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
