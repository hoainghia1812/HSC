import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyTokenEdge } from '@/lib/jwt-edge'

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Không có token xác thực' 
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify token
    const decoded = await verifyTokenEdge(token)
    if (!decoded) {
      return NextResponse.json({ 
        error: 'Token không hợp lệ' 
      }, { status: 401 })
    }

    const userId = decoded.id

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Fetch user results with question set details
    const { data: results, error, count } = await supabase
      .from('user_results')
      .select(`
        *,
        question_sets (
          id,
          title
        )
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('taken_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching user results:', error)
      return NextResponse.json({ 
        error: 'Lỗi khi lấy kết quả làm bài',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 })
    }

    return NextResponse.json({
      results: results || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in dashboard results API:', error)
    return NextResponse.json({ 
      error: 'Lỗi server',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

