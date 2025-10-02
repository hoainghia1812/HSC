import { NextResponse } from 'next/server'

// Simple test API that doesn't depend on database
export async function GET() {
  try {
    // Return some mock data to test if API is working
    const mockQuestionSets = [
      {
        id: 'test-1',
        title: 'Đề thi thử Toán THPT',
        questionCount: 50,
        created_at: new Date().toISOString()
      },
      {
        id: 'test-2', 
        title: 'Đề thi thử Lý THPT',
        questionCount: 40,
        created_at: new Date().toISOString()
      }
    ]

    return NextResponse.json({ 
      questionSets: mockQuestionSets,
      total: mockQuestionSets.length,
      success: true,
      message: 'Mock data for testing'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
