import { NextResponse } from 'next/server'

// Simple health check API
export async function GET() {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
